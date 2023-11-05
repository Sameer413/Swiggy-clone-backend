import express from 'express';
import userRoutes from './userRoutes';
import restaurentRoutes from './restaurentRoutes';
import menuRoutes from './menuRoutes';

const router = express.Router();

router.use(userRoutes);
router.use(restaurentRoutes);
router.use(menuRoutes);
export default router;