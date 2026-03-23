import { Router } from "express";

import {
    getPools,
    addPool,
    addPoolUser,
    addPoolFishType,
    exportPoolXLSX,
    exportPoolUserXLSX
} from '../../controllers/api/poolController.api.js'

const router = Router();

router.get('/list', getPools)

router.post('/add-user', addPoolUser)

router.post('/add-pool', addPool)

router.post('/add-fish-type', addPoolFishType)

router.get('/export-pools', exportPoolXLSX)

router.get('/export-pool-users', exportPoolUserXLSX)

export default router;