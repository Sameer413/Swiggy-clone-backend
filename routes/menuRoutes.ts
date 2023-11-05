import express from 'express';
import { addMenuItem } from '../controllers/menuController';

const router = express.Router();

router.route('/:restaurentId/menu/add').post(addMenuItem);

export default router;