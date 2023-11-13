import express from 'express';
import { addMenuItem, deleteMenuItem, getAllMenuByRestaurentId, updateMenuItem } from '../controllers/menuController';
import multerUploads from '../middleware/multer';
import { isAdmin, isAuthenticated } from '../middleware/auth';

const router = express.Router();

router.route('/:restaurentId/menu').get(getAllMenuByRestaurentId);
router.route('/:restaurentId/menu/add').post(isAuthenticated, isAdmin, multerUploads, addMenuItem);
router
    .route('/:restaurentId/menu/:menuId')
    .delete(isAuthenticated, isAdmin, deleteMenuItem)
    .put(isAuthenticated, isAdmin, multerUploads, updateMenuItem)

export default router;