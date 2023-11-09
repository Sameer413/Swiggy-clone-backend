import express from 'express';
import { createRestaurent, getAllRestaurent } from '../controllers/restaurentController';
import { isAuthenticated } from '../middleware/auth';

const router = express.Router();

router.route('/restaurent/create').post(isAuthenticated, createRestaurent);
router.route('/restaurents').get(getAllRestaurent);

export default router;