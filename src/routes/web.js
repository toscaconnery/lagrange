import { Router } from 'express';

import mainWebRoutes from './web/main.web.route.js'
import userWebRoutes from './web/users.web.route.js'
import poolWebRoutes from './web/pools.web.route.js'
import authWebRoutes from './web/auth.web.route.js'

const router = Router();

router.use('/', mainWebRoutes)

router.use('/users', userWebRoutes)

router.use('/pools', poolWebRoutes)

router.use('/auth', authWebRoutes)

export default router;