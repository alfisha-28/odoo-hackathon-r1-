const { Router } = require('express');
const { validate } = require('../../middleware/validation.middleware');
const { authenticate } = require('../../middleware/auth.middleware');
const { signupSchema, loginSchema } = require('./auth.dto');
const { signup, login, logout } = require('./auth.controller');

const router = Router();

// POST /api/auth/signup
router.post('/signup', validate(signupSchema), signup);

// POST /api/auth/login
router.post('/login', validate(loginSchema), login);

// POST /api/auth/logout  (stateless — auth guard ensures a valid token exists)
router.post('/logout', authenticate, logout);

module.exports = router;
