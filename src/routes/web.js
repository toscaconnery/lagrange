import { Router } from 'express';
import { 
    homePage,
    addUser
 } from '../controllers/pageController.js';

const router = Router();

router.get('/', homePage);

router.get('/users/add', addUser)

export default router;