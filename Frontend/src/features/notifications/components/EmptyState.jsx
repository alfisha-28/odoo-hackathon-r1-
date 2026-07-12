import React from 'react';
import { BellRing } from 'lucide-react';

export default function EmptyState({
  title = 'No notifications found',
  description = 'There are no notifications matching your current filters or search parameters.',
  icon: Icon = BellRing
}) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white border border-[#E5E7EB] rounded-2xl shadow-sm w-full select-none min-h-[300px] animate-in fade-in duration-305">
      <div className="w-14 h-14 bg-gray-50 border border-[#E5E7EB] rounded-2xl flex items-center justify-center text-[#9CA3AF] shadow-sm mb-4">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-sm font-black text-[#111827]">{title}</h3>
      <p className="text-xs font-semibold text-[#6B7280] max-w-[320px] leading-relaxed mt-1.5">
        {description}
      </p>
    </div>
  );
}
