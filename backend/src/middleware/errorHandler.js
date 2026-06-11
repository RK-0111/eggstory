/** Central error handler — every thrown error in the app ends up here. */
export function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  const status = err.status || 500;
  if (status >= 500) console.error(err);
  // 503 = service not configured (e.g. missing Razorpay keys) — show the real message
  const hideMessage = status >= 500 && status !== 503;
  res.status(status).json({
    error: hideMessage ? 'Something went wrong on our side.' : err.message,
  });
}

export function notFound(req, res) {
  res.status(404).json({ error: 'Route not found' });
}
