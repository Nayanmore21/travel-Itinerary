import AppError from '../utils/AppError.js';

const errorMiddleware = (err, req, res, next) => {
  let { statusCode = 500, message, isOperational } = err;

  if (process.env.NODE_ENV === 'development') {
    console.error('[ERROR]', err);
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    message = `${field} already exists`;
    statusCode = 409;
    isOperational = true;
  }

  if (err.name === 'ValidationError') {
    message = Object.values(err.errors).map((e) => e.message).join(', ');
    statusCode = 400;
    isOperational = true;
  }

  if (err.name === 'JsonWebTokenError') {
    message = 'Invalid token';
    statusCode = 401;
    isOperational = true;
  }
  if (err.name === 'TokenExpiredError') {
    message = 'Token expired';
    statusCode = 401;
    isOperational = true;
  }

  if (!isOperational) {
    message = 'Internal server error';
  }

  res.status(statusCode).json({ success: false, message });
};

export default errorMiddleware;
