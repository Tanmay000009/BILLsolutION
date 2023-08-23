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
      auth: false,
      message: 'No token provided'
    });
  }

  try {
    const dbUser = await admin.auth().verifyIdToken(token);

    if (!dbUser) {
      return res.status(401).json({
        status: false,
        message: 'Invalid token'
      });
    }

    const user = await userRepo.getByEmail(dbUser.email as string);

    if (!user) {
      return res.status(401).json({
        status: false,
        message: 'User not found'
      });
    }

    req.user = user;
  } catch (error) {
    return res.status(401).json({
      status: false,
      message: 'Invalid token'
    });
  }

  return next();
};
