import { Router } from 'express';
import {
    getUsers, 
    getUserById,
    createUser
} from '../controllers/api/userController.api.js';

const router = Router();

router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.post('/users/add', createUser);

export default router;