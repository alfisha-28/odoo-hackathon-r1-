const { Router } = require('express');
const { validate } = require('../../middleware/validation.middleware');
const { authenticate } = require('../../middleware/auth.middleware');
const { requireRole } = require('../../middleware/role.middleware');
const { listEmployeesSchema, updateEmployeeSchema } = require('./employees.dto');
const { list, update } = require('./employees.controller');

const router = Router();

router.use(authenticate);

// GET /api/employees — any authenticated employee, supports ?search=&role=&status=&page=&limit=
router.get('/', validate(listEmployeesSchema), list);

// PATCH /api/employees/:id — Admin only (role promotion / status / manual password reset)
router.patch('/:id', requireRole('ADMIN'), validate(updateEmployeeSchema), update);

module.exports = router;
