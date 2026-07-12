const { Router } = require('express');
const { validate } = require('../../middleware/validation.middleware');
const { authenticate } = require('../../middleware/auth.middleware');
const { requireRole } = require('../../middleware/role.middleware');
const { dashboardAnalyticsSchema } = require('./dashboard.dto');
const { getKPIs, getAnalytics } = require('./dashboard.controller');

const router = Router();

router.use(authenticate);

// GET /api/dashboard/kpis — Authenticated
router.get('/kpis', getKPIs);

// GET /api/dashboard/analytics — Asset Manager or Admin
router.get(
  '/analytics',
  requireRole('ASSET_MANAGER', 'ADMIN'),
  validate(dashboardAnalyticsSchema),
  getAnalytics
);

module.exports = router;
