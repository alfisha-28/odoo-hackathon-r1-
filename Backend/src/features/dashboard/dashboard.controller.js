const asyncHandler = require('../../lib/asyncHandler');
const ApiResponse = require('../../lib/ApiResponse');
const { fetchKPIs, fetchAnalytics } = require('./dashboard.service');

// GET /api/dashboard/kpis
const getKPIs = asyncHandler(async (req, res) => {
  const result = await fetchKPIs(req.employee.organizationId);
  ApiResponse.success(res, result);
});

// GET /api/dashboard/analytics
const getAnalytics = asyncHandler(async (req, res) => {
  const { departmentId, from, to } = req.query;
  const result = await fetchAnalytics(req.employee.organizationId, departmentId, from, to);
  ApiResponse.success(res, result);
});

module.exports = { getKPIs, getAnalytics };
