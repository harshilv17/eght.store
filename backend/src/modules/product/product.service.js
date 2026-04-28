import { AppError } from '../../middlewares/error.middleware.js';
import { slugify, paginate } from '../../utils/helpers.js';
import * as ProductModel from './product.model.js';

export async function listProducts({ page, limit, category, search }) {
  const { limit: l, offset } = paginate(page, limit || 20);
  const products = await ProductModel.getProducts({ limit: l, offset, categorySlug: category, search });
  return products;
}

export async function getProduct(slug) {
  const product = await ProductModel.getProductBySlug(slug);
  if (!product) throw new AppError('Product not found', 404);
  return product;
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
