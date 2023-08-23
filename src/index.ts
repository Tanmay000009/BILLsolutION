import { configDotenv } from 'dotenv';
import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { ds } from './utils/datasource';
import initFirebaseAdmin from './utils/initFirebase';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import productRoutes from './routes/product.routes';
import serviceRoutes from './routes/service.routes';
import cartRoutes from './routes/cart.routes';
configDotenv();

const PORT = process.env.PORT ?? 3000;

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

app.listen(PORT, () => console.log(`Running on ${PORT} ⚡`));
