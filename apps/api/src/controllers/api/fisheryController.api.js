import ExcelJS from 'exceljs';
import * as FisheryPoolModel from '../../models/fisheryPool.model.js';
import * as FisheryFeedModel from '../../models/fisheryFeed.model.js';
import * as FisheryPoolCycleModel from '../../models/fisheryPoolCycle.model.js'
import { capitalize, formatDate, generateFormattedDateForFileName } from '../../utils/formatter.js';


export const getFisheryPoolList = async (req, res, next) => {
    try {
        const { withNoCycle } = req.query || false;
        
        let pools = []

        if (withNoCycle) {
            pools = await FisheryPoolModel.listFisheryPoolsWithNoCycle()
        } else {
            pools = await FisheryPoolModel.listFisheryPools()
        }

        res.json({ success: true, data: pools })
    } catch (error) {
        next(error)
    }
}

export const getFisheryPoolDetail = async (req, res, next) => {
    try {
        const id = req.params.id;
        const pool = await FisheryPoolModel.findFisheryPoolById(id);

        res.json({ success: true, data: pool, id })
    } catch (error) {
        next(error)
    }
}

export const addFisheryPool = async (req, res, next) => {
    try {
        const { 
            name,
        } = req.body

        const userId = res?.locals?.user?.id

        if (!name) {
            return res.status(400).json({ success: false, message: 'Nama kolam tidak boleh kosong.' });
        }

        if (!userId) {
            return res.status(400).json({ success: false, message: 'Anda harus login.' });
        }

        const poolId = await FisheryPoolModel.createFisheryPool({name, userId})

        console.log('--- add pool params :', name, userId)

        res.json({ success: true, data: {
            name,
            userId
        }})

    } catch (error) {
        next(error)
    }
}

export const editFisheryPool = async (req, res, next) => {
    try {
        const { 
            name,
        } = req.body

        const poolId = req.params.id;

        const userId = res?.locals?.user?.id

        if (!poolId) {
            return res.status(400).json({ success: false, message: 'Anda belum memilih kolam.' });
        }

        if (!name) {
            return res.status(400).json({ success: false, message: 'Nama kolam tidak boleh kosong.' });
        }

        if (!userId) {
            return res.status(400).json({ success: false, message: 'Anda harus login.' });
        }

        // check existing pool
        const poolData = await FisheryPoolModel.findFisheryPoolById(poolId);
        let editPoolData;

        if (poolData) {
            if (poolData.user_id !== userId) {
                return res.status(400).json({ success: false, message: 'Anda tidak bisa mengedit kolam ini.' });
            }

            editPoolData = await FisheryPoolModel.editFisheryPool({id: poolId, name})
        }

        res.json({ success: true, data: {
            name,
            userId,
            editPoolData
        }})

    } catch (error) {
        next(error)
    }
}

export const getFisheryFeedList = async (req, res, next) => {
    try {
        const feeds = await FisheryFeedModel.listFisheryFeeds();

        res.json({ success: true, data: feeds })
    } catch (error) {
        next(error)
    }
}

export const addFisheryFeed = async (req, res, next) => {
    try {
        const { 
            name,
            type,
            weight
        } = req.body

        const userId = res?.locals?.user?.id

        if (!userId) {
            return res.status(400).json({ success: false, message: 'Anda harus login.' });
        }

        if (!name) {
            return res.status(400).json({ success: false, message: 'Nama pakan tidak boleh kosong.' });
        }

        if (!type) {
            return res.status(400).json({ success: false, message: 'Tipe pakan tidak boleh kosong.' });
        }

        if (!weight) {
            return res.status(400).json({ success: false, message: 'Berat pakan tidak boleh kosong.' });
        }

        const feedId = await FisheryFeedModel.createFisheryFeed({name, type, weight});

        console.log('--- add pool params :', name, userId)

        res.json({ success: true, data: {
            name,
            type,
            weight,
            feedId
        }})

    } catch (error) {
        next(error)
    }
}

export const getFisheryFeedDetail = async (req, res, next) => {
    try {
        const id = req.params.id;
        const feed = await FisheryFeedModel.findFeedById(id);

        res.json({ success: true, data: feed, id })
    } catch (error) {
        next(error)
    }
}

export const getFisheryPoolCycleList = async (req, res, next) => {
    try {
        const poolCycles = await FisheryPoolCycleModel.listFisheryPoolCycles()

        res.json({ success: true, data: poolCycles })
    } catch (error) {
        next(error)
    }
}

export const addFisheryPoolCycle = async (req, res, next) => {
    try {
        const { 
            pool_id,
            seed_date,
            label,
            seed_count,
            seed_price
        } = req.body

        const status = 'ongoing';

        const userId = res?.locals?.user?.id;

        const endDate = null;

        if (!pool_id) {
            return res.status(400).json({ success: false, message: 'Kolam tidak boleh kosong.' });
        }

        if (!userId) {
            return res.status(400).json({ success: false, message: 'Anda harus login.' });
        }

        if (!label) {
            return res.status(400).json({ success: false, message: 'Label siklus tidak boleh kosong.' });
        }

        if (!seed_date) {
            return res.status(400).json({ success: false, message: 'Tanggal masuk bibit tidak boleh kosong.' });
        }

        if (!seed_count) {
            return res.status(400).json({ success: false, message: 'Jumlah bibit tidak boleh kosong.' });
        }

        if (!seed_price) {
            return res.status(400).json({ success: false, message: 'Biaya bibit tidak boleh kosong.' });
        }

        const poolCycleParams = {
            pool_id,
            user_id: userId,
            label,
            seed_date,
            seed_count,
            seed_price,
            status: status,
            end_date: endDate
        }

        const poolCycleId = await FisheryPoolCycleModel.createFisheryPoolCycle(poolCycleParams)

        res.json({ success: true, data: {
            poolCycleParams,
            poolCycleId
        }})

    } catch (error) {
        next(error)
    }
}

export const getFisheryPoolCycleDetail = async (req, res, next) => {
    try {
        const id = req.params.id;
        const pool = await FisheryPoolCycleModel.findFisheryPoolCycleById(id);

        res.json({ success: true, data: pool, id })
    } catch (error) {
        next(error)
    }
}