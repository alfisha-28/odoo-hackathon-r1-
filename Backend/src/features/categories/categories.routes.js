const { Router } = require('express');
const { validate } = require('../../middleware/validation.middleware');
const { authenticate } = require('../../middleware/auth.middleware');
const { requireRole } = require('../../middleware/role.middleware');
const { upsertCategorySchema } = require('./categories.dto');
const { list, upsert } = require('./categories.controller');

const router = Router();

router.use(authenticate);

// GET /api/categories — any authenticated employee
router.get('/', list);

// POST /api/categories — Admin only (upsert)
router.post('/', requireRole('ADMIN'), validate(upsertCategorySchema), upsert);

module.exports = router;
