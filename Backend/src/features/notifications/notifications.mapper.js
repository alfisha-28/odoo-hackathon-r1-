const mapNotificationList = (notif) => ({
  id: notif.id,
  type: notif.type,
  title: notif.title,
  message: notif.message,
  entityType: notif.entityType ?? null,
  entityId: notif.entityId ?? null,
  isRead: notif.isRead,
  readAt: notif.readAt ?? null,
  createdAt: notif.createdAt,
});

module.exports = { mapNotificationList };
