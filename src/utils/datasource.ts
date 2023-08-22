import {
  DATABASE,
  DB_HOST,
  DB_PASSWORD,
  DB_PORT,
  DB_USERNAME
} from '../config/config';

import { DataSource } from 'typeorm';
import { User } from '../models/User.model';
import { Product } from '../models/Product.model';
import { Service } from '../models/Service.model';

export const ds = new DataSource({
  type: 'postgres',
  host: DB_HOST,
  port: DB_PORT,
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DATABASE,
  entities: [User, Product, Service],
  logging: true,
  synchronize: true
});
