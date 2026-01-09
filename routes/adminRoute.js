import express from 'express';
import { authCheck } from '../middleware/authCheck.js';
import { changeOrderStatus, getOrderAdmin } from '../controllers/adminController.js';

const router = express.Router();

// @ENDPOINT https://ecom2025-api-orcin.vercel.app/api
router.put('/admin/order-status', authCheck, changeOrderStatus);
router.get('/admin/orders', authCheck, getOrderAdmin);

export default router;