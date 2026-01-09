import express from 'express';
import { changeRole, changeStatus, listUsers, emptyCart, getOrder, getUserCart, saveAddress, saveOrder, addUserCart } from '../controllers/userController.js';
import { adminCheck, authCheck } from '../middleware/authCheck.js';

const router = express.Router();

// @ENDPOINT http://localhost:5000/api
router.get('/users', authCheck, adminCheck, listUsers);
router.post('/change-status',authCheck, adminCheck, changeStatus);
router.post('/change-role',authCheck, adminCheck, changeRole);

router.post('/user/cart', authCheck, addUserCart);
router.get('/user/cart', authCheck, getUserCart);
router.delete('/user/cart', authCheck, emptyCart);
router.post('/user/address', authCheck, saveAddress);
router.post('/user/order', authCheck, saveOrder);
router.get('/user/order', authCheck, getOrder);

export default router;