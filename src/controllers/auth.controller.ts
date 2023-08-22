import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Request, Response } from 'express';
import { userRepo } from '../repos/user.repo';
import admin from 'firebase-admin';
import { SignupUserDto } from '../dtos/auth.dto';

const signupUser = async (req: Request, res: Response) => {
  try {
    const converterObject = plainToInstance(SignupUserDto, req.body);

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

    const converterObject = plainToInstance(SignupUserDto, req.body);

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

export const authController = {
  signupUser,
  createAdmin
};
