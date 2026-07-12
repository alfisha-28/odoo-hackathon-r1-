import React, { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';
import { format, subDays, parseISO } from 'date-fns';

export default function DateRangeFilter({ onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState('Custom Range');
  const [tempStart, setTempStart] = useState('2025-05-12');
  const [tempEnd, setTempEnd] = useState('2025-05-18');
  
  const [startDate, setStartDate] = useState('2025-05-12');
  const [endDate, setEndDate] = useState('2025-05-18');

  const containerRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleApply = (start, end, label) => {
    setStartDate(start);
    setEndDate(end);
    setSelectedLabel(label);
    setIsOpen(false);
    if (onChange) {
      onChange({ startDate: start, endDate: end });
    }
  };

  const handlePredefinedClick = (days, label) => {
    // Reference date is 18 May 2025 for mock purposes
    const refDate = new Date(2025, 4, 18); // May 18, 2025
    const start = subDays(refDate, days);
    const startStr = format(start, 'yyyy-MM-dd');
    const endStr = format(refDate, 'yyyy-MM-dd');
    
    setTempStart(startStr);
    setTempEnd(endStr);
    handleApply(startStr, endStr, label);
  };

  const formatDateString = (dateStr) => {
    try {
      return format(parseISO(dateStr), 'dd MMM yyyy');
    } catch {
      return dateStr;
    }
  };

  const displayRange = `${formatDateString(startDate)} - ${formatDateString(endDate)}`;

  return (
    <div className="relative" ref={containerRef}>
      {/* Selector Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="h-11 px-4 border border-[#E5E7EB] hover:bg-[#F8FAFC] text-[#475569] hover:text-[#111827] font-semibold text-xs rounded-xl flex items-center justify-center gap-2.5 transition-all cursor-pointer bg-white shadow-sm select-none"
      >
        <Calendar className="w-4 h-4 text-[#6B7280]" />
        <span>{displayRange}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-[#9CA3AF] transition-transform duration-250 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Box */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white border border-[#E5E7EB] rounded-2xl shadow-xl z-50 p-4 flex flex-col gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col gap-1.5 select-none text-left">
            <span className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-wider pl-0.5">
              Predefined Ranges
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handlePredefinedClick(7, 'Last 7 Days')}
                className="py-2 px-3 border border-[#E5E7EB] hover:border-[#7C3AED] hover:bg-[#F5F3FF] text-[#475569] hover:text-[#7C3AED] font-bold text-xs rounded-xl transition-all cursor-pointer text-center"
              >
                Last 7 Days
              </button>
              <button
                onClick={() => handlePredefinedClick(30, 'Last 30 Days')}
                className="py-2 px-3 border border-[#E5E7EB] hover:border-[#7C3AED] hover:bg-[#F5F3FF] text-[#475569] hover:text-[#7C3AED] font-bold text-xs rounded-xl transition-all cursor-pointer text-center"
              >
                Last 30 Days
              </button>
              <button
                onClick={() => handleApply('2025-05-01', '2025-05-31', 'This Month')}
                className="py-2 px-3 border border-[#E5E7EB] hover:border-[#7C3AED] hover:bg-[#F5F3FF] text-[#475569] hover:text-[#7C3AED] font-bold text-xs rounded-xl transition-all cursor-pointer text-center col-span-2"
              >
                This Month (May 2025)
              </button>
            </div>
          </div>

          <div className="border-t border-[#F3F4F6] w-full" />

          {/* Custom Date Ranges */}
          <div className="flex flex-col gap-2.5 text-left">
            <span className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-wider pl-0.5 select-none">
              Custom Range
            </span>
            <div className="flex items-center gap-2">
              <div className="flex flex-col gap-1 w-full">
                <span className="text-[9px] font-bold text-[#6B7280]">Start</span>
                <input
                  type="date"
                  value={tempStart}
                  onChange={(e) => setTempStart(e.target.value)}
                  className="w-full h-9 bg-white border border-[#E5E7EB] rounded-lg px-2 text-[11px] font-semibold text-[#475569] focus:outline-none focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED]/20 transition-colors"
                />
              </div>
              <div className="flex flex-col gap-1 w-full">
                <span className="text-[9px] font-bold text-[#6B7280]">End</span>
                <input
                  type="date"
                  value={tempEnd}
                  onChange={(e) => setTempEnd(e.target.value)}
                  className="w-full h-9 bg-white border border-[#E5E7EB] rounded-lg px-2 text-[11px] font-semibold text-[#475569] focus:outline-none focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED]/20 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={() => handleApply(tempStart, tempEnd, 'Custom Range')}
            className="w-full h-9 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center shadow-md shadow-[#7C3AED]/15"
          >
            Apply Range
          </button>
        </div>
      )}
    </div>
  );
}
