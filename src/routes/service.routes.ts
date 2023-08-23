import { Router } from 'express';
import { serviceController } from '../controllers/service.controller';
import { checkJWT } from '../middleware/checkJWT';

const router = Router();

router.get('/', serviceController.getAll);

router.get('/:id', serviceController.getById);

router.post('/', checkJWT, serviceController.createService);

router.put('/:id', checkJWT, serviceController.updateService);

router.delete('/:id', checkJWT, serviceController.deleteService);

export default module.exports = router;
