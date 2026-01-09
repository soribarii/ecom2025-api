import express from 'express';
import { create, list, read, update, remove, listBy, searchFilters, createImages, removeImage } from '../controllers/productController.js';
import { adminCheck, authCheck } from '../middleware/authCheck.js';

const router = express.Router();

// @ENDPOINT https://ecom2025-api-orcin.vercel.app/api
router.post('/product', create);
router.get('/products/:count', list);
router.get('/product/:id', read);
router.put('/product/:id', update);
router.delete('/product/:id', remove);
router.post('/productby', listBy);
router.post('/search/filters', searchFilters);

router.post('/images', authCheck, adminCheck, createImages);
router.post('/removeimages', authCheck, adminCheck, removeImage);

export default router;