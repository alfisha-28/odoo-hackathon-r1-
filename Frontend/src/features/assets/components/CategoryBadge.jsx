import React from 'react';

const categoryStyles = {
  Laptop: {
    bg: 'bg-[#EFF6FF]',
    text: 'text-[#2563EB]',
    border: 'border-[#DBEAFE]',
  },
  Projector: {
    bg: 'bg-[#F5F3FF]',
    text: 'text-[#7C3AED]',
    border: 'border-[#EDE9FE]',
  },
  Furniture: {
    bg: 'bg-[#FFF7ED]',
    text: 'text-[#C2410C]',
    border: 'border-[#FFEDD5]',
  },
  Camera: {
    bg: 'bg-[#FFF1F2]',
    text: 'text-[#E11D48]',
    border: 'border-[#FFE4E6]',
  },
  Monitor: {
    bg: 'bg-[#ECFDF5]',
    text: 'text-[#0D9488]',
    border: 'border-[#CCFBF1]',
  },
  Printer: {
    bg: 'bg-[#FEF3C7]',
    text: 'text-[#D97706]',
    border: 'border-[#FEF3C7]',
  },
  Audio: {
    bg: 'bg-[#F0FDF4]',
    text: 'text-[#16A34A]',
    border: 'border-[#DCFCE7]',
  },
};

export default function CategoryBadge({ category }) {
  const style = categoryStyles[category] || {
    bg: 'bg-gray-50',
    text: 'text-gray-600',
    border: 'border-gray-200',
  };

  return (
    <span
      className={`px-2.5 py-1 text-[10px] font-extrabold rounded-lg border ${style.bg} ${style.text} ${style.border} inline-flex items-center justify-center select-none`}
    >
      {category}
    </span>
  );
}
