import { productRepo } from '../repos/product.repo';
import { serviceRepo } from '../repos/service.repo';
import { userRepo } from '../repos/user.repo';
import { ds } from './datasource';
import initFirebaseAdmin from './initFirebase';
import admin from 'firebase-admin';
const products = [
  {
    name: 'Tupperware Bottle',
    price: 399,
    description: 'India themed bottle.',
    image: ''
  },
  {
    name: 'JBL Go',
    price: 1800,
    description: 'A compact speaker by Harman.',
    image: ''
  },
  {
    name: 'Apple MacBook Air',
    price: 94999,
    description: 'One of the best in the game.',
    image: ''
  }
];

const services = [
  {
    name: 'SEO Optimization',
    price: 1999,
    description: 'Get your SEO shooting.',
    image: ''
  },
  {
    name: 'Laptop Servicing',
    price: 999,
    description: 'Get your laptop cleaned.',
    image: ''
  }
];

const seedUser = {
  email: 'admin@billion.com',
  firstName: 'admin',
  lastName: 'admin',
  password: 'Billion@2023'
};

export const seeder = async () => {
  await initFirebaseAdmin();

  await ds.initialize().then(() => {
    console.log('Database connected');
  });

  const seedadmin = await seedAdmin();

  if (seedadmin) {
    await seedProducts();
    await seedServices();
  }

  console.log('Seeding completed');
};

seeder();

const seedAdmin = async () => {
  const userExists = await userRepo.getByEmail(seedUser.email);

  if (userExists) {
    console.log('Data already seeded');

    return false;
  }

  // firebase getUserByEmail throws error if user does not exists
  try {
    const fbUserExists = await admin.auth().getUserByEmail(seedUser.email);

    // delete user from firebase if exists as user does not exists in database
    if (fbUserExists) {
      await admin.auth().deleteUser(fbUserExists.uid);
    }
  } catch (error) {}

  const fbUser = await admin.auth().createUser({
    email: seedUser.email,
    password: seedUser.password,
    displayName: seedUser.firstName + ' ' + seedUser.lastName
  });

  const user = await userRepo.createUser(seedUser, fbUser.uid);

  console.log('Admin user created successfully');
  console.log(seedUser);

  return true;
};

const seedProducts = async () => {
  try {
    await productRepo.createProducts(products);
    console.log('Products seeded successfully');
  } catch (error) {
    console.log('Error in seedProducts: ', error);
  }
};

const seedServices = async () => {
  try {
    await serviceRepo.createServices(services);
    console.log('Services seeded successfully');
  } catch (error) {
    console.log('Error in seedServices: ', error);
  }
};
