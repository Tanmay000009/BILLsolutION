import { configDotenv } from 'dotenv';
import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { ds } from './utils/datasource';
import initFirebaseAdmin from './utils/initFirebase';

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

app.listen(PORT, () => console.log(`Running on ${PORT} ⚡`));
