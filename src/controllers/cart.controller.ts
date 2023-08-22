import { Request, Response } from 'express';
import { userRepo } from '../repos/user.repo';
import { plainToInstance } from 'class-transformer';
import {
  AddToCartDto,
  RemoveFromCartDto,
  UpdateCartItems
} from '../dtos/cart.dto';
import { validate } from 'class-validator';
import { CartItem, CartItemType } from '../models/User.model';
import { productRepo } from '../repos/product.repo';
import { serviceRepo } from '../repos/service.repo';

const getCart = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: false,
        message: 'Unauthorized'
      });
    }

    const user = req.user;

    const productIds: string[] = [];
    const serviceIds: string[] = [];

    user.cart.map((item: CartItem) => {
      if (item.itemType === CartItemType.PRODUCT) productIds.push(item.itemId);
      else serviceIds.push(item.itemId);
    });

    const products = await productRepo.getByIds(productIds);

    const services = await serviceRepo.getByIds(serviceIds);

    const cartItems = user.cart.map((item: CartItem) => {
      if (item.itemType === CartItemType.PRODUCT) {
        const product = products.find((p) => p.id === item.itemId);
        return {
          ...item,
          item: product
        };
      } else {
        const service = services.find((s) => s.id === item.itemId);
        return {
          ...item,
          item: service
        };
      }
    });

    return res.status(200).json({
      status: true,
      data: cartItems
    });
  } catch (error) {
    console.log('Error in getCart: ', error);
    return res.status(500).json({
      status: false,
      message: 'Internal Server Error'
    });
  }
};

const addToCart = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: false,
        message: 'Unauthorized'
      });
    }

    const user = await userRepo.getByEmail(req.user.email);

    if (!user) {
      return res.status(404).json({
        status: false,
        message: 'User not found'
      });
    }

    const cartItemsValidator = plainToInstance(AddToCartDto, req.body);

    const errors = await validate(cartItemsValidator);

    if (errors.length > 0) {
      return res.status(400).json({
        status: false,
        message: 'Validation Error',
        errors
      });
    }

    const productIds: string[] = [];
    const serviceIds: string[] = [];

    cartItemsValidator.items.map((item) => {
      if (item.itemType === CartItemType.PRODUCT) productIds.push(item.itemId);
      else if (item.itemType === CartItemType.SERVICE)
        serviceIds.push(item.itemId);
    });

    const products = await productRepo.getByIds(productIds);

    if (products.length !== productIds.length) {
      return res.status(404).json({
        status: false,
        message: 'One or More Product not found'
      });
    }

    const services = await serviceRepo.getByIds(serviceIds);

    if (services.length !== serviceIds.length) {
      return res.status(404).json({
        status: false,
        message: 'One or More Service not found'
      });
    }

    cartItemsValidator.items.map((item) => {
      if (item.itemType === CartItemType.PRODUCT) {
        // find index of product in user cart
        const productIndex = user.cart.findIndex(
          (cartItem) =>
            cartItem.itemId === item.itemId &&
            cartItem.itemType === CartItemType.PRODUCT
        );

        // if product exists in cart
        if (productIndex !== -1) {
          user.cart[productIndex].quantity = item.quantity;
        } else {
          user.cart.push(item);
        }
      } else if (item.itemType === CartItemType.SERVICE) {
        const serviceIndex = user.cart.findIndex(
          (cartItem) =>
            cartItem.itemId === item.itemId &&
            cartItem.itemType === CartItemType.SERVICE
        );

        if (serviceIndex !== -1) {
          user.cart[serviceIndex].quantity = item.quantity;
        } else {
          user.cart.push(item);
        }
      }
    });

    await userRepo.updateUserCart(user);

    return res.status(200).json({
      status: true,
      message: 'Product added to cart'
    });
  } catch (error) {
    console.log('Error in addToCart: ', error);
    return res.status(500).json({
      status: false,
      message: 'Internal Server Error'
    });
  }
};

const updateCartItems = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: false,
        message: 'Unauthorized'
      });
    }

    const user = await userRepo.getByEmail(req.user.email);

    if (!user) {
      return res.status(404).json({
        status: false,
        message: 'User not found'
      });
    }

    const cartItemsValidator = plainToInstance(UpdateCartItems, req.body);

    const errors = await validate(cartItemsValidator);

    if (errors.length > 0) {
      return res.status(400).json({
        status: false,
        message: 'Validation Error',
        errors
      });
    }

    const productIds: string[] = [];
    const serviceIds: string[] = [];

    cartItemsValidator.items.map((item) => {
      if (item.itemType === CartItemType.PRODUCT) productIds.push(item.itemId);
      else if (item.itemType === CartItemType.SERVICE)
        serviceIds.push(item.itemId);
    });

    const products = await productRepo.getByIds(productIds);

    if (products.length !== productIds.length) {
      return res.status(404).json({
        status: false,
        message: 'One or More Product not found'
      });
    }

    const services = await serviceRepo.getByIds(serviceIds);

    if (services.length !== serviceIds.length) {
      return res.status(404).json({
        status: false,
        message: 'One or More Service not found'
      });
    }

    cartItemsValidator.items.map((item) => {
      if (item.itemType === CartItemType.PRODUCT) {
        // find index of product in user cart
        const productIndex = user.cart.findIndex(
          (cartItem) =>
            cartItem.itemId === item.itemId &&
            cartItem.itemType === CartItemType.PRODUCT
        );

        // if product exists in cart
        if (productIndex !== -1) {
          user.cart[productIndex].quantity = item.quantity;
        } else {
          user.cart.push(item);
        }
      } else if (item.itemType === CartItemType.SERVICE) {
        const serviceIndex = user.cart.findIndex(
          (cartItem) =>
            cartItem.itemId === item.itemId &&
            cartItem.itemType === CartItemType.SERVICE
        );

        if (serviceIndex !== -1) {
          user.cart[serviceIndex].quantity = item.quantity;
        } else {
          user.cart.push(item);
        }
      }
    });

    await userRepo.updateUserCart(user);

    return res.status(200).json({
      status: true,
      message: 'Product added to cart'
    });
  } catch (error) {
    console.log('Error in : updateCartItems', error);
    return res.status(500).json({
      status: false,
      message: 'Internal Server Error'
    });
  }
};

const removeCartItems = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: false,
        message: 'Unauthorized'
      });
    }

    const user = await userRepo.getByEmail(req.user.email);

    if (!user) {
      return res.status(404).json({
        status: false,
        message: 'User not found'
      });
    }

    const cartItemsValidator = plainToInstance(RemoveFromCartDto, req.body);

    const errors = await validate(cartItemsValidator);

    if (errors.length > 0) {
      return res.status(400).json({
        status: false,
        message: 'Validation Error',
        errors
      });
    }

    cartItemsValidator.items.map((item) => {
      const itemIndex = user.cart.findIndex(
        (cartItem) =>
          cartItem.itemId === item.itemId && cartItem.itemType === item.itemType
      );

      if (itemIndex !== -1) {
        user.cart.splice(itemIndex, 1);
      }
    });

    await userRepo.updateUserCart(user);

    return res.status(200).json({
      status: true,
      message: 'Cart Items removed successfully'
    });
  } catch (error) {
    console.log('Error in removeCartItems: ', error);
    return res.status(500).json({
      status: false,
      message: 'Internal Server Error'
    });
  }
};

export const cartController = {
  getCart,
  addToCart,
  updateCartItems,
  removeCartItems
};
