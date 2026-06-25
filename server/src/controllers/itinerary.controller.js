import Document from '../models/Document.js';
import Itinerary from '../models/Itinerary.js';
import { generateItinerary as geminiGenerateItinerary } from '../services/ai/gemini.service.js';
import { buildItineraryPrompt } from '../services/ai/prompts.js';
import { ItineraryOutputSchema } from '../services/ai/schemas.js';
import { generateUniqueToken } from '../services/share/share.service.js';
import { success } from '../utils/response.js';
import AppError from '../utils/AppError.js';
import catchAsync from '../utils/catchAsync.js';

const PAGE_SIZE = 12;

const fetchCoverImage = async (destination) => {
  try {
    const key = process.env.UNSPLASH_ACCESS_KEY;
    if (!key) return null;
    const res = await fetch(
      `https://api.unsplash.com/photos/random?query=${encodeURIComponent(destination + ' travel')}&orientation=landscape&client_id=${key}`
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data?.urls?.regular || null;
  } catch {
    return null;
  }
};

const aggregateBookings = (documents) => {
  const flights = [];
  const hotels = [];
  const dates = [];

  for (const doc of documents) {
    const d = doc.extractedData;
    if (!d) continue;

    if (d.documentType === 'flight') {
      flights.push({
        flightNumber: d.flightNumber,
        airline: d.airline,
        origin: d.origin,
        destination: d.destination,
        departure: d.departureDate,
        confirmationNo: d.confirmationNo,
      });
      if (d.departureDate) dates.push(new Date(d.departureDate));
      if (d.returnDate) dates.push(new Date(d.returnDate));
    }

    if (d.documentType === 'hotel') {
      hotels.push({
        name: d.hotelName,
        checkIn: d.checkIn,
        checkOut: d.checkOut,
        confirmationNo: d.confirmationNo,
      });
      if (d.checkIn) dates.push(new Date(d.checkIn));
      if (d.checkOut) dates.push(new Date(d.checkOut));
    }
  }

  flights.sort((a, b) => new Date(a.departure) - new Date(b.departure));

  const startDate = dates.length ? new Date(Math.min(...dates)) : null;
  const endDate = dates.length ? new Date(Math.max(...dates)) : null;
  const totalDays =
    startDate && endDate
      ? Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1
      : null;

  const destination =
    flights[flights.length - 1]?.destination ||
    hotels[0]?.name ||
    'Unknown Destination';

  const origin = flights[0]?.origin || 'Unknown Origin';

  return { flights, hotels, startDate, endDate, totalDays, destination, origin };
};

export const generateItinerary = catchAsync(async (req, res) => {
  const { documentIds } = req.body;
  if (!documentIds || !Array.isArray(documentIds) || documentIds.length === 0) {
    throw new AppError('documentIds array is required', 400);
  }

  const docs = await Document.find({
    _id: { $in: documentIds },
    userId: req.user._id,
  });

  if (docs.length !== documentIds.length) {
    throw new AppError('One or more documents not found', 404);
  }

  const incomplete = docs.filter((d) => d.extractionStatus !== 'completed');
  if (incomplete.length > 0) {
    throw new AppError('All documents must finish extraction before generating an itinerary', 400);
  }

  const { flights, hotels, startDate, endDate, totalDays, destination, origin } =
    aggregateBookings(docs);

  const itinerary = await Itinerary.create({
    userId: req.user._id,
    documentIds,
    bookings: { flights, hotels },
    tripSummary: { origin, destination, startDate, endDate, totalDays },
    status: 'generating',
  });

  success(res, { itinerary }, 202);

  setImmediate(async () => {
    try {
      const prompt = buildItineraryPrompt({ flights, hotels, startDate, endDate, destination, origin });
      const aiOutput = await geminiGenerateItinerary(prompt);
      const validated = ItineraryOutputSchema.parse(aiOutput);

      const coverImageUrl = await fetchCoverImage(destination);

      await Itinerary.findByIdAndUpdate(itinerary._id, {
        'tripSummary.title': validated.title,
        'tripSummary.coverImageUrl': coverImageUrl,
        days: validated.days.map((d) => ({ ...d, date: d.date ? new Date(d.date) : undefined })),
        generationPrompt: prompt,
        status: 'ready',
      });

      await Document.updateMany(
        { _id: { $in: documentIds } },
        { itineraryId: itinerary._id }
      );
    } catch (err) {
      console.error('[Itinerary Generation] Failed:', err.message);
      await Itinerary.findByIdAndUpdate(itinerary._id, {
        status: 'failed',
        generationError: err.message,
      });
    }
  });
});

export const listItineraries = catchAsync(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const skip = (page - 1) * PAGE_SIZE;

  const [itineraries, total] = await Promise.all([
    Itinerary.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(PAGE_SIZE)
      .select('-days -generationPrompt'),
    Itinerary.countDocuments({ userId: req.user._id }),
  ]);

  success(res, { itineraries }, 200, {
    pagination: { page, pageSize: PAGE_SIZE, total, pages: Math.ceil(total / PAGE_SIZE) },
  });
});

export const getItinerary = catchAsync(async (req, res) => {
  const itinerary = await Itinerary.findOne({ _id: req.params.id, userId: req.user._id });
  if (!itinerary) throw new AppError('Itinerary not found', 404);
  success(res, { itinerary });
});

export const deleteItinerary = catchAsync(async (req, res) => {
  const itinerary = await Itinerary.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
  if (!itinerary) throw new AppError('Itinerary not found', 404);
  success(res, null, 204);
});

export const regenerateItinerary = catchAsync(async (req, res) => {
  const itinerary = await Itinerary.findOne({ _id: req.params.id, userId: req.user._id });
  if (!itinerary) throw new AppError('Itinerary not found', 404);

  req.body = { documentIds: itinerary.documentIds.map(String) };
  await itinerary.deleteOne();

  return generateItinerary(req, res);
});

export const enableSharing = catchAsync(async (req, res) => {
  let itinerary = await Itinerary.findOne({ _id: req.params.id, userId: req.user._id });
  if (!itinerary) throw new AppError('Itinerary not found', 404);

  if (!itinerary.shareToken) {
    const shareToken = await generateUniqueToken();
    itinerary = await Itinerary.findByIdAndUpdate(
      itinerary._id,
      { shareToken, isPublic: true, sharedAt: new Date() },
      { new: true }
    );
  } else {
    await Itinerary.findByIdAndUpdate(itinerary._id, { isPublic: true });
  }

  const shareUrl = `${process.env.CLIENT_ORIGIN}/s/${itinerary.shareToken}`;
  success(res, { shareToken: itinerary.shareToken, shareUrl });
});

export const disableSharing = catchAsync(async (req, res) => {
  const itinerary = await Itinerary.findOne({ _id: req.params.id, userId: req.user._id });
  if (!itinerary) throw new AppError('Itinerary not found', 404);
  await Itinerary.findByIdAndUpdate(itinerary._id, { isPublic: false });
  success(res, null, 204);
});
