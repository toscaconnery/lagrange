import { Router } from "express";

import {
    shortenLink,
    getShortenedLink,
    getShortenedLinkList
} from '../../controllers/api/linkyController.api.js'

import { requireAuth } from '../../middlewares/auth.js';

const router = Router();

router.post('/shorten-link', shortenLink);

router.get('/get-shortened-link-list', getShortenedLinkList);

router.get('/get-shortened-link/:short_code', getShortenedLink);

export default router;