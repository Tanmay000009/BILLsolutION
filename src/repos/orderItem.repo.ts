import { OrderItem } from '../models/OrderItem.model';
import { ds } from '../utils/datasource';

const createOrderItems = async (orderItems: OrderItem[]) => {
  return await ds.getRepository(OrderItem).save(orderItems);
};

export const orderItemRepo = {
  createOrderItems
};
