import { Router } from "express";

import {
    getPoolList,
    addPool,
    addPoolUser,
    addPoolFishType,
    getPoolFishTypeList,
    exportPoolXLSX,
    exportPoolUserXLSX,
    managePool,
    deletePool,
    startPool,
    getPoolFeedList,
    addPoolFeed,
    getPoolDetail,
} from '../../controllers/api/poolController.api.js'

import { requireAuth } from '../../middlewares/auth.js';

const router = Router();

router.get('/list', getPoolList)

router.post('/add-user', addPoolUser)

router.post('/add-pool', requireAuth, addPool)

router.get('/pool-detail/:pool_id', getPoolDetail)

router.post('/add-fish-type', addPoolFishType)

router.get('/list-fish-type', getPoolFishTypeList)

router.get('/export-pools', exportPoolXLSX)

router.get('/export-pool-users', exportPoolUserXLSX)

router.post('/manage-pool', managePool)

router.post('/delete-pool', deletePool)

router.post('/start-pool', startPool)

router.get('/list-feed', getPoolFeedList)

router.post('/add-feed', addPoolFeed)

export default router;