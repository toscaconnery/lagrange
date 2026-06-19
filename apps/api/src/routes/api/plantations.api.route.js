import { Router } from 'express';
import {
    listPlantations,
    addPlantation,
    getPlantationDetail,
    addPlantationActivity,
    updatePlantationActivity,
    addActivityExpense,
    updateActivityExpense,
    deleteActivityExpense
} from '../../controllers/api/plantationsController.api.js';

const router = Router();

router.get('/', listPlantations);
router.post('/', addPlantation);
router.get('/:id', getPlantationDetail);
router.post('/:id/activities', addPlantationActivity);
router.put('/activities/:activityId', updatePlantationActivity);
router.post('/activities/:activityId/expenses', addActivityExpense);
router.put('/expenses/:id', updateActivityExpense);
router.delete('/expenses/:id', deleteActivityExpense);

export default router;
