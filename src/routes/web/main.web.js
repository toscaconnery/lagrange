import { Router } from 'express';

import { 
    homePage,
} from '../../controllers/pageController.js';

const router = Router();

router.get('/', homePage)


export default router;