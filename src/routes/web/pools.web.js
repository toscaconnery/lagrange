import { Router } from 'express';

import {
    poolHome,
    listPool,
    addPool,
    listPoolUser,
    addPoolUser,
    managePool,
    listPoolFishType,
    addFishType
} from '../../controllers/web/poolController.web.js'

const router = Router();

router.get('/', poolHome);

router.get('/list', listPool);

router.get('/add', addPool)

router.get('/list-user', listPoolUser)

router.get('/add-user', addPoolUser)

router.get('/manage/:id', managePool)

router.get('/list-fish-type', listPoolFishType)

router.get('/add-fish-type', addFishType)

export default router;