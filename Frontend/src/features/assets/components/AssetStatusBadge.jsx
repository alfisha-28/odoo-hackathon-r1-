import React from 'react';

const statusStyles = {
  Available: {
    bg: 'bg-[#EEFDF3]',
    text: 'text-[#16A34A]',
    border: 'border-[#DCFCE7]',
  },
  Allocated: {
    bg: 'bg-[#EFF6FF]',
    text: 'text-[#2563EB]',
    border: 'border-[#DBEAFE]',
  },
  Maintenance: {
    bg: 'bg-[#FFF9EB]',
    text: 'text-[#D97706]',
    border: 'border-[#FEF3C7]',
  },
  Reserved: {
    bg: 'bg-[#F5F3FF]',
    text: 'text-[#7C3AED]',
    border: 'border-[#EDE9FE]',
  },
  Lost: {
    bg: 'bg-[#FEF2F2]',
    text: 'text-[#DC2626]',
    border: 'border-[#FEE2E2]',
  },
  Disposed: {
    bg: 'bg-[#F9FAFB]',
    text: 'text-[#6B7280]',
    border: 'border-[#E5E7EB]',
  },
};

export default function AssetStatusBadge({ status }) {
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
