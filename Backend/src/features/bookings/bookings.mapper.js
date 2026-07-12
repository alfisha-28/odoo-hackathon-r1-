const mapBookingList = (booking) => ({
  id: booking.id,
  asset: booking.asset ? {
    id: booking.asset.id,
    assetTag: booking.asset.assetTag,
    name: booking.asset.name,
  } : null,
  bookedBy: booking.bookedBy ? {
    id: booking.bookedBy.id,
    name: booking.bookedBy.name,
  } : null,
  bookedForDept: booking.bookedForDept ? {
    id: booking.bookedForDept.id,
    name: booking.bookedForDept.name,
  } : null,
  startTime: booking.startTime,
  endTime: booking.endTime,
  status: booking.status,
  purpose: booking.purpose ?? null,
  createdAt: booking.createdAt,
});

module.exports = { mapBookingList };
