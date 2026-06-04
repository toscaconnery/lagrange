import { Router } from 'express';

import {
    listUser
} from '../../controllers/web/userController.web.js'

import { requireAuth } from '../../middlewares/auth.js';

const router = Router();

router.get('/list', requireAuth, listUser);

export default router;