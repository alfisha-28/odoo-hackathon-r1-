import React from 'react';
import { Calendar } from 'lucide-react';

export default function DateRangePicker({ startDate, endDate, onStartChange, onEndChange }) {
  return (
    <div className="flex flex-col gap-1 w-full sm:w-auto">
      <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider pl-0.5 select-none">
        Date Range
      </span>
      <div className="flex items-center gap-2 bg-white border border-[#E5E7EB] rounded-xl h-11 px-3.5 focus-within:ring-2 focus-within:ring-[#7C3AED]/15 focus-within:border-[#7C3AED] transition-all w-full sm:w-auto">
        <Calendar className="w-4 h-4 text-[#9CA3AF] mr-1.5 flex-shrink-0" />
        <input
          type="date"
          value={startDate}
          onChange={(e) => onStartChange(e.target.value)}
          className="bg-transparent text-xs font-semibold text-[#475569] outline-none w-full sm:w-[105px] cursor-pointer"
          title="Start Date"
        />
        <span className="text-gray-300 text-xs select-none font-bold">to</span>
        <input
          type="date"
          value={endDate}
          onChange={(e) => onEndChange(e.target.value)}
          className="bg-transparent text-xs font-semibold text-[#475569] outline-none w-full sm:w-[105px] cursor-pointer"
          title="End Date"
        />
      </div>
    </div>
  );
}
