import * as ProductService from './product.service.js';
import { sendSuccess } from '../../utils/helpers.js';
import { resolveCountry } from '../../utils/pricing.js';

export async function listProducts(req, res, next) {
  try {
    const { page, limit, category, search } = req.query;
    const country = resolveCountry(req);
    const products = await ProductService.listProducts({ page: +page || 1, limit: +limit || 20, category, search, country });
    sendSuccess(res, products);
  } catch (err) { next(err); }
}

export async function getProduct(req, res, next) {
  try {
    const country = resolveCountry(req);
    const product = await ProductService.getProduct(req.params.slug, country);
    sendSuccess(res, product);
  } catch (err) { next(err); }
}

export async function createProduct(req, res, next) {
  try {
    const product = await ProductService.addProduct(req.body);
    sendSuccess(res, product, 201);
  } catch (err) { next(err); }
}

export async function createVariant(req, res, next) {
  try {
    const variant = await ProductService.addVariant(req.params.productId, req.body);
    sendSuccess(res, variant, 201);
  } catch (err) { next(err); }
}

export async function listCategories(req, res, next) {
  try {
    const categories = await ProductService.listCategories();
    sendSuccess(res, categories);
  } catch (err) { next(err); }
}

export async function createCategory(req, res, next) {
  try {
    const category = await ProductService.addCategory(req.body);
    sendSuccess(res, category, 201);
  } catch (err) { next(err); }
}
