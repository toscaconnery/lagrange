import { Router } from "express";

import {
    getFisheryPoolList,
    addFisheryPool,
    getFisheryPoolDetail,
    getFisheryFeedList,
    addFisheryFeed,
    getFisheryFeedDetail,
    getFisheryPoolCycleList,
    addFisheryPoolCycle,
    getFisheryPoolCycleDetail
} from '../../controllers/api/fisheryController.api.js';

import { requireAuth } from '../../middlewares/auth.js';

const router = Router();

router.get('/pool/list', requireAuth, getFisheryPoolList);

router.post('/pool/add', requireAuth, addFisheryPool);

router.get('/pool/:id', requireAuth, getFisheryPoolDetail);

router.get('/feed/list', requireAuth, getFisheryFeedList);

router.post('/feed/add', requireAuth, addFisheryFeed);

router.get('/feed/:id', requireAuth, getFisheryFeedDetail);

router.get('/cycle/list', requireAuth, getFisheryPoolCycleList);

router.post('/cycle/add', requireAuth, addFisheryPoolCycle);

router.get('/cycle/:id', requireAuth, getFisheryPoolCycleDetail)

export default router;