import React from 'react';
import { Info } from 'lucide-react';

export default function InfoBanner() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-[#F5F3FF] border border-[#EDE9FE] rounded-2xl select-none w-full">
      <div className="flex items-start sm:items-center gap-3">
        <Info className="w-5 h-5 text-[#7C3AED] flex-shrink-0 mt-0.5 sm:mt-0" />
        <span className="text-xs font-bold text-[#4F46E5] leading-relaxed">
          Allocations help you assign assets to users or departments. You will receive reminders before the due date.
        </span>
      </div>
      <button
        onClick={() => alert('Redirect: Learn more about allocations policies')}
        className="text-xs font-black text-[#7C3AED] hover:text-[#6D28D9] flex items-center gap-1 self-start sm:self-auto cursor-pointer transition-colors"
      >
        <span>Learn More</span>
        <span>→</span>
      </button>
    </div>
  );
}
