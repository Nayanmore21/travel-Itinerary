import mongoose from 'mongoose';

const extractedDataSchema = new mongoose.Schema(
  {
    documentType: {
      type: String,
      enum: ['flight', 'hotel', 'transport', 'visa', 'other'],
      default: 'other',
    },
    origin: String,
    destination: String,
    departureDate: Date,
    returnDate: Date,
    flightNumber: String,
    airline: String,
    hotelName: String,
    checkIn: Date,
    checkOut: Date,
    passengerName: String,
    confirmationNo: String,
    rawText: String,
    confidence: { type: Number, min: 0, max: 1 },
  },
  { _id: false }
);

const documentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    itineraryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Itinerary', default: null },

    gridfsId: { type: mongoose.Schema.Types.ObjectId, required: true },
    originalName: { type: String, required: true },
    mimeType: { type: String, required: true },
    sizeBytes: { type: Number, required: true },

    extractionStatus: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'pending',
      index: true,
    },
    extractionError: { type: String, default: null },
    extractedData: extractedDataSchema,
  },
  { timestamps: true }
);

export default mongoose.model('Document', documentSchema);
