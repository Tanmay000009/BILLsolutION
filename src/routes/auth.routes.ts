import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { checkJWT } from '../middleware/checkJWT';

const router = Router();

router.post('/signup', authController.signupUser);
router.post('/signup/admin', checkJWT, authController.createAdmin);
router.post('/signin', authController.login);
router.put('/forgot-password/:email', authController.forgotPassword);
router.put('/update-password', checkJWT, authController.updateUserPassword);

export default module.exports = router;
