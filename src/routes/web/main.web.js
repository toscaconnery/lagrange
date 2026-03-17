import { Router } from 'express';

import { 
    homePage,
} from '../../controllers/web/mainController.web.js';

const router = Router();

router.get('/', homePage)


export default router;