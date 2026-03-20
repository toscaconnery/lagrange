import { Router } from "express";

import {
    getPools,
    addPoolUser
} from '../../controllers/api/poolController.api.js'

const router = Router();

router.get('/list', getPools)

// router.get('/list-pool-user')

router.post('/add-user', addPoolUser)

export default router;