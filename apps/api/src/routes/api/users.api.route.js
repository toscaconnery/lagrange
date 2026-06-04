import { Router } from "express";

import {
    getUsers, 
    getUserById,
    createUser
} from '../../controllers/api/userController.api.js';

const router = Router();

router.get('/', getUsers);
router.get('/:id', getUserById);
router.post('/add', createUser);

export default router;