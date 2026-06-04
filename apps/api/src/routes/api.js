import { Router } from 'express';

import poolApiRoutes from './api/pools.api.route.js'
import userApiRoutes from './api/users.api.route.js'
import authApiRoutes from './api/auth.api.route.js'

const router = Router();

router.use('/pools', poolApiRoutes)
router.use('/users', userApiRoutes)
router.use('/auth', authApiRoutes)

export default router;