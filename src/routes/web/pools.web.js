import { Router } from 'express';

import {
    poolHome,
    listPool,
    addPool,
    listPoolUser,
    addPoolUser,
    managePool
} from '../../controllers/web/poolController.web.js'

const router = Router();

router.get('/', poolHome);

router.get('/list', listPool);

router.get('/add', addPool)

router.get('/list-user', listPoolUser)

router.get('/add-user', addPoolUser)

router.get('/manage/:id', managePool)

export default router;