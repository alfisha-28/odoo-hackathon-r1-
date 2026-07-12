const { Router } = require('express');
const { validate } = require('../../middleware/validation.middleware');
const { authenticate } = require('../../middleware/auth.middleware');
const { requireRole } = require('../../middleware/role.middleware');
const { createTransferSchema, listTransfersSchema, patchTransferSchema } = require('./transfers.dto');
const { list, create, update } = require('./transfers.controller');

const router = Router();

router.use(authenticate);

// GET /api/transfers — Authenticated
router.get('/', validate(listTransfersSchema), list);

// POST /api/transfers — Authenticated
router.post('/', validate(createTransferSchema), create);

// PATCH /api/transfers/:id — Asset Manager, Department Head, Admin
router.patch(
  '/:id',
  requireRole('ASSET_MANAGER', 'DEPARTMENT_HEAD', 'ADMIN'),
  validate(patchTransferSchema),
  update
);

module.exports = router;
