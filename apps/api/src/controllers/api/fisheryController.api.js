import ExcelJS from 'exceljs';
import * as FisheryPoolModel from '../../models/fisheryPool.model.js'
import { capitalize, formatDate, generateFormattedDateForFileName } from '../../utils/formatter.js';


export const getFisheryPoolList = async (req, res, next) => {
    try {
        const pools = await FisheryPoolModel.listFisheryPools()

        res.json({ success: true, data: pools })
    } catch (error) {
        next(error)
    }
}

export const addFisheryPoolList = async (req, res, next) => {
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