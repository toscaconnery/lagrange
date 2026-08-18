import { Router } from "express";

import {
    getFisheryPoolList,
    addFisheryPool,
    getFisheryFeedList,
    addFisheryFeed
} from '../../controllers/api/fisheryController.api.js';

import { requireAuth } from '../../middlewares/auth.js';

const router = Router();

router.get('/pool/list', requireAuth, getFisheryPoolList);

router.post('/pool/add', requireAuth, addFisheryPool);

router.get('/feed/list', requireAuth, getFisheryFeedList);

router.post('/feed/add', requireAuth, addFisheryFeed);

export default router;