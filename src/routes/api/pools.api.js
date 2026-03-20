import { Router } from "express";

import {
    getPools,
    addPoolUser,
    exportPoolUserCSV
} from '../../controllers/api/poolController.api.js'

const router = Router();

router.get('/list', getPools)

router.post('/add-user', addPoolUser)

router.get('/export-pool-user', exportPoolUserCSV)

export default router;