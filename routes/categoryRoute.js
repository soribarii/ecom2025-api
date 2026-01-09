import express from 'express';
import { categorySchema, validate } from '../utils/Validate.js';
import { create, list, remove, update } from '../controllers/categoryController.js';
import { authCheck, adminCheck } from '../middleware/authCheck.js'

const router = express.Router();

// @ENDPOINT https://ecom2025-api-orcin.vercel.app/api
router.post('/category', validate(categorySchema), authCheck, adminCheck, create)
router.get('/category', list)
router.put('/category', update);
router.delete('/category/:id', authCheck, adminCheck, remove)

export default router;