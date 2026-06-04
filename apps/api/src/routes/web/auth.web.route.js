import { Router } from 'express';
import { getLogin, postLogin, postLogout, getRegister, postRegister } from '../../controllers/web/authController.web.js';

const router = Router();

router.get('/login', getLogin);
router.post('/login', postLogin);
router.post('/logout', postLogout);
router.get('/register', getRegister);
router.post('/register', postRegister)

export default router;