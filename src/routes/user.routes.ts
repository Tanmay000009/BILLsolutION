// getMe, updateUser, makeAdmin;

import { Router } from 'express';
import { checkJWT } from '../middleware/checkJWT';
import { userController } from '../controllers/user.controller';

const router = Router();

router.get('/', checkJWT, userController.getMe);
router.put('/', checkJWT, userController.updateUser);
router.put('/:email/admin', checkJWT, userController.makeAdmin);

export default router;
