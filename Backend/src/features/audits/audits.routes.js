const { Router } = require('express');
const { validate } = require('../../middleware/validation.middleware');
const { authenticate } = require('../../middleware/auth.middleware');
const { requireRole } = require('../../middleware/role.middleware');
const { createAuditSchema, patchAuditSchema, listAuditsSchema } = require('./audits.dto');
const { list, create, update } = require('./audits.controller');

const router = Router();

router.use(authenticate);

// GET /api/audits
router.get('/', validate(listAuditsSchema), list);

// POST /api/audits
router.post('/', requireRole('ASSET_MANAGER', 'ADMIN'), validate(createAuditSchema), create);

// PATCH /api/audits/:id
router.patch('/:id', validate(patchAuditSchema), update);

module.exports = router;
