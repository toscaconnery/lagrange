import { Router } from 'express';

import {
    listLog
} from '../../controllers/web/spikeController.web.js'

import { requireAuth } from '../../middlewares/auth.js';

const router = Router();

router.get('/logs', requireAuth, listLog);

export default router;