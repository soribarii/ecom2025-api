import express from 'express';
import { authCheck } from '../middleware/authCheck.js';
import { payment } from '../controllers/stripeController.js';

const router = express.Router();

// @ENDPOINT https://ecom2025-api-orcin.vercel.app/api
router.post('/user/create-payment-intent', authCheck, payment);

export default router;