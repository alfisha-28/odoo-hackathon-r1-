import React, { useState, useEffect, useMemo } from 'react';
import { notificationService } from '../services/notificationService';

// Import UI layout components
import NotificationStats from '../components/NotificationStats';
import NotificationTabs from '../components/NotificationTabs';
import NotificationSidebar from '../components/NotificationSidebar';
import NotificationList from '../components/NotificationList';
import InfoBanner from '../components/InfoBanner';

// Import Modals
import NotificationDetailsModal from '../components/NotificationDetailsModal';
import NotificationSettingsModal from '../components/NotificationSettingsModal';

// List of live simulator notifications
const simulatorAlerts = [
  {
    title: 'Asset Returned',
    description: 'Laptop MacBook Pro 16 (AF-0045) has been returned by Alex Mercer.',
    type: 'Asset',
    module: 'Assets',
    relatedEntity: { type: 'Asset', id: 'AF-0045', name: 'MacBook Pro 16' },
  },
  {
    title: 'New Booking Request',
    description: 'Conference Room B has been requested by HR Team for 24 May 2025.',
    type: 'Booking',
    module: 'Booking',
    relatedEntity: { type: 'Booking', id: 'BK-2025-0199', name: 'Conference Room B' },
  },
  {
    title: 'Maintenance Assigned',
    description: 'Wrench team assigned to ticket MT-2025-0091 for office AC unit.',
    type: 'Maintenance',
    module: 'Maintenance',
    relatedEntity: { type: 'Ticket', id: 'MT-2025-0091', name: 'AC Maintenance' },
  },
  {
    title: 'Compliance Checklist Added',
    description: 'A new safety checklist has been added for Office Furniture audits.',
    type: 'Audit',
    module: 'Audit',
    relatedEntity: { type: 'Checklist', id: 'CK-SAF-09', name: 'Safety Checklist' },
  },
  {
    title: 'Transfer Request Created',
    description: 'Department transfer request for Projector PR-0012 initiated.',
    type: 'Allocation',
    module: 'Allocation',
    relatedEntity: { type: 'Transfer', id: 'TR-2025-0033', name: 'Projector PR-0012' },
  },
];

export default function NotificationsPage() {
  // Notification items & preferences states
  const [notifications, setNotifications] = useState([]);
  const [settings, setSettings] = useState(null);

  // Filters states
  const [activeTab, setActiveTab] = useState('all');
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Modals open states
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Fetch initial notifications list and settings
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);
        const [notifsData, settingsData] = await Promise.all([
          notificationService.getNotifications(),
          notificationService.getSettings(),
        ]);
        setNotifications(notifsData);
        setSettings(settingsData);
      } catch (err) {
        console.error('Failed to load initial notifications center data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  // Live simulation: add a new notification every 30 seconds
  useEffect(() => {
    let alertIdx = 0;
    const interval = setInterval(() => {
      // Rotate through mock simulator alerts
      const alertData = simulatorAlerts[alertIdx % simulatorAlerts.length];
      const newNotif = notificationService.addLiveNotification(alertData);
      
      // Update state
      setNotifications((prev) => [newNotif, ...prev]);
      alertIdx++;

      // Trigger a subtle console notification log
      console.log('Simulating live notification:', newNotif);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Filter list of active notifications (non-archived)
  const activeNotifications = useMemo(() => {
    return notifications.filter((n) => !n.isArchived);
  }, [notifications]);

  // Dynamic statistics calculations
  const stats = useMemo(() => {
    const total = activeNotifications.length;
    const unread = activeNotifications.filter((n) => n.status === 'Unread').length;

    // Filter by Today (past 24 hours)
    const todayCount = activeNotifications.filter((n) => {
      const diffMs = new Date() - new Date(n.createdAt);
      return diffMs <= 24 * 60 * 60 * 1000;
    }).length;

    // Filter by This Week (past 7 days)
    const thisWeekCount = activeNotifications.filter((n) => {
      const diffMs = new Date() - new Date(n.createdAt);
      return diffMs <= 7 * 24 * 60 * 60 * 1000;
    }).length;

    return [
      { id: 'all-notifications', title: 'All Notifications', value: String(total), subtitle: 'Total', icon: 'Bell', color: 'purple' },
      { id: 'unread', title: 'Unread', value: String(unread), subtitle: 'New notifications', icon: 'Mail', color: 'blue' },
      { id: 'this-week', title: 'This Week', value: String(thisWeekCount), subtitle: 'All received', icon: 'CheckCircle2', color: 'green' },
      { id: 'today', title: 'Today', value: String(todayCount), subtitle: 'Recent activity', icon: 'Clock3', color: 'orange' },
    ];
  }, [activeNotifications]);

  // Dynamic category lists & badge counts
  const categories = useMemo(() => {
    return [
      { id: 'all', label: 'All Notifications', count: activeNotifications.length },
      { id: 'Asset', label: 'Asset Related', count: activeNotifications.filter((n) => n.type === 'Asset').length },
      { id: 'Booking', label: 'Booking Related', count: activeNotifications.filter((n) => n.type === 'Booking').length },
      { id: 'Maintenance', label: 'Maintenance', count: activeNotifications.filter((n) => n.type === 'Maintenance').length },
      { id: 'Audit', label: 'Audit & Compliance', count: activeNotifications.filter((n) => n.type === 'Audit').length },
    ];
  }, [activeNotifications]);

  // Filter list by tab & category
  const filteredNotifications = useMemo(() => {
    let list = [...activeNotifications];

    // Filter by Sidebar category selection
    if (activeCategory !== 'all') {
      list = list.filter((n) => n.type === activeCategory);
    }

    // Filter by Timeline tab selection
    if (activeTab === 'unread') {
      list = list.filter((n) => n.status === 'Unread');
    } else if (activeTab === 'today') {
      list = list.filter((n) => {
        const diffMs = new Date() - new Date(n.createdAt);
        return diffMs <= 24 * 60 * 60 * 1000;
      });
    } else if (activeTab === 'thisWeek') {
      list = list.filter((n) => {
        const diffMs = new Date() - new Date(n.createdAt);
        return diffMs <= 7 * 24 * 60 * 60 * 1000;
      });
    } else if (activeTab === 'thisMonth') {
      list = list.filter((n) => {
        const diffMs = new Date() - new Date(n.createdAt);
        return diffMs <= 30 * 24 * 60 * 60 * 1000;
      });
    }

    return list;
  }, [activeNotifications, activeCategory, activeTab]);

  // Event handlers
  const handleMarkAllRead = async () => {
    try {
      const updated = await notificationService.markAllAsRead();
      setNotifications(updated);
      console.log('Marked all notifications as read');
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkSingleRead = async (id) => {
    try {
      const updated = await notificationService.markAsRead(id);
      setNotifications(updated);
      console.log(`Marked notification ID ${id} as read`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleArchive = async (id) => {
    try {
      const updated = await notificationService.archiveNotification(id);
      setNotifications(updated);
      console.log(`Archived notification ID ${id}`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const updated = await notificationService.deleteNotification(id);
      setNotifications(updated);
      console.log(`Deleted notification ID ${id}`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleViewDetails = (notif) => {
    setSelectedNotification(notif);
    setIsDetailsOpen(true);

    // Automatically mark as read when detail view is loaded
    if (notif.status === 'Unread') {
      handleMarkSingleRead(notif.id);
    }
  };

  const handleSaveSettings = async (settingsData) => {
    try {
      const saved = await notificationService.saveSettings(settingsData);
      setSettings(saved);
    } catch (err) {
      console.error(err);
    }
  };

  const tabsConfig = [
    { id: 'all', label: 'All' },
    { id: 'unread', label: 'Unread' },
    { id: 'today', label: 'Today' },
    { id: 'thisWeek', label: 'This Week' },
    { id: 'thisMonth', label: 'This Month' },
  ];

  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in duration-300">
      
      {/* Top Header & Breadcrumbs */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none">
        <div className="flex flex-col text-left gap-1">
          <h1 className="text-xl font-black text-[#111827]">Notifications</h1>
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#9CA3AF]">
            <span className="hover:text-[#6B7280] cursor-pointer">Dashboard</span>
            <span>&gt;</span>
            <span className="text-[#7C3AED]">Notifications</span>
          </div>
        </div>
      </header>

      {/* Grid of 4 Statistics Summary Cards */}
      <NotificationStats stats={stats} />

      {/* Timeline Tabs and Action Shortcuts */}
      <NotificationTabs
        tabs={tabsConfig}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onMarkAllRead={handleMarkAllRead}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Core Layout: Sidebar | Notification Listing */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full items-start">
        {/* Category Sidebar */}
        <div className="md:col-span-1">
          <NotificationSidebar
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        </div>

        {/* Listing Box */}
        <div className="md:col-span-3">
          <NotificationList
            notifications={filteredNotifications}
            isLoading={isLoading}
            onViewDetails={handleViewDetails}
            onMarkRead={handleMarkSingleRead}
            onArchive={handleArchive}
            onDelete={handleDelete}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        </div>
      </div>

      {/* Bottom Info CTA Banner */}
      <InfoBanner onSettingsClick={() => setIsSettingsOpen(true)} />

      {/* Modals */}
      <NotificationDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false);
          setSelectedNotification(null);
        }}
        notification={selectedNotification}
        onMarkRead={handleMarkSingleRead}
      />

      <NotificationSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        initialSettings={settings}
        onSaveSettings={handleSaveSettings}
      />

    </div>
  );
}
