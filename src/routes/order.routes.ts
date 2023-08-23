import { Router } from 'express';
import { orderController } from '../controllers/order.controller';
import { checkJWT } from '../middleware/checkJWT';

const router = Router();

// getOrders,
//   adminGetOrders,
//   generateInvoice,
//   createOrder,
//   processOrder,
//   cancelOrder;

router.get('/', checkJWT, orderController.getOrders);
router.get('/admin', checkJWT, orderController.adminGetOrders);
router.post('/invoice', checkJWT, orderController.generateInvoice);
router.post('/create', checkJWT, orderController.createOrder);
router.put('/process', checkJWT, orderController.processOrder);
router.put('/:id/cancel', checkJWT, orderController.cancelOrder);

export default module.exports = router;
