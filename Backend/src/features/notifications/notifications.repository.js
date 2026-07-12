const prisma = require('../../config/prisma');

const findNotifications = ({ employeeId, unreadOnly, skip, take }) => {
  const where = {
    employeeId,
    ...(unreadOnly && { isRead: false }),
  };

  return Promise.all([
    prisma.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    }),
    prisma.notification.count({ where }),
  ]);
};

const markNotificationsRead = ({ employeeId, markAsReadIds, markAllRead }) => {
  const where = {
    employeeId,
    isRead: false, // only update unread ones
    ...(markAsReadIds && !markAllRead && { id: { in: markAsReadIds } }),
  };

  return prisma.notification.updateMany({
    where,
    data: {
      isRead: true,
      readAt: new Date(),
    },
  });
};

module.exports = {
  findNotifications,
  markNotificationsRead,
};
