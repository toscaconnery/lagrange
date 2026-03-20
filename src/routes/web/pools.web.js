import { Router } from 'express';

import {
    listPool,
    addPool,
    listPoolUser,
    addPoolUser
} from '../../controllers/web/poolController.web.js'

const router = Router();

router.get('/list', listPool);

router.get('/add', addPool)

router.get('/list-user', listPoolUser)

router.get('/add-user', addPoolUser)

export default router;