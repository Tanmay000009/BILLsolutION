import { SignupUserDto } from '../dtos/auth.dto';
import { User } from '../models/User.model';
import { ds } from '../utils/datasource';

const getByEmail = async (email: string) => {
  return await ds.getRepository(User).findOne({
    where: { email }
  });
};

const createUser = async (user: SignupUserDto, firebaseId: string) => {
  return await ds.getRepository(User).save({
    ...user,
    firebaseId
  });
};

const createAdmin = async (user: SignupUserDto, firebaseId: string) => {
  return await ds.getRepository(User).save({
    ...user,
    firebaseId,
    isAdmin: true
  });
};

const updateUser = async (user: User) => {
  return await ds.getRepository(User).save(user);
};

const updateUserCart = async (user: User) => {
  return await ds.getRepository(User).update(
    { email: user.email },
    {
      cart: user.cart
    }
  );
};

export const userRepo = {
  getByEmail,
  createUser,
  createAdmin,
  updateUser,
  updateUserCart
};
