import { Router } from 'express';
import {
    listPlantations,
    addPlantation,
    getPlantationDetail,
    addPlantationActivity
} from '../../controllers/api/plantationsController.api.js';

const router = Router();

router.get('/', listPlantations);
router.post('/', addPlantation);
router.get('/:id', getPlantationDetail);
router.post('/:id/activities', addPlantationActivity);

export default router;