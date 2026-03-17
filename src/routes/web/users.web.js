import { Router } from 'express';

import { 
    homePage,
    listUser, 
    addUser 
} from '../../controllers/pageController.js';

const router = Router();

router.get('/list', listUser);

router.get('/add', addUser)

export default router;