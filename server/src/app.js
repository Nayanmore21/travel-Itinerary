import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/auth.routes.js';
import uploadRoutes from './routes/upload.routes.js';
import itineraryRoutes from './routes/itinerary.routes.js';
import shareRoutes from './routes/share.routes.js';
import errorMiddleware from './middleware/error.middleware.js';

const app = express();

const DEV_ORIGIN = 'http://localhost:5173';

// CLIENT_ORIGIN can be a single URL or comma-separated list of URLs
const allowedOrigins = (process.env.CLIENT_ORIGIN || DEV_ORIGIN)
  .split(',')
  .map((o) => o.trim());

app.use(cors({
  origin: (origin, callback) => {
    // Allow server-to-server / curl (no origin header)
    if (!origin) return callback(null, true);
    // Allow exact matches
    if (allowedOrigins.includes(origin)) return callback(null, true);
    // Allow all Vercel preview deploy subdomains
    if (/\.vercel\.app$/.test(origin)) return callback(null, true);
    callback(new Error(`CORS: origin ${origin} not allowed`));
  },
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
