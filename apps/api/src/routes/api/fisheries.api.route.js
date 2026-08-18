import { Router } from "express";

import {
    getFisheryPoolList,
    addFisheryPoolList
} from '../../controllers/api/fisheryController.api.js'

import { requireAuth } from '../../middlewares/auth.js';

const router = Router();

router.get('/list', getFisheryPoolList)

router.post('/add-pool', requireAuth, addFisheryPoolList)

export default router;