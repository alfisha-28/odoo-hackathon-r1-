const { Router } = require('express');
const { validate } = require('../../middleware/validation.middleware');
const { authenticate } = require('../../middleware/auth.middleware');
const { listNotificationsSchema, patchNotificationsSchema } = require('./notifications.dto');
const { list, update } = require('./notifications.controller');

const router = Router();

router.use(authenticate);

// GET /api/notifications
router.get('/', validate(listNotificationsSchema), list);

// PATCH /api/notifications
router.patch('/', validate(patchNotificationsSchema), update);

module.exports = router;
