import Itinerary from '../models/Itinerary.js';
import { success } from '../utils/response.js';
import AppError from '../utils/AppError.js';
import catchAsync from '../utils/catchAsync.js';

export const getSharedItinerary = catchAsync(async (req, res) => {
  const itinerary = await Itinerary.findOne({
    shareToken: req.params.shareToken,
    isPublic: true,
    status: 'ready',
  }).select('-generationPrompt -userId');

  if (!itinerary) throw new AppError('Itinerary not found or sharing is disabled', 404);

  Itinerary.findByIdAndUpdate(itinerary._id, { $inc: { shareViewCount: 1 } }).exec();

  success(res, { itinerary });
});
