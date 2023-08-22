import { Response, Request } from 'express';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateUserDto, UpdateUserDto } from '../dtos/user.dto';
import admin from 'firebase-admin';
import { userRepo } from '../repos/user.repo';
import { EmailValidationDto } from '../dtos/common.dto';

const getMe = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: false,
        message: 'Unauthorized'
      });
    }

    return res.status(200).json({
      status: true,
      message: 'User found',
      data: req.user
    });
  } catch (error) {
    console.error('Error in getMe: ', error);
    return res.status(500).json({
      status: false,
      message: 'Internal Server Error'
    });
  }
};

const signupUser = async (req: Request, res: Response) => {
  try {
    const converterObject = plainToInstance(CreateUserDto, req.body);

    const errors = await validate(converterObject);

    if (errors.length > 0) {
      return res.status(400).json({
        status: false,
        message: errors
      });
    }

    const userExists = await userRepo.getByEmail(converterObject.email);

    if (userExists) {
      return res.status(400).json({
        status: false,
        message: 'User already exists'
      });
    }

    const fbUser = await admin.auth().createUser({
      email: converterObject.email,
      password: converterObject.password,
      displayName: converterObject.firstName + ' ' + converterObject.lastName
    });

    const user = await userRepo.createUser(converterObject, fbUser.uid);

    return res.status(201).json({
      status: true,
      message: 'User created successfully',
      data: user
    });
  } catch (error) {
    console.error('Error in createUser: ', error);
    return res.status(500).json({
      status: false,
      message: 'Internal server error'
    });
  }
};

const updateUser = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: false,
        message: 'Unauthorized'
      });
    }

    const converterObject = plainToInstance(UpdateUserDto, req.body);

    const errors = await validate(converterObject);

    if (errors.length > 0) {
      return res.status(400).json({
        status: false,
        message: errors
      });
    }

    const user = await userRepo.getByEmail(req.user.email);

    if (!user) {
      return res.status(404).json({
        status: false,
        message: 'User not found'
      });
    }

    const fName = converterObject.firstName
      ? converterObject.firstName
      : user.firstName;
    const lName = converterObject.lastName
      ? converterObject.lastName
      : user.lastName;
    const newName = fName + ' ' + lName;

    await admin.auth().updateUser(user.firebaseId, {
      displayName: newName
    });

    user.firstName = fName;
    user.lastName = lName;

    await userRepo.updateUser(user);

    return res.status(200).json({
      status: true,
      message: 'User updated successfully',
      data: user
    });
  } catch (error) {
    console.error('Error in updateUser: ', error);
    return res.status(500).json({
      status: false,
      message: 'Internal server error'
    });
  }
};

const createAdmin = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: false,
        message: 'Unauthorized'
      });
    }

    if (req.user.isAdmin !== true) {
      return res.status(403).json({
        status: false,
        message: 'Forbidden'
      });
    }

    const converterObject = plainToInstance(CreateUserDto, req.body);

    const errors = await validate(converterObject);

    if (errors.length > 0) {
      return res.status(400).json({
        status: false,
        message: errors
      });
    }

    const userExists = await userRepo.getByEmail(converterObject.email);

    if (userExists) {
      return res.status(400).json({
        status: false,
        message: 'User already exists'
      });
    }

    const fbUser = await admin.auth().createUser({
      email: converterObject.email,
      password: converterObject.password,
      displayName: converterObject.firstName + ' ' + converterObject.lastName
    });

    const user = await userRepo.createAdmin(converterObject, fbUser.uid);

    return res.status(201).json({
      status: true,
      message: 'Admin created successfully',
      data: user
    });
  } catch (error) {
    console.error('Error in createAdmin: ', error);
    return res.status(500).json({
      status: false,
      message: 'Internal Server Error'
    });
  }
};

const makeAdmin = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: false,
        message: 'Unauthorized'
      });
    }

    if (req.user.isAdmin !== true) {
      return res.status(403).json({
        status: false,
        message: 'Forbidden'
      });
    }

    const converterObject = plainToInstance(EmailValidationDto, {
      email: req.params.email
    });
    const errors = await validate(converterObject);

    if (errors.length > 0) {
      return res.status(400).json({
        status: false,
        message: errors
      });
    }

    const user = await userRepo.getByEmail(converterObject.email);

    if (!user) {
      return res.status(404).json({
        status: false,
        message: 'User not found'
      });
    }

    if (user.isAdmin === true) {
      return res.status(400).json({
        status: false,
        message: 'User is already a Admin'
      });
    }

    user.isAdmin = true;
    await userRepo.updateUser(user);

    return res.status(200).json({
      status: true,
      message: 'Admin Role assigned successfully'
    });
  } catch (error) {
    console.error('Error in makeAdmin: ', error);
    return res.status(500).json({
      status: false,
      message: 'Internal Server Error'
    });
  }
};

export const userController = {
  getMe,
  signupUser,
  updateUser,
  createAdmin,
  makeAdmin
};