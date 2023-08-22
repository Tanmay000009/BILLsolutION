import * as express from 'express';
import { User } from '../../models/User.model';

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
