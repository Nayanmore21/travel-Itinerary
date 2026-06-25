import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/auth.routes.js';
import uploadRoutes from './routes/upload.routes.js';
import itineraryRoutes from './routes/itinerary.routes.js';
import shareRoutes from './routes/share.routes.js';
import errorMiddleware from './middleware/error.middleware.js';

const app = express();

app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));

app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/itineraries', itineraryRoutes);
app.use('/api/share', shareRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use(errorMiddleware);

export default app;
