import mongoose from 'mongoose';
import { GridFSBucket } from 'mongodb';

let gfsBucket = null;

export const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGODB_URI);

  gfsBucket = new GridFSBucket(conn.connection.db, { bucketName: 'uploads' });

  console.log(`MongoDB connected: ${conn.connection.host}`);
  return conn;
};

export const getGFSBucket = () => {
  if (!gfsBucket) throw new Error('GridFS bucket not initialized — call connectDB first');
  return gfsBucket;
};
