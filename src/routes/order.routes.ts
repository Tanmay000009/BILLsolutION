import { Router } from 'express';
import { orderController } from '../controllers/order.controller';
import { checkJWT } from '../middleware/checkJWT';

const router = Router();

router.post('/invoice', checkJWT, orderController.generateInvoice);
router.post('/process', checkJWT, orderController.processOrder);

export default module.exports = router;
