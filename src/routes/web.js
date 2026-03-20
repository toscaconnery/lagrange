import { Router } from 'express';

import mainWebRoutes from './web/main.web.js'
import userWebRoutes from './web/users.web.js'
import poolWebRoutes from './web/pools.web.js'

const router = Router();

router.use('/', mainWebRoutes)

router.use('/users', userWebRoutes)

router.use('/pools', poolWebRoutes)

export default router;