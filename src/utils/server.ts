import 'reflect-metadata';

import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import authRoutes from '../routes/auth.routes';
import userRoutes from '../routes/user.routes';
import productRoutes from '../routes/product.routes';
import serviceRoutes from '../routes/service.routes';
import cartRoutes from '../routes/cart.routes';
import orderRoutes from '../routes/order.routes';
import initFirebaseAdmin from './initFirebase';
import { ds } from './datasource';

const initServer = () => {
  const app: Express = express();
  app.use(cors());
  app.use(express.json());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  initFirebaseAdmin();
  ds.initialize().then(() => {
    console.log('Database connected');
  });

  app.get('/', (req: Request, res: Response) => {
    res.send('<h1>👋🏻 Hello!</h1>');
  });

  app.use('/auth', authRoutes);
  app.use('/user', userRoutes);
  app.use('/product', productRoutes);
  app.use('/service', serviceRoutes);
  app.use('/cart', cartRoutes);
  app.use('/order', orderRoutes);

  return app;
};

export default initServer;
