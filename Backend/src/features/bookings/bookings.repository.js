const prisma = require('../../config/prisma');

const INCLUDE_BOOKING = {
  asset: { select: { id: true, assetTag: true, name: true } },
  bookedBy: { select: { id: true, name: true } },
  bookedForDept: { select: { id: true, name: true } },
};

const findBookings = ({ assetId, start, end, status, skip, take }) => {
  const where = {
    ...(assetId && { assetId }),
    ...(status && { status }),
    ...(start && end ? {
      // Overlap with the range start -> end
      startTime: { lt: new Date(end) },
      endTime: { gt: new Date(start) },
    } : {}),
  };

  return Promise.all([
    prisma.booking.findMany({
      where,
      include: INCLUDE_BOOKING,
      orderBy: { startTime: 'asc' },
      skip,
      take,
    }),
    prisma.booking.count({ where }),
  ]);
};

const findBookingById = (id) => {
  return prisma.booking.findUnique({
    where: { id },
    include: INCLUDE_BOOKING,
  });
};

const checkOverlap = async (assetId, startTime, endTime, excludeBookingId = null) => {
  const overlapping = await prisma.booking.findFirst({
    where: {
      assetId,
      status: { in: ['UPCOMING', 'ONGOING'] },
      startTime: { lt: new Date(endTime) },
      endTime: { gt: new Date(startTime) },
      ...(excludeBookingId && { id: { not: excludeBookingId } }),
    },
    include: INCLUDE_BOOKING,
  });
  return overlapping;
};

const createBooking = async ({ assetId, bookedById, bookedForDeptId, startTime, endTime, purpose }) => {
  return prisma.$transaction(async (tx) => {
    const booking = await tx.booking.create({
      data: {
        assetId,
        bookedById,
        bookedForDeptId,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        purpose,
        status: 'UPCOMING',
      },
      include: INCLUDE_BOOKING,
    });

    await tx.notification.create({
      data: {
        employeeId: bookedById,
        type: 'BOOKING_CONFIRMED',
        title: 'Booking Confirmed',
        message: `Your booking for ${booking.asset.name} from ${booking.startTime.toISOString()} to ${booking.endTime.toISOString()} is confirmed.`,
        entityType: 'Booking',
        entityId: booking.id,
      },
    });

    return booking;
  });
};

const updateBooking = async ({ id, status, startTime, endTime, cancelledById }) => {
  return prisma.$transaction(async (tx) => {
    const data = {
      ...(status && { status }),
      ...(startTime && { startTime: new Date(startTime) }),
      ...(endTime && { endTime: new Date(endTime) }),
    };

    const booking = await tx.booking.update({
      where: { id },
      data,
      include: INCLUDE_BOOKING,
    });

    if (status === 'CANCELLED') {
      await tx.notification.create({
        data: {
          employeeId: booking.bookedById,
          type: 'BOOKING_CANCELLED',
          title: 'Booking Cancelled',
          message: `Your booking for ${booking.asset.name} has been cancelled.`,
          entityType: 'Booking',
          entityId: booking.id,
        },
      });
    }

    return booking;
  });
};

module.exports = {
  findBookings,
  findBookingById,
  checkOverlap,
  createBooking,
  updateBooking,
};
