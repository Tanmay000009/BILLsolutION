import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { checkJWT } from '../middleware/checkJWT';

const router = Router();

router.post('/signup', authController.signupUser);
router.post('/signup/admin', checkJWT, authController.createAdmin);

export default module.exports = router;
