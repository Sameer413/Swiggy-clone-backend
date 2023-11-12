import express from 'express';
import { addMenuItem, deleteMenuItem, getAllMenuByRestaurentId, updateMenuItem } from '../controllers/menuController';
import multerUploads from '../middleware/multer';

const router = express.Router();

router.route('/:restaurentId/menu').get(getAllMenuByRestaurentId);
router.route('/:restaurentId/menu/add').post(multerUploads, addMenuItem);
router
    .route('/:restaurentId/menu/:menuId')
    .delete(deleteMenuItem)
    .put(multerUploads, updateMenuItem)

// router.route('/menutest/:restaurentId').get(menuTesting)
export default router;