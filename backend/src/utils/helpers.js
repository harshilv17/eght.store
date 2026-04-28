import crypto from 'crypto';

export function slugify(text) {
  return text.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
}

export function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export function generateOrderId() {
  return `EGHT-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
}

export function paginate(page = 1, limit = 20) {
  const offset = (Math.max(1, page) - 1) * limit;
  return { limit: Math.min(limit, 100), offset };
}

export function sendSuccess(res, data, statusCode = 200) {
  return res.status(statusCode).json({ success: true, data });
}

export function sendError(res, message, statusCode = 400) {
  return res.status(statusCode).json({ success: false, error: message });
}
