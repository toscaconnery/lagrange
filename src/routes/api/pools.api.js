import { Router } from "express";

import {
    getPools,
    addPool,
    addPoolUser,
    exportPoolCSV,
    exportPoolUserCSV
} from '../../controllers/api/poolController.api.js'

const router = Router();

router.get('/list', getPools)

router.post('/add-user', addPoolUser)

router.post('/add-pool', addPool)

router.get('/export-pools', exportPoolCSV)

router.get('/export-pool-users', exportPoolUserCSV)

export default router;