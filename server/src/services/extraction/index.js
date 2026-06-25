import mongoose from 'mongoose';
import { Readable } from 'stream';
import Document from '../../models/Document.js';
import { getGFSBucket } from '../../config/db.js';
import { extractFromPDF } from './pdf.extractor.js';
import { extractFromImage } from './image.extractor.js';
import { ExtractedBookingSchema } from '../ai/schemas.js';

const PDF_MIME = 'application/pdf';

const streamToBuffer = (readableStream) =>
  new Promise((resolve, reject) => {
    const chunks = [];
    readableStream.on('data', (chunk) => chunks.push(chunk));
    readableStream.on('end', () => resolve(Buffer.concat(chunks)));
    readableStream.on('error', reject);
  });

const extractSingleDocument = async (doc) => {
  await Document.findByIdAndUpdate(doc._id, { extractionStatus: 'processing' });

  try {
    const bucket = getGFSBucket();
    const downloadStream = bucket.openDownloadStream(new mongoose.Types.ObjectId(doc.gridfsId));
    const buffer = await streamToBuffer(downloadStream);

    let rawResult;
    if (doc.mimeType === PDF_MIME) {
      rawResult = await extractFromPDF(buffer);
    } else {
      rawResult = await extractFromImage(buffer, doc.mimeType);
    }

    const parsed = ExtractedBookingSchema.parse(rawResult);

    const extractedData = {
      ...parsed,
      departureDate: parsed.departureDate ? new Date(parsed.departureDate) : undefined,
      returnDate: parsed.returnDate ? new Date(parsed.returnDate) : undefined,
      checkIn: parsed.checkIn ? new Date(parsed.checkIn) : undefined,
      checkOut: parsed.checkOut ? new Date(parsed.checkOut) : undefined,
    };

    await Document.findByIdAndUpdate(doc._id, {
      extractionStatus: 'completed',
      extractedData,
    });
  } catch (err) {
    console.error(`[Extraction] Failed for document ${doc._id}:`, err.message);
    await Document.findByIdAndUpdate(doc._id, {
      extractionStatus: 'failed',
      extractionError: err.message,
    });
  }
};

export const runExtractionPipeline = async (documents) => {
  await Promise.allSettled(documents.map(extractSingleDocument));
};
