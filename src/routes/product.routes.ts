import { Router } from 'express';
import { productController } from '../controllers/product.controller';
import { checkJWT } from '../middleware/checkJWT';

const router = Router();

router.get('/', productController.getAll);

router.get('/:id', productController.getById);

router.post('/', checkJWT, productController.createProduct);

router.put('/:id', checkJWT, productController.updateProduct);

router.delete('/:id', checkJWT, productController.deleteProduct);

export default module.exports = router;
