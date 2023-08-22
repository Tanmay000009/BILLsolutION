import { configDotenv } from 'dotenv';
import * as serviceAccount from '../../serviceAccount.json';

configDotenv();

export const DB_HOST = process.env.DB_HOST;
export const DB_PORT = Number(process.env.DB_PORT);
export const DB_USERNAME = process.env.DB_USERNAME;
export const DB_PASSWORD = process.env.DB_PASSWORD;
export const DATABASE = process.env.DATABASE;

export const serviceAccountKey = serviceAccount;
