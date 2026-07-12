const asyncHandler = require('../../lib/asyncHandler');
const ApiResponse = require('../../lib/ApiResponse');
const { listBookings, bookAsset, modifyBooking } = require('./bookings.service');

// GET /api/bookings
const list = asyncHandler(async (req, res) => {
  const { assetId, start, end, status, page, limit } = req.query;
  const result = await listBookings({ assetId, start, end, status, page, limit });
  ApiResponse.success(res, result);
});

// POST /api/bookings
const create = asyncHandler(async (req, res) => {
  const { assetId, startTime, endTime, purpose, bookedForDeptId } = req.body;
  const booking = await bookAsset({
    assetId,
    startTime,
    endTime,
    purpose,
    bookedForDeptId,
    organizationId: req.employee.organizationId,
    bookedById: req.employee.id,
  });
  ApiResponse.created(res, { booking }, 'Booking confirmed');
});

// PATCH /api/bookings/:id
const update = asyncHandler(async (req, res) => {
  const { status, startTime, endTime } = req.body;
  const booking = await modifyBooking({
    id: req.params.id,
    status,
    startTime,
    endTime,
    employee: req.employee,
  });
  ApiResponse.success(res, { booking }, 'Booking updated successfully');
});

module.exports = { list, create, update };
