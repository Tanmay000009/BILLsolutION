import { Router } from 'express';
import { cartController } from '../controllers/cart.controller';
import { checkJWT } from '../middleware/checkJWT';

const router = Router();

router.get('/', checkJWT, cartController.getCart);
router.post('/', checkJWT, cartController.addToCart);
router.put('/', checkJWT, cartController.updateCartItems);
router.delete('/', checkJWT, cartController.removeCartItems);

export default module.exports = router;
