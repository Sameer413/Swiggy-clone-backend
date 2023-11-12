import express from 'express';
import userRoutes from './userRoutes';
import restaurentRoutes from './restaurentRoutes';
import menuRoutes from './menuRoutes';
import cartRoutes from './cartRoutes';
import orderRoutes from './orderRoutes';


const router = express.Router();

router.use(userRoutes);
router.use(restaurentRoutes);
router.use(menuRoutes);
router.use(cartRoutes);
router.use(orderRoutes);

export default router;