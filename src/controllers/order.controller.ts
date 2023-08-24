import { Request, Response } from 'express';
import { userRepo } from '../repos/user.repo';
import { CartItem, CartItemType } from '../models/User.model';
import { productRepo } from '../repos/product.repo';
import { serviceRepo } from '../repos/service.repo';
import { InvoiceItemDto, ProcessOrderDto } from '../dtos/order.dto';
import { Product } from '../models/Product.model';
import { Service } from '../models/Service.model';
import { OrderItem } from '../models/OrderItem.model';
import { Order, OrderStatus } from '../models/Order.model';
import { orderRepo } from '../repos/order.repo';
import { orderItemRepo } from '../repos/orderItem.repo';
import { plainToInstance } from 'class-transformer';
import { UUIDValidationDto } from '../dtos/common.dto';
import { validate } from 'class-validator';

const getOrders = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: false,
        message: 'Unauthorized',
        data: null
      });
    }

    const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
    const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;

    const orders = await orderRepo.getOrdersByUser(
      req.user.email,
      limit,
      offset
    );

    return res.status(200).json({
      status: true,
      data: orders,
      message: 'Orders found'
    });
  } catch (error) {
    console.error('Error in getOrders: ', error);
    return res.status(500).json({
      status: false,
      message: 'Internal Server Error',
      data: null
    });
  }
};

const adminGetOrders = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: false,
        message: 'Unauthorized',
        data: null
      });
    }

    const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
    const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;

    const orders = await orderRepo.getOrders(limit, offset);

    return res.status(200).json({
      status: true,
      data: orders,
      message: 'Orders found'
    });
  } catch (error) {
    console.error('Error in adminGetOrders: ', error);
    return res.status(500).json({
      status: false,
      message: 'Internal Server Error',
      data: null
    });
  }
};

const generateInvoice = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: false,
        message: 'Unauthorized',
        data: null
      });
    }

    const user = await userRepo.getByEmail(req.user.email);

    if (!user) {
      return res.status(404).json({
        status: false,
        message: 'User not found',
        data: null
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
        message: 'One or More Product not found',
        data: null
      });
    }

    const services = await serviceRepo.getByIds(serviceIds);

    if (services.length !== serviceIds.length) {
      return res.status(404).json({
        status: false,
        message: 'One or More Service not found',
        data: null
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
          tax: taxDetails.tax
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
          tax: taxDetails.tax
        });
      }
    });

    const totalTax = invoiceItems.reduce(
      (acc, item) => acc + item.tax * item.quantity,
      0
    );
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
      message: 'Internal Server Error',
      data: null
    });
  }
};

const createOrder = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: false,
        message: 'Unauthorized',
        data: null
      });
    }

    const user = await userRepo.getByEmail(req.user.email);

    if (!user) {
      return res.status(404).json({
        status: false,
        message: 'User not found',
        data: null
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
        message: 'One or More Product not found',
        data: null
      });
    }

    const services = await serviceRepo.getByIds(serviceIds);

    if (services.length !== serviceIds.length) {
      return res.status(404).json({
        status: false,
        message: 'One or More Service not found',
        data: null
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
          tax: taxDetails.tax
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
          tax: taxDetails.tax
        });
      }
    });

    const totalTax = invoiceItems.reduce(
      (acc, item) => acc + item.tax * item.quantity,
      0
    );
    const totalAmount = invoiceItems.reduce(
      (acc, item) => acc + item.quantity * item.item.price,
      0
    );

    const orderItems: OrderItem[] = [];

    const order = new Order();
    order.totalAmount = totalAmount;
    order.totalTax = totalTax;
    order.status = OrderStatus.PENDING;
    order.user = user;

    invoiceItems.map((item) => {
      const orderItem = new OrderItem();
      orderItem.order = order;
      orderItem.quantity = item.quantity;
      orderItem.tax = item.tax;
      orderItem.totalAmount = item.quantity * item.item.price;
      orderItem.totalAmountWithoutTax =
        item.quantity * item.item.price - item.tax;
      orderItem.taxCategories = JSON.stringify(item.taxCategories);
      orderItem.taxBreakdown = JSON.stringify(item.taxBreakdown);
      if (item.itemType === CartItemType.PRODUCT)
        orderItem.product = item.item as Product;
      else orderItem.service = item.item as Service;

      orderItems.push(orderItem);
    });

    order.items = orderItems;

    await orderRepo.createOrder(order);

    await orderItemRepo.createOrderItems(orderItems);

    user.cart = '[]';

    await userRepo.updateUser(user);

    return res.status(200).json({
      status: true,
      data: {
        id: order.id,
        items: invoiceItems,
        totalAmount,
        totalTax,
        totalAmountWithTax: totalAmount + totalTax,
        status: order.status
      }
    });
  } catch (error) {
    console.error('Error in processOrder: ', error);
    return res.status(500).json({
      status: false,
      message: 'Internal Server Error',
      data: null
    });
  }
};

const processOrder = async (req: Request, res: Response) => {
  try {
    const bodyValidationObject = plainToInstance(ProcessOrderDto, req.body);

    const errors = await validate(bodyValidationObject);

    if (errors.length > 0) {
      return res.status(400).json({
        status: false,
        message: 'Validation Error',
        errors,
        data: null
      });
    }

    if (!req.user) {
      return res.status(401).json({
        status: false,
        message: 'Unauthorized',
        data: null
      });
    }

    const user = await userRepo.getByEmail(req.user.email);

    if (!user) {
      return res.status(404).json({
        status: false,
        message: 'User not found',
        data: null
      });
    }

    if (!user.isAdmin) {
      return res.status(403).json({
        status: false,
        message: 'Forbidden',
        data: null
      });
    }

    const order = await orderRepo.getOrderById(bodyValidationObject.orderId);

    if (!order) {
      return res.status(404).json({
        status: false,
        message: 'Order not found',
        data: null
      });
    }

    if (order.status === OrderStatus.CANCELLED) {
      return res.status(400).json({
        status: false,
        message: 'Order is Cancelled',
        data: null
      });
    }

    if (order.status !== OrderStatus.PENDING) {
      return res.status(400).json({
        status: false,
        message: 'Order already processed',
        data: null
      });
    }

    order.status = bodyValidationObject.status;

    await orderRepo.updateOrder(order);

    return res.status(200).json({
      status: true,
      data: order,
      message: 'Order Processed Successfully'
    });
  } catch (error) {
    console.error('Error in confirmOrder: ', error);
    return res.status(500).json({
      status: false,
      message: 'Internal Server Error',
      data: null
    });
  }
};

const cancelOrder = async (req: Request, res: Response) => {
  try {
    const uuidValidationOnject = plainToInstance(
      UUIDValidationDto,
      req.params.id
    );

    const errors = await validate(uuidValidationOnject);

    if (errors.length > 0) {
      return res.status(400).json({
        status: false,
        message: 'Validation Error',
        errors,
        data: null
      });
    }

    if (!req.user) {
      return res.status(401).json({
        status: false,
        message: 'Unauthorized',
        data: null
      });
    }

    const user = await userRepo.getByEmail(req.user.email);

    if (!user) {
      return res.status(404).json({
        status: false,
        message: 'User not found',
        data: null
      });
    }

    const order = await orderRepo.getOrderById(uuidValidationOnject.id);

    if (!order) {
      return res.status(404).json({
        status: false,
        message: 'Order not found',
        data: null
      });
    }

    if (order.status === OrderStatus.CANCELLED) {
      return res.status(400).json({
        status: false,
        message: 'Order is already Cancelled',
        data: null
      });
    }

    if (order.status !== OrderStatus.PENDING) {
      return res.status(400).json({
        status: false,
        message: 'Order already processed',
        data: null
      });
    }

    if (order.user.email !== user.email) {
      return res.status(403).json({
        status: false,
        message: 'Forbidden',
        data: null
      });
    }

    order.status = OrderStatus.CANCELLED;

    await orderRepo.updateOrder(order);

    return res.status(200).json({
      status: true,
      data: order,
      message: 'Order Cancelled Successfully'
    });
  } catch (error) {
    console.error('Error in cancelOrder: ', error);
    return res.status(500).json({
      status: false,
      message: 'Internal Server Error',
      data: null
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
  getOrders,
  adminGetOrders,
  generateInvoice,
  createOrder,
  processOrder,
  cancelOrder
};
