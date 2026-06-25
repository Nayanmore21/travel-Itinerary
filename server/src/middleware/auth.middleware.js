import { verifyAccessToken } from '../utils/jwt.js';
import AppError from '../utils/AppError.js';
import catchAsync from '../utils/catchAsync.js';
import User from '../models/User.js';

export const protect = catchAsync(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AppError('Authentication required', 401);
  }

  const token = authHeader.split(' ')[1];
  const decoded = verifyAccessToken(token);

  const user = await User.findById(decoded.id).select('-passwordHash -refreshTokens');
  if (!user) throw new AppError('User no longer exists', 401);

  req.user = user;
  next();
});
