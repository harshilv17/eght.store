import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env.js';
import { AppError } from '../../middlewares/error.middleware.js';
import * as AuthModel from './auth.model.js';

function signAccessToken(payload) {
  return jwt.sign(payload, env.jwt.secret, { expiresIn: env.jwt.accessExpiresIn });
}

function signRefreshToken(payload) {
  return jwt.sign(payload, env.jwt.secret, { expiresIn: env.jwt.refreshExpiresIn });
}

function refreshTokenExpiry() {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  return d;
}

export async function register({ email, password, firstName, lastName }) {
  const existing = await AuthModel.findUserByEmail(email);
  if (existing) throw new AppError('Email already registered', 409);

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await AuthModel.createUser({ email, passwordHash, firstName, lastName });

  const tokenPayload = { sub: user.id, role: user.role };
  const accessToken = signAccessToken(tokenPayload);
  const refreshToken = signRefreshToken(tokenPayload);

  await AuthModel.saveRefreshToken(user.id, refreshToken, refreshTokenExpiry());

  return { user, accessToken, refreshToken };
}

export async function login({ email, password }) {
  const user = await AuthModel.findUserByEmail(email);
  if (!user || !user.is_active) throw new AppError('Invalid credentials', 401);

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) throw new AppError('Invalid credentials', 401);

  const tokenPayload = { sub: user.id, role: user.role };
  const accessToken = signAccessToken(tokenPayload);
  const refreshToken = signRefreshToken(tokenPayload);

  await AuthModel.saveRefreshToken(user.id, refreshToken, refreshTokenExpiry());

  const { password_hash, ...safeUser } = user;
  return { user: safeUser, accessToken, refreshToken };
}

export async function refresh(token) {
  if (!token) throw new AppError('Refresh token required', 401);

  const stored = await AuthModel.findRefreshToken(token);
  if (!stored) throw new AppError('Invalid or expired refresh token', 401);

  await AuthModel.revokeRefreshToken(token);

  const tokenPayload = { sub: stored.user_id, role: stored.role };
  const newAccessToken = signAccessToken(tokenPayload);
  const newRefreshToken = signRefreshToken(tokenPayload);

  await AuthModel.saveRefreshToken(stored.user_id, newRefreshToken, refreshTokenExpiry());

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
}

export async function logout(token) {
  if (token) await AuthModel.revokeRefreshToken(token);
}
