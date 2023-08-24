import { SignupUserDto } from '../dtos/auth.dto';
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

const testUser = {
  email: 'testuser@billion.com',
  firstName: 'testUser',
  lastName: 'testUser',
  password: 'Billion@2023'
};

const testAdmin = {
  email: 'testadmin@billion.com',
  firstName: 'testAdmin',
  lastName: 'testAdmin',
  password: 'Billion@2023'
};

export const seeder = async () => {
  await initFirebaseAdmin();

  await ds.initialize().then(() => {
    console.log('Database connected');
  });

  const seedusers = await seedUserUtil(seedUser);

  if (seedusers) {
    await seedUserUtil(testUser);
    await seedUserUtil(testAdmin);
    await seedProducts();
    await seedServices();
    console.log('Admin user created successfully');
    console.log(seedUser);
    console.log('Test user created successfully');
    console.log(testUser);
  }

  console.log('Seeding completed');

  process.exit(0);
};

seeder();

const seedUserUtil = async (seeduser: SignupUserDto) => {
  const userExists = await userRepo.getByEmail(seeduser.email);

  if (userExists) {
    console.log('Data already seeded');

    return false;
  }

  // firebase getUserByEmail throws error if user does not exists
  try {
    const fbUserExists = await admin.auth().getUserByEmail(seeduser.email);

    // delete user from firebase if exists as user does not exists in database
    if (fbUserExists) {
      await admin.auth().deleteUser(fbUserExists.uid);
    }
  } catch (error) {}

  const fbUser = await admin.auth().createUser({
    email: seeduser.email,
    password: seeduser.password,
    displayName: seeduser.firstName + ' ' + seeduser.lastName
  });

  const user = await userRepo.createUser(seeduser, fbUser.uid);

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
