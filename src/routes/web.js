import { Router } from 'express';

import mainWebRoutes from './web/main.web.js'
import userWebRoutes from './web/users.web.js'

const router = Router();

router.use('/', mainWebRoutes)

router.use('/users', userWebRoutes)

export default router;