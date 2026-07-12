const { Router } = require('express');
const { validate } = require('../../middleware/validation.middleware');
const { authenticate } = require('../../middleware/auth.middleware');
const { requireRole } = require('../../middleware/role.middleware');
const { createAllocationSchema, returnAllocationSchema, listAllocationsSchema } = require('./allocations.dto');
const { list, create, returnAlloc } = require('./allocations.controller');

const router = Router();

router.use(authenticate);

// GET /api/allocations — Authenticated (RBAC applied in service)
router.get('/', validate(listAllocationsSchema), list);

// POST /api/allocations — Asset Manager or Admin
router.post('/', requireRole('ASSET_MANAGER', 'ADMIN'), validate(createAllocationSchema), create);

// POST /api/allocations/:id/return — Asset Manager or Admin
router.post('/:id/return', requireRole('ASSET_MANAGER', 'ADMIN'), validate(returnAllocationSchema), returnAlloc);

module.exports = router;
