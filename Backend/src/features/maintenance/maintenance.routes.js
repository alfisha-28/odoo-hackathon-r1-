const { Router } = require('express');
const { validate } = require('../../middleware/validation.middleware');
const { authenticate } = require('../../middleware/auth.middleware');
const { createMaintenanceSchema, updateMaintenanceSchema, listMaintenanceSchema } = require('./maintenance.dto');
const { list, create, update } = require('./maintenance.controller');

const router = Router();

router.use(authenticate);

// GET /api/maintenance
router.get('/', validate(listMaintenanceSchema), list);

// POST /api/maintenance
router.post('/', validate(createMaintenanceSchema), create);

// PATCH /api/maintenance/:id
router.patch('/:id', validate(updateMaintenanceSchema), update);

module.exports = router;
