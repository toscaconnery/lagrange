import { Router } from 'express';

import poolApiRoutes from './api/pools.api.js'
import userApiRoutes from './api/users.api.js'
import authApiRoutes from './api/auth.api.js'

const router = Router();

router.use('/pools', poolApiRoutes)
router.use('/users', userApiRoutes)
router.use('/auth', authApiRoutes)

export default router;