const {
  findBookings,
  findBookingById,
  checkOverlap,
  createBooking,
  updateBooking,
} = require('./bookings.repository');
const { findAssetById } = require('../assets/assets.repository');
const { mapBookingList } = require('./bookings.mapper');
const { getPaginationData } = require('../../common/helpers/pagination.helper');
const ApiError = require('../../lib/ApiError');

const listBookings = async ({ assetId, start, end, status, page, limit }) => {
  const { skip, take } = getPaginationData(page, limit, 0);
  const [bookings, total] = await findBookings({ assetId, start, end, status, skip, take });
  const { meta } = getPaginationData(page, limit, total);
  
  return {
    data: bookings.map(mapBookingList),
    meta,
  };
};

const bookAsset = async ({
  assetId,
  startTime,
  endTime,
  purpose,
  bookedForDeptId,
  organizationId,
  bookedById,
}) => {
  const asset = await findAssetById(assetId, organizationId);
  if (!asset) throw ApiError.notFound('Asset not found');
  
  if (!asset.isBookable) {
    throw ApiError.badRequest('This asset is not available for booking');
  }

  const conflict = await checkOverlap(assetId, startTime, endTime);
  if (conflict) {
    const fStart = conflict.startTime.toISOString();
    const fEnd = conflict.endTime.toISOString();
    throw ApiError.conflict(`The asset is already booked from ${fStart} to ${fEnd}, which overlaps your requested times.`);
  }

  const booking = await createBooking({
    assetId,
    bookedById,
    bookedForDeptId,
    startTime,
    endTime,
    purpose,
  });

  return mapBookingList(booking);
};

const modifyBooking = async ({ id, status, startTime, endTime, employee }) => {
  const booking = await findBookingById(id);
  if (!booking) throw ApiError.notFound('Booking not found');

  const isOwner = booking.bookedById === employee.id;
  const isManager = employee.roles.some(r => ['ADMIN', 'ASSET_MANAGER', 'DEPARTMENT_HEAD'].includes(r));
  if (!isOwner && !isManager) {
    throw ApiError.forbidden('Not authorized to modify this booking');
  }

  // If rescheduling, check overlap excluding this booking
  if (startTime || endTime) {
    const newStart = startTime || booking.startTime;
    const newEnd = endTime || booking.endTime;
    
    if (new Date(newStart) >= new Date(newEnd)) {
      throw ApiError.badRequest('endTime must be strictly after startTime');
    }

    const conflict = await checkOverlap(booking.assetId, newStart, newEnd, id);
    if (conflict) {
      const fStart = conflict.startTime.toISOString();
      const fEnd = conflict.endTime.toISOString();
      throw ApiError.conflict(`The asset is already booked from ${fStart} to ${fEnd}, which overlaps your requested times.`);
    }
  }

  const updatedBooking = await updateBooking({
    id,
    status,
    startTime,
    endTime,
    cancelledById: employee.id,
  });

  return mapBookingList(updatedBooking);
};

module.exports = { listBookings, bookAsset, modifyBooking };
