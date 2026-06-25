import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema(
  {
    time: String,
    title: { type: String, required: true },
    description: String,
    category: {
      type: String,
      enum: ['transport', 'sightseeing', 'food', 'hotel', 'leisure', 'shopping'],
      default: 'sightseeing',
    },
    tip: String,
    locationName: String,
    mapsQuery: String,
  },
  { _id: false }
);

const daySchema = new mongoose.Schema(
  {
    dayNumber: { type: Number, required: true },
    date: Date,
    theme: String,
    activities: [activitySchema],
  },
  { _id: false }
);

const itinerarySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    documentIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Document' }],

    tripSummary: {
      title: String,
      origin: String,
      destination: String,
      startDate: Date,
      endDate: Date,
      totalDays: Number,
      coverImageUrl: String,
    },

    bookings: {
      flights: [
        {
          flightNumber: String,
          airline: String,
          origin: String,
          destination: String,
          departure: Date,
          arrival: Date,
          confirmationNo: String,
          _id: false,
        },
      ],
      hotels: [
        {
          name: String,
          address: String,
          checkIn: Date,
          checkOut: Date,
          confirmationNo: String,
          _id: false,
        },
      ],
    },

    days: [daySchema],

    aiModel: { type: String, default: 'gemini-2.5-flash' },
    generationPrompt: String,

    shareToken: { type: String, unique: true, sparse: true, index: true },
    isPublic: { type: Boolean, default: false },
    shareViewCount: { type: Number, default: 0 },
    sharedAt: Date,

    status: {
      type: String,
      enum: ['generating', 'ready', 'failed'],
      default: 'generating',
      index: true,
    },
    generationError: String,
  },
  { timestamps: true }
);

export default mongoose.model('Itinerary', itinerarySchema);
