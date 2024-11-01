export function errorHandler(err, req, res, next) {
  console.error(err.stack);

  if (err.type === 'rate_limit_exceeded') {
    return res.status(429).json({
      error: 'Too many requests',
      retryAfter: err.retryAfter
    });
  }

  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
}