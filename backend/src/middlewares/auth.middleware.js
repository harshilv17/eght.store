import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { AppError } from './error.middleware.js';

export function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return next(new AppError('No token provided', 401));
  }

  const token = authHeader.slice(7);
  try {
    const payload = jwt.verify(token, env.jwt.secret);
    req.user = payload;
    next();
  } catch {
    next(new AppError('Invalid or expired token', 401));
  }
}

// Sets req.user if valid Bearer token present, continues regardless.
export function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.slice(7);
    try {
      req.user = jwt.verify(token, env.jwt.secret);
    } catch {
      // invalid token — continue as guest
    }
  }
  next();
}

export function requireAdmin(req, res, next) {
  if (req.user?.role !== 'admin') {
    return next(new AppError('Admin access required', 403));
  }
  next();
}
