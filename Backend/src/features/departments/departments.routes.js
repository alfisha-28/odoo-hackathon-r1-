const { Router } = require('express');
const { validate } = require('../../middleware/validation.middleware');
const { authenticate } = require('../../middleware/auth.middleware');
const { requireRole } = require('../../middleware/role.middleware');
const { upsertDepartmentSchema } = require('./departments.dto');
const { list, upsert } = require('./departments.controller');

const router = Router();

// All department routes require authentication
router.use(authenticate);

// GET /api/departments — any authenticated employee
router.get('/', list);

// POST /api/departments — Admin only (upsert)
router.post('/', requireRole('ADMIN'), validate(upsertDepartmentSchema), upsert);

module.exports = router;
