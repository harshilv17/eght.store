import { logger } from '../utils/logger.js';

export function errorMiddleware(err, req, res, next) {
  logger.error({ err, method: req.method, url: req.url }, 'Unhandled error');

  if (err.name === 'ZodError') {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: err.errors.map(e => ({ field: e.path.join('.'), message: e.message })),
    });
  }

  if (err.code === '23505') {
    return res.status(409).json({ success: false, error: 'Resource already exists' });
  }

  if (err.code === '23503') {
    return res.status(400).json({ success: false, error: 'Referenced resource not found' });
  }

  const statusCode = err.statusCode || 500;
  const message = statusCode < 500 ? err.message : 'Internal server error';

  return res.status(statusCode).json({ success: false, error: message });
}

export class AppError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
  }
}
