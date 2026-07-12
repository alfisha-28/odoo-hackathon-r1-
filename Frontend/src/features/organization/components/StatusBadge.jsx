import React from 'react';

const statusStyles = {
  Active: {
    bg: 'bg-[#EEFDF3]',
    text: 'text-[#16A34A]',
    border: 'border-[#DCFCE7]',
  },
  Inactive: {
    bg: 'bg-[#FEF2F2]',
    text: 'text-[#DC2626]',
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
