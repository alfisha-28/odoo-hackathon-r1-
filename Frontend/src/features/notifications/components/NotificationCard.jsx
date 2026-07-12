import React, { useState, useRef, useEffect } from 'react';
import * as Icons from 'lucide-react';
import NotificationTypeBadge from './NotificationTypeBadge';
import NotificationStatusBadge from './NotificationStatusBadge';

const iconMap = {
  Asset: Icons.Package,
  Booking: Icons.CalendarDays,
  Maintenance: Icons.Wrench,
  Audit: Icons.ShieldCheck,
  Allocation: Icons.UserCheck,
  System: Icons.Bell,
  Reports: Icons.FileBarChart,
};

const iconColorMap = {
  Asset: 'bg-[#F5F3FF] text-[#7C3AED] border-[#EDE9FE]',
  Booking: 'bg-[#EEFDF3] text-[#16A34A] border-[#DCFCE7]',
  Maintenance: 'bg-[#FFF7ED] text-[#EA580C] border-[#FFEDD5]',
  Audit: 'bg-[#EFF6FF] text-[#2563EB] border-[#DBEAFE]',
  Allocation: 'bg-[#FDF2F8] text-[#DB2777] border-[#FCE7F3]',
  System: 'bg-[#F8FAFC] text-[#475569] border-[#E2E8F0]',
  Reports: 'bg-[#EEF2FF] text-[#4F46E5] border-[#E0E7FF]',
};

export default function NotificationCard({
  notification,
  onViewDetails,
  onMarkRead,
  onArchive,
  onDelete,
}) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  const { id, title, description, type, status, createdAt } = notification;
  const isUnread = status === 'Unread';

  // Format timestamp (e.g. 10 min ago or formatted date)
  const formatTime = (timeStr) => {
    try {
      const date = new Date(timeStr);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 1000 / 60);
      const diffHours = Math.floor(diffMins / 60);

      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins} min ago`;
      if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;

      // Return absolute formatted string like: 20 May 2025, 10:30 AM
      return date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }) + ', ' + date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    } catch {
      return timeStr;
    }
  };

  // Close dropdown menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    }
    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  const IconComponent = iconMap[type] || Icons.Bell;
  const iconColors = iconColorMap[type] || 'bg-gray-50 text-gray-600 border-gray-200';

  return (
    <div
      onClick={() => onViewDetails(notification)}
      className={`border-b border-[#F3F4F6] p-4.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all duration-200 cursor-pointer hover:bg-gray-50/50 select-none border-l-4
        ${isUnread
          ? 'bg-[#7C3AED]/3 border-l-[#7C3AED]'
          : 'bg-white border-l-transparent'
        }
      `}
    >
      {/* Left side info block */}
      <div className="flex items-start gap-4 flex-grow text-left">
        {/* Circle notification Icon */}
        <div className={`w-10 h-10 rounded-full border flex items-center justify-center flex-shrink-0 ${iconColors} shadow-sm`}>
          <IconComponent className="w-5 h-5" />
        </div>

        {/* Title & Description */}
        <div className="flex flex-col gap-1 pr-4 max-w-xl">
          <h4 className={`text-xs font-black text-[#111827] leading-none ${isUnread ? 'font-black text-[#7C3AED]' : 'font-bold'}`}>
            {title}
          </h4>
          <p className="text-[11px] font-semibold text-[#6B7280] leading-relaxed line-clamp-2">
            {description}
          </p>
        </div>
      </div>

      {/* Middle/Right side tags and details */}
      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto mt-2 sm:mt-0 flex-shrink-0">
        
        {/* Type Badge */}
        <div className="w-20 text-center sm:text-left flex-shrink-0">
          <NotificationTypeBadge type={type} />
        </div>

        {/* Timestamp */}
        <div className="flex flex-col text-left sm:text-right gap-0.5 min-w-[120px] flex-shrink-0 select-none">
          <span className="text-xs font-black text-[#111827]">{formatTime(createdAt)}</span>
          <span className="text-[9px] font-bold text-[#9CA3AF]">
            {new Date(createdAt).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </span>
        </div>

        {/* Status Dot/Badge */}
        <div className="w-18 flex-shrink-0">
          <NotificationStatusBadge status={status} />
        </div>

        {/* More Actions Dropdown Menu */}
        <div className="relative flex-shrink-0" ref={menuRef}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-[#9CA3AF] hover:text-[#475569] transition-colors cursor-pointer"
            title="More Actions"
          >
            <Icons.MoreVertical className="w-4.5 h-4.5" />
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-1 w-44 bg-white border border-[#E5E7EB] rounded-xl shadow-xl z-20 p-1 flex flex-col gap-0.5 animate-in fade-in slide-in-from-top-1 duration-150">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(false);
                  onViewDetails(notification);
                }}
                className="w-full text-left py-2 px-3 text-xs font-semibold hover:bg-gray-50 text-[#475569] hover:text-[#111827] rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Icons.Eye className="w-4 h-4 text-blue-500" />
                <span>View Details</span>
              </button>

              {isUnread && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMenu(false);
                    onMarkRead(id);
                  }}
                  className="w-full text-left py-2 px-3 text-xs font-semibold hover:bg-gray-50 text-[#475569] hover:text-[#111827] rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Icons.Check className="w-4 h-4 text-green-500" />
                  <span>Mark as Read</span>
                </button>
              )}

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(false);
                  onArchive(id);
                }}
                className="w-full text-left py-2 px-3 text-xs font-semibold hover:bg-gray-50 text-[#475569] hover:text-[#111827] rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Icons.Archive className="w-4 h-4 text-amber-500" />
                <span>Archive</span>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(false);
                  onDelete(id);
                }}
                className="w-full text-left py-2 px-3 text-xs font-semibold hover:bg-red-50 text-red-600 rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Icons.Trash2 className="w-4 h-4 text-red-500" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
