import * as admin from 'firebase-admin';
import { NextFunction, Request, Response } from 'express';

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

  const dbUser = await admin.auth().verifyIdToken(token);

  if (!dbUser) {
    return res.status(401).json({
      status: false,
      message: 'Invalid token'
    });
  }

  // todo: verify user in database & set req.user

  return next();
};
