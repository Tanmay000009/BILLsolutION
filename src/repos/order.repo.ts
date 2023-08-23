import { Order } from '../models/Order.model';
import { ds } from '../utils/datasource';

const getOrders = async (limit: number = 20, offset: number = 0) => {
  return await ds.getRepository(Order).find({
    take: limit,
    skip: offset
  });
};

const getOrderById = async (id: string) => {
  return await ds.getRepository(Order).findOne({
    where: { id },
    relations: ['user', 'items']
  });
};

const getOrdersByUser = async (
  email: string,
  limit: number = 20,
  offset: number = 0
) => {
  return await ds.getRepository(Order).find({
    relations: ['user'],
    where: {
      user: { email: email }
    },
    take: limit,
    skip: offset
  });
};

const createOrder = async (order: Order) => {
  return await ds.getRepository(Order).save(order);
};

const updateOrder = async (order: Order) => {
  return await ds.getRepository(Order).save(order);
};

export const orderRepo = {
  getOrders,
  getOrderById,
  getOrdersByUser,
  createOrder,
  updateOrder
};
