import { Router } from 'express';
import { orderController } from '../controllers/order.controller';
import { checkJWT } from '../middleware/checkJWT';

const router = Router();

router.post('/invoice', checkJWT, orderController.generateInvoice);

export default module.exports = router;
