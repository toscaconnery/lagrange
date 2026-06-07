import * as LinkyUrlModel from '../../models/linkyUrl.model.js'
import { capitalize, formatDate } from '../../utils/formatter.js';

export const shortenLink = async (req, res, next) => {
    try {
        let { 
            originalLink,
            shortCode,
            title
        } = req.body
        console.log('--- shorten links params :', originalLink, shortCode)

        if (!originalLink.trim()) {
            return res.status(400).json({ success: false, message: 'Original link required.' });
        }

        if (!shortCode?.trim()) {
            // return res.status(400).json({ success: false, message: 'Owner required.' });
            shortCode  = Math.random()
                .toString(36)
                .substring(2, 8);
        }

        const result = await LinkyUrlModel.storeShortenedLink({originalLink, shortCode, title})
        console.log('>>> result ', result)

        res.json({ success: true, data: {}})
    } catch (error) {
        next(error);
    }
}

export const getShortenedLink = async (req, res, next) => {
    try {
        const shortCode = req.params.short_code;

        const link = await LinkyUrlModel.findByShortCode(shortCode)

        const data = {
            ...link
        }

        res.json({ success: true, data: data })

    } catch (error) {
        next(error)
    }
}

export const getShortenedLinkList = async (req, res, next) => {
    try {
        const links = await LinkyUrlModel.findAll()
        
        res.json({ success: true, data: links })
    } catch (error) {
        next(error)
    }
}