export const success = (res, data, statusCode = 200, meta = {}) => {
  res.status(statusCode).json({ success: true, data, ...meta });
};

export const error = (res, message, statusCode = 500) => {
  res.status(statusCode).json({ success: false, message });
};
