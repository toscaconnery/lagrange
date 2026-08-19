import ExcelJS from 'exceljs';
import * as FisheryPoolModel from '../../models/fisheryPool.model.js';
import * as FisheryFeedModel from '../../models/fisheryFeed.model.js';
import { capitalize, formatDate, generateFormattedDateForFileName } from '../../utils/formatter.js';


export const getFisheryPoolList = async (req, res, next) => {
    try {
        const pools = await FisheryPoolModel.listFisheryPools()

        res.json({ success: true, data: pools })
    } catch (error) {
        next(error)
    }
}

export const getFisheryPoolDetail = async (req, res, next) => {
    try {
        const id = req.params.id;
        const pool = await FisheryPoolModel.findPoolById(id);

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

        // const poolId = await FisheryPoolModel.createFisheryPool({name, userId})

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