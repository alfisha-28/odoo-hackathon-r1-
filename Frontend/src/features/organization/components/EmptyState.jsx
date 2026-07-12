import React from 'react';
import { ShieldAlert } from 'lucide-react';

export default function EmptyState({ title = 'No results found', message = 'Try refining your search keyword.' }) {
  return (
    <div className="py-12 text-center flex flex-col items-center justify-center gap-3">
      <div className="w-12 h-12 rounded-full bg-[#FEF2FE] text-[#7C3AED] flex items-center justify-center border border-[#F3E8FF] shadow-sm animate-bounce duration-1000">
        <ShieldAlert className="w-6 h-6" />
      </div>
      <div>
        <h4 className="text-sm font-black text-[#111827]">{title}</h4>
        <p className="text-xs text-[#6B7280] mt-1 font-semibold">
          {message}
        </p>
      </div>
    </div>
  );
}
