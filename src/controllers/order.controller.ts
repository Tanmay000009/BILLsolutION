import { Request, Response } from 'express';
import { userRepo } from '../repos/user.repo';
import { CartItem, CartItemType } from '../models/User.model';
import { productRepo } from '../repos/product.repo';
import { serviceRepo } from '../repos/service.repo';
import { InvoiceItemDto } from '../dtos/order.dto';
import { Product } from '../models/Product.model';
import { Service } from '../models/Service.model';

const generateInvoice = async (req: Request, res: Response) => {
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

    const productIds: string[] = [];
    const serviceIds: string[] = [];

    const items = JSON.parse(user.cart);

    items.map((item: CartItem) => {
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

    const invoiceItems: InvoiceItemDto[] = [];

    await items.map((item: CartItem) => {
      if (item.itemType === CartItemType.PRODUCT) {
        const product = products.find((p) => p.id === item.itemId);
        if (!product) return;
        const taxDetails = calculateProductTax(product);
        invoiceItems.push({
          ...item,
          item: product,
          taxCategories: taxDetails.taxCategories,
          taxBreakdown: taxDetails.taxBreakdown,
          tax: taxDetails.tax,
          product
        });
      } else if (item.itemType === CartItemType.SERVICE) {
        const service = services.find((s) => s.id === item.itemId);
        if (!service) return;
        const taxDetails = calculateServiceTax(service);

        invoiceItems.push({
          ...item,
          item: service,
          taxCategories: taxDetails.taxCategories,
          taxBreakdown: taxDetails.taxBreakdown,
          tax: taxDetails.tax,
          service
        });
      }
    });

    const totalTax = invoiceItems.reduce((acc, item) => acc + item.tax, 0);
    const totalAmount = invoiceItems.reduce(
      (acc, item) => acc + item.quantity * item.item.price,
      0
    );

    return res.status(200).json({
      status: true,
      data: {
        items: invoiceItems,
        totalTax,
        totalAmount,
        totalAmountWithTax: totalAmount + totalTax
      }
    });
  } catch (error) {
    console.error('Error in generateInvoice: ', error);
    return res.status(500).json({
      status: false,
      message: 'Internal Server Error'
    });
  }
};

const calculateProductTax = (
  item: Product
): {
  taxCategories: string[];
  taxBreakdown: {
    [key: string]: number;
  };
  tax: number;
} => {
  const taxCategories = ['PC'];
  const taxBreakdown = {
    PC: 200
  };
  let tax = 200;

  if (item.price > 1000 && item.price <= 5000) {
    const paTax = item.price * 0.12;
    taxCategories.push('PA');
    taxBreakdown['PA'] = paTax;
    tax += paTax;
  } else if (item.price > 5000) {
    const pbTax = item.price * 0.18;
    taxCategories.push('PB');
    taxBreakdown['PB'] = pbTax;
    tax += pbTax;
  }

  return {
    taxCategories,
    taxBreakdown,
    tax
  };
};

const calculateServiceTax = (
  item: Service
): {
  taxCategories: string[];
  taxBreakdown: {
    [key: string]: number;
  };
  tax: number;
} => {
  const taxCategories = ['SC'];
  const taxBreakdown = {
    PC: 100
  };
  let tax = 100;

  if (item.price > 1000 && item.price <= 8000) {
    const paTax = item.price * 0.1;
    taxCategories.push('PA');
    taxBreakdown['PA'] = paTax;
    tax += paTax;
  } else if (item.price > 8000) {
    const pbTax = item.price * 0.15;
    taxCategories.push('PB');
    taxBreakdown['PB'] = pbTax;
    tax += pbTax;
  }

  return {
    taxCategories,
    taxBreakdown,
    tax
  };
};

export const orderController = {
  generateInvoice
};
