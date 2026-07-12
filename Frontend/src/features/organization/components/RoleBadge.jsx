import React from 'react';

const roleStyles = {
  Admin: {
    bg: 'bg-[#F5F3FF]',
    text: 'text-[#7C3AED]',
    border: 'border-[#EDE9FE]',
  },
  Manager: {
    bg: 'bg-[#EFF6FF]',
    text: 'text-[#2563EB]',
    border: 'border-[#DBEAFE]',
  },
  User: {
    bg: 'bg-[#F0FDF4]',
    text: 'text-[#16A34A]',
    border: 'border-[#DCFCE7]',
  },
};

export default function RoleBadge({ role }) {
  const style = roleStyles[role] || {
    bg: 'bg-gray-50',
    text: 'text-gray-600',
    border: 'border-gray-200',
  };

  return (
    <span
      className={`px-2.5 py-1 text-[10px] font-extrabold rounded-lg border ${style.bg} ${style.text} ${style.border} inline-flex items-center justify-center select-none`}
    >
      {role}
    </span>
  );
}
