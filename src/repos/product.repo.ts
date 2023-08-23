import { In } from 'typeorm';
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

const getByIds = async (ids: string[]) => {
  return await ds.getRepository(Product).find({
    where: { id: In(ids) }
  });
};

const createProduct = async (product: CreateProductDto) => {
  return await ds.getRepository(Product).save(product);
};

const createProducts = async (products: CreateProductDto[]) => {
  return await ds.getRepository(Product).save(products);
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
  getByIds,
  createProduct,
  createProducts,
  updateProduct,
  deleteProduct
};
