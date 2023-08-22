import { CreateProductDto } from '../dtos/product.dto';
import { Product } from '../models/Product.model';
import { ds } from '../utils/datasource';

const getAll = async (limit: number = 20, offset: number = 0) => {
  return await ds.getRepository(Product).find({
    take: limit,
    skip: offset
  });
};

const getById = async (id: string) => {
  return await ds.getRepository(Product).findOne({
    where: { id }
  });
};

const createProduct = async (product: CreateProductDto) => {
  return await ds.getRepository(Product).save(product);
};

const updateProduct = async (product: Product) => {
  return await ds.getRepository(Product).save(product);
};

const deleteProduct = async (id: string) => {
  return await ds.getRepository(Product).delete(id);
};

export const productRepo = {
  getAll,
  getById,
  createProduct,
  updateProduct,
  deleteProduct
};