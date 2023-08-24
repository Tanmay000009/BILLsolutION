import * as admin from 'firebase-admin';
import { NextFunction, Request, Response } from 'express';
import { userRepo } from '../repos/user.repo';

export const checkJWT = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(401).json({
      status: false,
      message: 'No token provided',
      data: null
    });
  }

  try {
    const dbUser = await admin.auth().verifyIdToken(token);

    if (!dbUser) {
      return res.status(401).json({
        status: false,
        message: 'Invalid token',
        data: null
      });
    }

    const user = await userRepo.getByEmail(dbUser.email as string);

    if (!user) {
      return res.status(401).json({
        status: false,
        message: 'User not found',
        data: null
      });
    }

    req.user = user;
  } catch (error) {
    return res.status(401).json({
      status: false,
      message: 'Invalid token',
      data: null
    });
  }

  return next();
};
