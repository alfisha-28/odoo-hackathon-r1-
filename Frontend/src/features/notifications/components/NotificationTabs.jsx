import React from 'react';
import { CheckCheck, Settings } from 'lucide-react';

export default function NotificationTabs({
  tabs = [],
  activeTab = 'all',
  onTabChange,
  onMarkAllRead,
  onOpenSettings,
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-[#E5E7EB] w-full gap-4 select-none pb-0">
      {/* Scrollable Tabs List */}
      <div className="flex items-center gap-6 overflow-x-auto no-scrollbar scroll-smooth -mb-px">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`py-3 text-xs font-black border-b-2 transition-all cursor-pointer whitespace-nowrap relative
                ${isActive
                  ? 'border-[#7C3AED] text-[#7C3AED]'
                  : 'border-transparent text-[#6B7280] hover:text-[#111827]'
                }
              `}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Action Controls on the Right */}
      <div className="flex items-center gap-4 self-end md:self-auto mb-2 md:mb-0">
        <button
          onClick={onMarkAllRead}
          className="flex items-center gap-1.5 text-xs font-bold text-[#475569] hover:text-[#7C3AED] transition-colors cursor-pointer"
          title="Mark all notifications as read"
        >
          <CheckCheck className="w-4 h-4" />
          <span>Mark all as read</span>
        </button>

        <button
          onClick={onOpenSettings}
          className="flex items-center gap-1.5 text-xs font-bold text-[#475569] hover:text-[#7C3AED] transition-colors cursor-pointer"
          title="Open notification settings preferences"
        >
          <Settings className="w-4 h-4" />
          <span>Notification Settings</span>
        </button>
      </div>
    </div>
  );
}
