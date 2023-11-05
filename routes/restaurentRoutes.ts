import express from 'express';
import { createRestaurent } from '../controllers/restaurentController';
import { isAuthenticated } from '../middleware/auth';

const router = express.Router();

router.route('/restaurent/create').post(isAuthenticated, createRestaurent);

export default router;