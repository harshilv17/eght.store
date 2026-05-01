import { AppError } from '../../middlewares/error.middleware.js';
import { slugify, paginate } from '../../utils/helpers.js';
import * as ProductModel from './product.model.js';
import { getCountryMeta, convertFromInr } from '../../utils/pricing.js';

function applyCurrency(product, country) {
  const meta = getCountryMeta(country);
  const round = (n) => Math.round(convertFromInr(parseFloat(n), country) * 100) / 100;
  return {
    ...product,
    currency: meta.currency,
    display_price: round(product.price),
    display_compare_price: product.compare_price ? round(product.compare_price) : null,
  };
}

export async function listProducts({ page, limit, category, search, country }) {
  const { limit: l, offset } = paginate(page, limit || 20);
  const products = await ProductModel.getProducts({ limit: l, offset, categorySlug: category, search });
  return products.map((p) => applyCurrency(p, country));
}

export async function getProduct(slug, country) {
  const product = await ProductModel.getProductBySlug(slug);
  if (!product) throw new AppError('Product not found', 404);
  return applyCurrency(product, country);
}

export async function addProduct(data) {
  const slug = data.slug || slugify(data.name);
  return ProductModel.createProduct({ ...data, slug });
}

export async function addVariant(productId, variantData) {
  return ProductModel.createVariant({ productId, ...variantData });
}

export async function listCategories() {
  return ProductModel.getCategories();
}

export async function addCategory(data) {
  const slug = data.slug || slugify(data.name);
  return ProductModel.createCategory({ ...data, slug });
}
