import { Router } from "express";

import {
    getPools,
    getPoolList,
    addPool,
    addPoolUser,
    addPoolFishType,
    exportPoolXLSX,
    exportPoolUserXLSX,
    managePool,
    deletePool,
    startPool
} from '../../controllers/api/poolController.api.js'

import { requireAuth } from '../../middlewares/auth.js';

const router = Router();

router.get('/list', getPoolList)

router.post('/add-user', addPoolUser)

router.post('/add-pool', requireAuth, addPool)

router.post('/add-fish-type', addPoolFishType)

router.get('/export-pools', exportPoolXLSX)

router.get('/export-pool-users', exportPoolUserXLSX)

router.post('/manage-pool', managePool)

router.post('/delete-pool', deletePool)

router.post('/start-pool', startPool)

export default router;