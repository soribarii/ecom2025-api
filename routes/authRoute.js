import express from 'express';
import { register, login, currentUser } from '../controllers/authController.js';
import { registerSchema, loginSchema, validate } from '../utils/Validate.js';
import { authCheck, adminCheck } from '../middleware/authCheck.js';

const router = express.Router();

// @ENDPOINT http://localhost:5000/api
router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/current-user', authCheck, currentUser);
router.post('/current-admin', authCheck, adminCheck, currentUser);

export default router;