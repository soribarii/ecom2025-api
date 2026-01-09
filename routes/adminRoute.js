import express from 'express';
import { authCheck } from '../middleware/authCheck.js';
import { changeOrderStatus, getOrderAdmin } from '../controllers/adminController.js';

const router = express.Router();

// @ENDPOINT http://localhost:5000/api
router.put('/admin/order-status', authCheck, changeOrderStatus);
router.get('/admin/orders', authCheck, getOrderAdmin);

export default router;