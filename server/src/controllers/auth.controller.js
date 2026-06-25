import User from '../models/User.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt.js';
import { success } from '../utils/response.js';
import AppError from '../utils/AppError.js';
import catchAsync from '../utils/catchAsync.js';

const COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const issueTokens = (userId) => ({
  accessToken: signAccessToken({ id: userId }),
  refreshToken: signRefreshToken({ id: userId }),
});

export const register = catchAsync(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) throw new AppError('name, email and password are required', 400);
  if (password.length < 8) throw new AppError('Password must be at least 8 characters', 400);

  const user = new User({ name, email, passwordHash: password });
  const { accessToken, refreshToken } = issueTokens(user._id);
  user.refreshTokens = [refreshToken];
  await user.save();

  res.cookie('refreshToken', refreshToken, COOKIE_OPTS);
  success(res, { user: user.toSafeObject(), accessToken }, 201);
});

export const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) throw new AppError('email and password are required', 400);

  const user = await User.findOne({ email }).select('+passwordHash +refreshTokens');
  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Invalid credentials', 401);
  }

  const { accessToken, refreshToken } = issueTokens(user._id);
  user.refreshTokens = [...(user.refreshTokens || []).slice(-4), refreshToken];
  await user.save();

  res.cookie('refreshToken', refreshToken, COOKIE_OPTS);
  success(res, { user: user.toSafeObject(), accessToken });
});

export const refresh = catchAsync(async (req, res) => {
  const token = req.cookies?.refreshToken || req.body?.refreshToken;
  if (!token) throw new AppError('Refresh token required', 401);

  let decoded;
  try {
    decoded = verifyRefreshToken(token);
  } catch {
    throw new AppError('Invalid or expired refresh token', 401);
  }

  const user = await User.findById(decoded.id).select('+refreshTokens');
  if (!user || !user.refreshTokens.includes(token)) {
    if (user) { user.refreshTokens = []; await user.save(); }
    throw new AppError('Refresh token reuse detected', 401);
  }

  const { accessToken, refreshToken: newRefreshToken } = issueTokens(user._id);
  user.refreshTokens = user.refreshTokens.filter((t) => t !== token).concat(newRefreshToken);
  await user.save();

  res.cookie('refreshToken', newRefreshToken, COOKIE_OPTS);
  success(res, { accessToken });
});

export const logout = catchAsync(async (req, res) => {
  const token = req.cookies?.refreshToken || req.body?.refreshToken;
  if (token) {
    const user = await User.findById(req.user._id).select('+refreshTokens');
    if (user) {
      user.refreshTokens = user.refreshTokens.filter((t) => t !== token);
      await user.save();
    }
  }
  res.clearCookie('refreshToken');
  success(res, null, 204);
});

export const getMe = catchAsync(async (req, res) => {
  success(res, { user: req.user });
});
