import { Router } from "express";

import {
    getPools,
    addPoolUser
} from '../../controllers/api/poolController.api.js'

const router = Router();

router.get('/list', getPools)

// router.get('/list-pool-user')

router.get('/add-user', addPoolUser)

export default router;