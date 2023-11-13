import express from 'express';
import { addCartItem, removeCartItem, showCartItems, updateCartItem } from '../controllers/cartController';
import { isAuthenticated } from '../middleware/auth';

const router = express.Router();

router.route('/cart/:restaurentId').post(isAuthenticated, addCartItem);

router.route('/cart')
    .put(isAuthenticated, updateCartItem)
    .delete(isAuthenticated, removeCartItem)
    .get(isAuthenticated, showCartItems);

export default router;