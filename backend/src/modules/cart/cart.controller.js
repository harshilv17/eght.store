import * as CartService from './cart.service.js';
import { sendSuccess } from '../../utils/helpers.js';
import { resolveCountry } from '../../utils/pricing.js';

function getIdentifiers(req) {
  return {
    userId: req.user?.sub || null,
    sessionId: req.headers['x-session-id'] || null,
  };
}

export async function getCart(req, res, next) {
  try {
    const { userId, sessionId } = getIdentifiers(req);
    const cart = await CartService.getCart(userId, sessionId);
    sendSuccess(res, cart);
  } catch (err) { next(err); }
}

export async function addItem(req, res, next) {
  try {
    const { userId, sessionId } = getIdentifiers(req);
    const { variantId, quantity } = req.body;
    const items = await CartService.addItem(userId, sessionId, variantId, quantity);
    sendSuccess(res, items);
  } catch (err) { next(err); }
}

export async function updateItem(req, res, next) {
  try {
    const { userId, sessionId } = getIdentifiers(req);
    const { variantId, quantity } = req.body;
    const items = await CartService.updateItem(userId, sessionId, variantId, quantity);
    sendSuccess(res, items);
  } catch (err) { next(err); }
}

export async function removeItem(req, res, next) {
  try {
    const { userId, sessionId } = getIdentifiers(req);
    const items = await CartService.removeItem(userId, sessionId, req.params.variantId);
    sendSuccess(res, items);
  } catch (err) { next(err); }
}

export async function getTotals(req, res, next) {
  try {
    const { userId, sessionId } = getIdentifiers(req);
    const country = resolveCountry(req);
    const totals = await CartService.getCartTotals(userId, sessionId, country);
    sendSuccess(res, { country, ...totals });
  } catch (err) { next(err); }
}
