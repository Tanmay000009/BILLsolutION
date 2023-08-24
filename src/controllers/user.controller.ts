import { Response, Request } from 'express';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { UpdateUserDto } from '../dtos/user.dto';
import admin from 'firebase-admin';
import { userRepo } from '../repos/user.repo';
import { EmailValidationDto } from '../dtos/common.dto';

const getMe = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: false,
        message: 'Unauthorized',
        data: null
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
      message: 'Internal Server Error',
      data: null
    });
  }
};

const updateUser = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: false,
        message: 'Unauthorized',
        data: null
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
        message: 'User not found',
        data: null
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
      message: 'Internal server error',
      data: null
    });
  }
};

const makeAdmin = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: false,
        message: 'Unauthorized',
        data: null
      });
    }

    if (req.user.isAdmin !== true) {
      return res.status(403).json({
        status: false,
        message: 'Forbidden',
        data: null
      });
    }

    const converterObject = plainToInstance(EmailValidationDto, {
      email: req.query.email
    });
    const errors = await validate(converterObject);

    if (errors.length > 0) {
      return res.status(400).json({
        status: false,
        message: errors,
        data: null
      });
    }

    converterObject.email = converterObject.email.toLowerCase();

    const user = await userRepo.getByEmail(converterObject.email);

    if (!user) {
      return res.status(404).json({
        status: false,
        message: 'User not found',
        data: null
      });
    }

    if (user.isAdmin === true) {
      return res.status(400).json({
        status: false,
        message: 'User is already a Admin',
        data: null
      });
    }

    user.isAdmin = true;
    await userRepo.updateUser(user);

    return res.status(200).json({
      status: true,
      message: 'Admin Role assigned successfully',
      data: user
    });
  } catch (error) {
    console.error('Error in makeAdmin: ', error);
    return res.status(500).json({
      status: false,
      message: 'Internal Server Error',
      data: null
    });
  }
};

const makeNormalUser = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: false,
        message: 'Unauthorized',
        data: null
      });
    }

    if (req.user.isAdmin !== true) {
      return res.status(403).json({
        status: false,
        message: 'Forbidden',
        data: null
      });
    }

    const converterObject = plainToInstance(EmailValidationDto, {
      email: req.query.email
    });

    const errors = await validate(converterObject);

    if (errors.length > 0) {
      return res.status(400).json({
        status: false,
        message: errors,
        data: null
      });
    }

    const user = await userRepo.getByEmail(converterObject.email);

    if (!user) {
      return res.status(404).json({
        status: false,
        message: 'User not found',
        data: null
      });
    }

    if (user.isAdmin === false) {
      return res.status(400).json({
        status: false,
        message: 'User is not an Admin User',
        data: null
      });
    }

    user.isAdmin = false;

    await userRepo.updateUser(user);

    return res.status(200).json({
      status: true,
      message: 'Admin Role removed successfully',
      data: user
    });
  } catch (error) {
    console.error('Error in makeNormalUser: ', error);
    return res.status(500).json({
      status: false,
      message: 'Internal Server Error',
      data: null
    });
  }
};

export const userController = {
  getMe,
  updateUser,
  makeAdmin,
  makeNormalUser
};
