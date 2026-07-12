import React from 'react';

const statusStyles = {
  Active: {
    bg: 'bg-[#EEFDF3]',
    text: 'text-[#16A34A]',
    border: 'border-[#DCFCE7]',
  },
  Pending: {
    bg: 'bg-[#FFF7ED]',
    text: 'text-[#F97316]',
    border: 'border-[#FFEDD5]',
  },
  Returned: {
    bg: 'bg-[#F8FAFC]',
    text: 'text-[#475569]',
    border: 'border-[#E2E8F0]',
  },
  Completed: {
    bg: 'bg-[#EFF6FF]',
    text: 'text-[#2563EB]',
    border: 'border-[#DBEAFE]',
  },
  Overdue: {
    bg: 'bg-[#FEF2F2]',
    text: 'text-[#EF4444]',
    border: 'border-[#FEE2E2]',
  },
};

export default function StatusBadge({ status }) {
  const style = statusStyles[status] || {
    bg: 'bg-gray-50',
    text: 'text-gray-600',
    border: 'border-gray-200',
  };

  return (
    <span
      className={`px-2.5 py-1 text-[10px] font-extrabold rounded-lg border ${style.bg} ${style.text} ${style.border} inline-flex items-center justify-center select-none`}
    >
      {status}
    </span>
  );
}
