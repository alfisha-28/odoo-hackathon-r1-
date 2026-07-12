import React from 'react';

export default function NotificationStatusBadge({ status }) {
  const isUnread = status === 'Unread';

  return (
    <div className="flex items-center gap-1.5 select-none">
      <span
        className={`w-2 h-2 rounded-full flex-shrink-0
          ${isUnread ? 'bg-[#7C3AED] animate-pulse' : 'bg-[#9CA3AF]'}
        `}
      />
      <span
        className={`text-xs font-bold
          ${isUnread ? 'text-[#7C3AED]' : 'text-[#9CA3AF]'}
        `}
      >
        {status}
      </span>
    </div>
  );
}
