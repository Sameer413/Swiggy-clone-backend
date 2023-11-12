// show review
import express from 'express';
import { isAuthenticated } from '../middleware/auth';
import { getAllRestaurentOrders, getAllUserOrders, getSingleOrder, makeOrder, postReview, showRestaurentReviews, updateOrder } from '../controllers/orderController';
const router = express.Router();

router.route('/order/create/:restaurentId').post(isAuthenticated, makeOrder);
router.route('/order/update/:orderId').put(isAuthenticated, updateOrder);
router.route('/orders/:restaurentId').get(isAuthenticated, getAllRestaurentOrders);
router.route('/order/:restaurentId').get(isAuthenticated, getSingleOrder);
router.route('/me/orders').get(isAuthenticated, getAllUserOrders);

router.route('/order/review/:orderId').post(isAuthenticated, postReview);
router.route('/restaurent/:restaurentId/reviews').get(showRestaurentReviews)


export default router;;