import { Request, Response } from 'express';
import { productRepo } from '../repos/product.repo';
import { plainToInstance } from 'class-transformer';
import { UUIDValidationDto } from '../dtos/common.dto';
import { validate } from 'class-validator';
import { CreateProductDto, UpdateProductDto } from '../dtos/product.dto';

const getAll = async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit?.toString() ?? '20');
    const offset = parseInt(req.query.offset?.toString() ?? '0');

    const products = await productRepo.getAll(limit, offset);
    return res.status(200).json({
      status: true,
      data: {
        products,
        limit,
        offset,
        total: products.length
      },
      message: 'Products found'
    });
  } catch (error) {
    console.log('Error in getAll: ', error);
    return res.status(500).json({
      status: false,
      message: 'Internal Server Error'
    });
  }
};

const getById = async (req: Request, res: Response) => {
  try {
    const uuidValidationObject = plainToInstance(UUIDValidationDto, {
      id: req.params.id
    });
    const errors = await validate(uuidValidationObject);

    if (errors.length > 0) {
      return res.status(400).json({
        status: false,
        message: 'Validation Error',
        errors
      });
    }

    const product = await productRepo.getById(uuidValidationObject.id);

    if (!product) {
      return res.status(404).json({
        status: false,
        message: 'Product not found'
      });
    }

    return res.status(200).json({
      status: true,
      data: product,
      message: 'Product found'
    });
  } catch (error) {
    console.log('Error in getById: ', error);
    return res.status(500).json({
      status: false,
      message: 'Internal Server Error'
    });
  }
};

const createProduct = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: false,
        message: 'Unauthorized'
      });
    }

    if (req.user.isAdmin !== true) {
      return res.status(403).json({
        status: false,
        message: 'Forbidden'
      });
    }

    const product = plainToInstance(CreateProductDto, req.body);
    const errors = await validate(product);

    if (errors.length > 0) {
      return res.status(400).json({
        status: false,
        message: 'Validation Error',
        errors
      });
    }

    const newProduct = await productRepo.createProduct(product);

    return res.status(201).json({
      status: true,
      data: newProduct,
      message: 'Product created'
    });
  } catch (error) {
    console.log('Error in createProduct: ', error);
    return res.status(500).json({
      status: false,
      message: 'Internal Server Error'
    });
  }
};

const updateProduct = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: false,
        message: 'Unauthorized'
      });
    }

    if (req.user.isAdmin !== true) {
      return res.status(403).json({
        status: false,
        message: 'Forbidden'
      });
    }

    const uuidValidationObject = plainToInstance(UUIDValidationDto, {
      id: req.params.id
    });

    const errors = await validate(uuidValidationObject);

    if (errors.length > 0) {
      return res.status(400).json({
        status: false,
        message: 'Validation Error',
        errors
      });
    }

    const product = await productRepo.getById(uuidValidationObject.id);

    if (!product) {
      return res.status(404).json({
        status: false,
        message: 'Product not found'
      });
    }

    const productValidationObject = plainToInstance(UpdateProductDto, req.body);

    const productValidationErrors = await validate(productValidationObject);

    if (productValidationErrors.length > 0) {
      return res.status(400).json({
        status: false,
        message: 'Validation Error',
        errors: productValidationErrors
      });
    }

    const updatedProduct = await productRepo.updateProduct({
      ...product,
      ...productValidationObject
    });

    return res.status(200).json({
      status: true,
      data: updatedProduct,
      message: 'Product updated'
    });
  } catch (error) {
    console.log('Error in updateProduct: ', error);
    return res.status(500).json({
      status: false,
      message: 'Internal Server Error'
    });
  }
};

const deleteProduct = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: false,
        message: 'Unauthorized'
      });
    }

    if (req.user.isAdmin !== true) {
      return res.status(403).json({
        status: false,
        message: 'Forbidden'
      });
    }

    const uuidValidationObject = plainToInstance(UUIDValidationDto, {
      id: req.params.id
    });

    const errors = await validate(uuidValidationObject);

    if (errors.length > 0) {
      return res.status(400).json({
        status: false,
        message: 'Validation Error',
        errors
      });
    }

    const product = await productRepo.getById(uuidValidationObject.id);

    if (!product) {
      return res.status(404).json({
        status: false,
        message: 'Product not found'
      });
    }

    await productRepo.deleteProduct(product.id);

    return res.status(200).json({
      status: true,
      message: 'Product deleted'
    });
  } catch (error) {
    console.log('Error in deleteProduct: ', error);
    return res.status(500).json({
      status: false,
      message: 'Internal Server Error'
    });
  }
};

export const productController = {
  getAll,
  getById,
  createProduct,
  updateProduct,
  deleteProduct
};
