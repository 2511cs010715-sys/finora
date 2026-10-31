// Global error handling middleware - avoids leaking stack traces or sensitive data
const errorHandler = (err, req, res, next) => {
  const statusCode = err.status || res.statusCode === 200 ? 500 : res.statusCode;

  console.error(`❌ [Error ${statusCode}] ${req.method} ${req.originalUrl}:`, err.message);

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {}),
  });
};

const notFound = (req, res, next) => {
  const error = new Error(`Resource Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

module.exports = { errorHandler, notFound };
