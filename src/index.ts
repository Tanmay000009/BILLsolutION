import { configDotenv } from 'dotenv';
import initServer from './utils/server';
import initFirebaseAdmin from './utils/initFirebase';
import { ds } from './utils/datasource';
configDotenv();

const PORT = process.env.PORT ?? 3000;

const app = initServer();

app.listen(PORT, async () => {
  console.log(`Running on ${PORT} ⚡`);
});
