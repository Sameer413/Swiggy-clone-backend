import express from 'express';
import { addMenuItem, deleteMenuItem, getAllMenuByRestaurentId, updateMenuItem } from '../controllers/menuController';

const router = express.Router();

router.route('/:restaurentId/menu').get(getAllMenuByRestaurentId);
router.route('/:restaurentId/menu/add').post(addMenuItem);
router
    .route('/:restuarentId/menu/:menuId')
    .delete(deleteMenuItem)
    .put(updateMenuItem)
export default router;