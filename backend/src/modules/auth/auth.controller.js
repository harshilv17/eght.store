import * as AuthService from './auth.service.js';
import { sendSuccess } from '../../utils/helpers.js';

const COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export async function register(req, res, next) {
  try {
    const { user, accessToken, refreshToken } = await AuthService.register(req.body);
    res.cookie('refresh_token', refreshToken, COOKIE_OPTS);
    sendSuccess(res, { user, accessToken }, 201);
  } catch (err) { next(err); }
}

export async function login(req, res, next) {
  try {
    const { user, accessToken, refreshToken } = await AuthService.login(req.body);
    res.cookie('refresh_token', refreshToken, COOKIE_OPTS);
    sendSuccess(res, { user, accessToken });
  } catch (err) { next(err); }
}

export async function refresh(req, res, next) {
  try {
    const token = req.cookies?.refresh_token;
    const { accessToken, refreshToken } = await AuthService.refresh(token);
    res.cookie('refresh_token', refreshToken, COOKIE_OPTS);
    sendSuccess(res, { accessToken });
  } catch (err) { next(err); }
}

export async function logout(req, res, next) {
  try {
    const token = req.cookies?.refresh_token;
    await AuthService.logout(token);
    res.clearCookie('refresh_token');
    sendSuccess(res, { message: 'Logged out' });
  } catch (err) { next(err); }
}

export async function me(req, res, next) {
  try {
    const { findUserById } = await import('./auth.model.js');
    const user = await findUserById(req.user.sub);
    sendSuccess(res, { user });
  } catch (err) { next(err); }
}
