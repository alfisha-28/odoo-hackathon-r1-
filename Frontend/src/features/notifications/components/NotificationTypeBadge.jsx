import React from 'react';

const typeStyles = {
  Asset: 'bg-[#F5F3FF] text-[#7C3AED] border border-[#EDE9FE]',
  Booking: 'bg-[#EEFDF3] text-[#16A34A] border border-[#DCFCE7]',
  Maintenance: 'bg-[#FFF7ED] text-[#EA580C] border border-[#FFEDD5]',
  Audit: 'bg-[#EFF6FF] text-[#2563EB] border border-[#DBEAFE]',
  Allocation: 'bg-[#FDF2F8] text-[#DB2777] border border-[#FCE7F3]',
  System: 'bg-[#F8FAFC] text-[#475569] border border-[#E2E8F0]',
  Reports: 'bg-[#EEF2FF] text-[#4F46E5] border border-[#E0E7FF]',
};

export default function NotificationTypeBadge({ type }) {
  const style = typeStyles[type] || 'bg-gray-105 text-gray-700 border border-gray-200';
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${style} inline-block select-none whitespace-nowrap`}>
      {type}
    </span>
  );
}
