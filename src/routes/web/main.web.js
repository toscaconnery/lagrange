import { Router } from 'express';

import { 
    homePage,
} from '../../controllers/web/mainController.web.js';

import { requireAuth } from '../../middlewares/auth.js';

const router = Router();

router.get('/', requireAuth, homePage)


export default router;