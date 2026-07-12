const { Router } = require('express');
const { validate } = require('../../middleware/validation.middleware');
const { authenticate } = require('../../middleware/auth.middleware');
const { requireRole } = require('../../middleware/role.middleware');
const { listAssetsQuerySchema, createAssetSchema, updateAssetSchema } = require('./assets.dto');
const { list, detail, create, update } = require('./assets.controller');

const router = Router();

// All asset routes require authentication
router.use(authenticate);

// GET /api/assets — any authenticated employee
router.get('/', validate(listAssetsQuerySchema), list);

// GET /api/assets/:id — any authenticated employee
router.get('/:id', detail);

// POST /api/assets — Asset Manager or Admin only
router.post('/', requireRole('ASSET_MANAGER', 'ADMIN'), validate(createAssetSchema), create);

// PATCH /api/assets/:id — Asset Manager or Admin only
router.patch('/:id', requireRole('ASSET_MANAGER', 'ADMIN'), validate(updateAssetSchema), update);

module.exports = router;
