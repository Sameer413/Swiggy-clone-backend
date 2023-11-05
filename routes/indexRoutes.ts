import express from 'express';
import userRoutes from './userRoutes';
import restaurentRoutes from './restaurentRoutes';

const router = express.Router();

router.use(userRoutes);
router.use(restaurentRoutes);

export default router;