import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Request, Response } from 'express';
import { userRepo } from '../repos/user.repo';
import admin from 'firebase-admin';
import {
  getAuth,
  sendPasswordResetEmail,
  signInWithEmailAndPassword
} from 'firebase/auth';
import { SigninUserDto, SignupUserDto } from '../dtos/auth.dto';
import { EmailValidationDto } from '../dtos/common.dto';

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

    // firebase getUserByEmail throws error if user does not exists
    try {
      const fbUserExists = await admin
        .auth()
        .getUserByEmail(converterObject.email);

      // delete user from firebase if exists as user does not exists in database
      if (fbUserExists) {
        await admin.auth().deleteUser(fbUserExists.uid);
      }
    } catch (error) {}

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

const login = async (req: Request, res: Response) => {
  try {
    const converterObject = plainToInstance(SigninUserDto, req.body);

    const errors = await validate(converterObject);

    if (errors.length > 0) {
      return res.status(400).json({
        status: false,
        message: errors
      });
    }

    const auth = getAuth();

    await signInWithEmailAndPassword(
      auth,
      converterObject.email,
      converterObject.password
    )
      .then(async (userCredential) => {
        const user = await userCredential.user.getIdToken();
        res.status(200).json({
          status: true,
          message: 'User logged in successfully',
          data: {
            token: user
          }
        });
      })
      .catch((error) => {
        console.log('Error in signInWithEmailAndPassword: ', error);
        res.status(500).json({
          status: false,
          message: 'Internal Server Error'
        });
      });
    return res;
  } catch (error) {
    console.error('Error in login: ', error);
    return res.status(500).json({
      status: false,
      message: 'Internal Server Error'
    });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
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
      return res.status(200).json({
        status: true,
        message: 'An link has been sent to your email.'
      });
    }

    const auth = getAuth();

    await sendPasswordResetEmail(auth, user.email)
      .then(() => {
        res.status(200).json({
          status: true,
          message: 'An link has been sent to your email.'
        });
      })
      .catch((error) => {
        console.log('Error in sendPasswordResetEmail: ', error);
        res.status(500).json({
          status: false,
          message: 'Internal Server Error'
        });
      });
    return res;
  } catch (error) {
    console.error('Error in forgotPassword: ', error);
    return res.status(500).json({
      status: false,
      message: 'Internal Server Error'
    });
  }
};

export const authController = {
  signupUser,
  createAdmin,
  login,
  forgotPassword
};
