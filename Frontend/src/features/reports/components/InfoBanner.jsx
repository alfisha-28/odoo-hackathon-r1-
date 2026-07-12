import React from 'react';
import { Info, CalendarDays } from 'lucide-react';

export default function InfoBanner({ onScheduleClick }) {
  return (
    <div className="bg-[#F5F3FF] border border-[#EDE9FE] rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-4 select-none w-full animate-in fade-in duration-300">
      {/* Left Text & Icon */}
      <div className="flex items-start md:items-center gap-3.5 w-full text-left">
        <div className="w-10 h-10 rounded-xl bg-white border border-[#EDE9FE] flex items-center justify-center flex-shrink-0 text-[#7C3AED] shadow-sm">
          <Info className="w-5 h-5" />
        </div>
        <p className="text-xs md:text-sm font-semibold text-[#5B21B6] leading-relaxed">
          These insights help you optimize asset utilization, plan maintenance, and make data-driven decisions.
        </p>
      </div>

      {/* Right Action Button */}
      <button
        onClick={onScheduleClick}
        className="w-full md:w-auto h-11 px-5 bg-white border border-[#7C3AED] hover:bg-[#F5F3FF] text-[#7C3AED] font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-sm whitespace-nowrap self-stretch md:self-auto"
      >
        <CalendarDays className="w-4 h-4 text-[#7C3AED]" />
        <span>Schedule Report</span>
      </button>
    </div>
  );
}
