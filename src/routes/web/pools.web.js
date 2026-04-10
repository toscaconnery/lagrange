import { Router } from 'express';

import {
    poolHome,
    listPool,
    addPool,
    listPoolUser,
    addPoolUser,
    managePool,
    listPoolFishType,
    addFishType,
    poolDetails,
    deletePool
} from '../../controllers/web/poolController.web.js'

import { requireAuth } from '../../middlewares/auth.js';

const router = Router();

router.get('/', requireAuth, poolHome);

router.get('/list', requireAuth, listPool);

router.get('/add', requireAuth, addPool)

router.get('/list-user', requireAuth, listPoolUser)

router.get('/add-user', requireAuth, addPoolUser)

router.get('/details/:id', requireAuth, poolDetails)

router.get('/manage/:id', requireAuth, managePool)

router.get('/delete/:id', requireAuth, deletePool)

router.get('/list-fish-type', requireAuth, listPoolFishType)

router.get('/add-fish-type', requireAuth, addFishType)

export default router;