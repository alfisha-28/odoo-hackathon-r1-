import defaultData from '../data/data.json';

// In-memory cache to simulate server-side state
let notificationsCache = [...defaultData.notifications];
let settingsCache = { ...defaultData.settings };

export const notificationService = {
  getNotifications: async () => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));
    return [...notificationsCache];
  },

  markAsRead: async (id) => {
    await new Promise((resolve) => setTimeout(resolve, 150));
    notificationsCache = notificationsCache.map((n) => {
      if (n.id === id) {
        // Update viewed timeline item if not already present
        const hasViewed = n.timeline.some((t) => t.title === 'Viewed by User');
        const updatedTimeline = [...n.timeline];
        if (!hasViewed) {
          const now = new Date();
          const timeStr = `${now.getDate()} May 2025, ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} ${now.getHours() >= 12 ? 'PM' : 'AM'}`;
          updatedTimeline.push({ title: 'Viewed by User', time: timeStr });
        }
        return { ...n, status: 'Read', timeline: updatedTimeline };
      }
      return n;
    });
    return [...notificationsCache];
  },

  markAllAsRead: async () => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    notificationsCache = notificationsCache.map((n) => {
      const hasViewed = n.timeline.some((t) => t.title === 'Viewed by User');
      const updatedTimeline = [...n.timeline];
      if (!hasViewed) {
        const now = new Date();
        const timeStr = `${now.getDate()} May 2025, ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} ${now.getHours() >= 12 ? 'PM' : 'AM'}`;
        updatedTimeline.push({ title: 'Viewed by User', time: timeStr });
      }
      return { ...n, status: 'Read', timeline: updatedTimeline };
    });
    return [...notificationsCache];
  },

  archiveNotification: async (id) => {
    await new Promise((resolve) => setTimeout(resolve, 150));
    notificationsCache = notificationsCache.map((n) => {
      if (n.id === id) {
        const hasArchived = n.timeline.some((t) => t.title === 'Archived');
        const updatedTimeline = [...n.timeline];
        if (!hasArchived) {
          const now = new Date();
          const timeStr = `${now.getDate()} May 2025, ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} ${now.getHours() >= 12 ? 'PM' : 'AM'}`;
          updatedTimeline.push({ title: 'Archived', time: timeStr });
        }
        return { ...n, isArchived: true, timeline: updatedTimeline };
      }
      return n;
    });
    return [...notificationsCache];
  },

  deleteNotification: async (id) => {
    await new Promise((resolve) => setTimeout(resolve, 150));
    notificationsCache = notificationsCache.filter((n) => n.id !== id);
    return [...notificationsCache];
  },

  getSettings: async () => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return { ...settingsCache };
  },

  saveSettings: async (settings) => {
    await new Promise((resolve) => setTimeout(resolve, 250));
    settingsCache = { ...settings };
    console.log('Successfully saved notification preferences:', settingsCache);
    return { ...settingsCache };
  },

  // Helper to add a live simulated notification (called by interval in page)
  addLiveNotification: (newNotif) => {
    const nextId = notificationsCache.length > 0 ? Math.max(...notificationsCache.map((n) => n.id)) + 1 : 1;
    const finalNotif = {
      id: nextId,
      status: 'Unread',
      createdAt: new Date().toISOString(),
      timeline: [
        {
          title: 'Notification Created',
          time: new Date().toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          }) + ', ' + new Date().toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          }),
        },
      ],
      ...newNotif,
    };
    notificationsCache = [finalNotif, ...notificationsCache];
    return finalNotif;
  },
};
