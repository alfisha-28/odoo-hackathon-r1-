const { findNotifications, markNotificationsRead } = require('./notifications.repository');
const { mapNotificationList } = require('./notifications.mapper');
const { getPaginationData } = require('../../common/helpers/pagination.helper');

const listNotifications = async ({ employeeId, unreadOnly, page, limit }) => {
  const { skip, take } = getPaginationData(page, limit, 0);
  const [notifications, total] = await findNotifications({ employeeId, unreadOnly, skip, take });
  const { meta } = getPaginationData(page, limit, total);
  
  return {
    data: notifications.map(mapNotificationList),
    meta,
  };
};

const updateNotifications = async ({ employeeId, markAsReadIds, markAllRead }) => {
  const result = await markNotificationsRead({ employeeId, markAsReadIds, markAllRead });
  return { count: result.count };
};

module.exports = { listNotifications, updateNotifications };
