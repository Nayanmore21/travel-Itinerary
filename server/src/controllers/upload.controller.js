import mongoose from 'mongoose';
import { Readable } from 'stream';
import Document from '../models/Document.js';
import { getGFSBucket } from '../config/db.js';
import { success } from '../utils/response.js';
import AppError from '../utils/AppError.js';
import catchAsync from '../utils/catchAsync.js';
import { runExtractionPipeline } from '../services/extraction/index.js';

const writeBufferToGridFS = (buffer, filename, mimeType, metadata) =>
  new Promise((resolve, reject) => {
    const bucket = getGFSBucket();
    const uploadStream = bucket.openUploadStream(filename, { contentType: mimeType, metadata });
    const readable = Readable.from(buffer);
    readable.pipe(uploadStream);
    uploadStream.on('finish', () => resolve(uploadStream.id));
    uploadStream.on('error', reject);
  });

export const uploadDocuments = catchAsync(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    throw new AppError('No files uploaded', 400);
  }

  const documents = await Promise.all(
    req.files.map(async (file) => {
      const safeName = `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`;
      const gridfsId = await writeBufferToGridFS(
        file.buffer,
        safeName,
        file.mimetype,
        { userId: req.user._id.toString(), originalName: file.originalname }
      );

      return Document.create({
        userId: req.user._id,
        gridfsId,
        originalName: file.originalname,
        mimeType: file.mimetype,
        sizeBytes: file.size,
        extractionStatus: 'pending',
      });
    })
  );

  success(res, { documents }, 202);

  setImmediate(() => runExtractionPipeline(documents));
});

export const listDocuments = catchAsync(async (req, res) => {
  const documents = await Document.find({ userId: req.user._id }).sort({ createdAt: -1 });
  success(res, { documents });
});

export const getDocument = catchAsync(async (req, res) => {
  const doc = await Document.findOne({ _id: req.params.id, userId: req.user._id });
  if (!doc) throw new AppError('Document not found', 404);
  success(res, { document: doc });
});

export const deleteDocument = catchAsync(async (req, res) => {
  const doc = await Document.findOne({ _id: req.params.id, userId: req.user._id });
  if (!doc) throw new AppError('Document not found', 404);

  try {
    await getGFSBucket().delete(new mongoose.Types.ObjectId(doc.gridfsId));
  } catch {
    // File may already be gone; continue with DB cleanup
  }

  await doc.deleteOne();
  success(res, null, 204);
});

export const streamFile = catchAsync(async (req, res) => {
  const doc = await Document.findOne({ _id: req.params.id, userId: req.user._id });
  if (!doc) throw new AppError('Document not found', 404);

  res.set('Content-Type', doc.mimeType);
  res.set('Content-Disposition', `inline; filename="${doc.originalName}"`);

  const downloadStream = getGFSBucket().openDownloadStream(
    new mongoose.Types.ObjectId(doc.gridfsId)
  );
  downloadStream.on('error', () => res.status(404).end());
  downloadStream.pipe(res);
});
