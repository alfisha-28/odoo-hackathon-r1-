const asyncHandler = require('../../lib/asyncHandler');
const ApiResponse = require('../../lib/ApiResponse');
const { listNotifications, updateNotifications } = require('./notifications.service');

// GET /api/notifications
const list = asyncHandler(async (req, res) => {
  const { unreadOnly, page, limit } = req.query;
  const result = await listNotifications({ employeeId: req.employee.id, unreadOnly, page, limit });
  ApiResponse.success(res, result);
});

// PATCH /api/notifications
const update = asyncHandler(async (req, res) => {
  const { markAsReadIds, markAllRead } = req.body;
  const result = await updateNotifications({ employeeId: req.employee.id, markAsReadIds, markAllRead });
  ApiResponse.success(res, result, 'Notifications updated');
});

module.exports = { list, update };
