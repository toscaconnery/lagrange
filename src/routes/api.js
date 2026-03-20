import { Router } from 'express';
import {
    getUsers, 
    getUserById,
    createUser
} from '../controllers/api/userController.api.js';

import poolApiRoutes from './api/pools.api.js'
import userApiRoutes from './api/users.api.js'

const router = Router();

router.use('/pools', poolApiRoutes)
router.use('/users', userApiRoutes)

// router.get('/users', getUsers);
// router.get('/users/:id', getUserById);
// router.post('/users/add', createUser);

export default router;


// import mainWebRoutes from './web/main.web.js'
// import userWebRoutes from './web/users.web.js'

// const router = Router();

// router.use('/', mainWebRoutes)

// router.use('/users', userWebRoutes)
