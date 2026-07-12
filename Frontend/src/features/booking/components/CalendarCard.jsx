import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  parseISO
} from 'date-fns';

export default function CalendarCard({ bookings = [], onDateSelect, selectedDate }) {
  // Set default calendar month to May 2025 to match mockup data
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 4, 15)); // May 2025
  const mockToday = new Date(2025, 4, 12); // May 12, 2025 as "Today" to match design

  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  // Compute days of grid
  const daysGrid = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 }); // Start on Monday
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

    return eachDayOfInterval({ start: startDate, end: endDate });
  }, [currentMonth]);

  // Extract booked dates
  const bookedDates = useMemo(() => {
    return bookings.map((b) => parseISO(b.date));
  }, [bookings]);

  const hasBooking = (day) => {
    return bookedDates.some((bd) => isSameDay(bd, day));
  };

  const handleDayClick = (day) => {
    if (onDateSelect) {
      onDateSelect(day);
    }
  };

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow duration-300 text-left">
      <div className="flex items-center justify-between border-b border-[#F3F4F6] pb-4 select-none">
        <h3 className="text-xs font-black text-[#111827]">Calendar View</h3>
        <div className="flex items-center gap-1.5">
          <button
            onClick={handlePrevMonth}
            className="p-1 hover:bg-gray-100 text-[#9CA3AF] hover:text-[#475569] rounded-lg transition-colors cursor-pointer"
            title="Previous Month"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-[11px] font-black text-[#475569] min-w-[75px] text-center">
            {format(currentMonth, 'MMMM yyyy')}
          </span>
          <button
            onClick={handleNextMonth}
            className="p-1 hover:bg-gray-100 text-[#9CA3AF] hover:text-[#475569] rounded-lg transition-colors cursor-pointer"
            title="Next Month"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 text-center mt-3 select-none">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
          <span key={day} className="text-[9px] font-black text-[#9CA3AF] uppercase">
            {day}
          </span>
        ))}
      </div>

      {/* Calendar days grid */}
      <div className="grid grid-cols-7 gap-1 mt-2 text-center">
        {daysGrid.map((day, idx) => {
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isToday = isSameDay(day, mockToday);
          const isSelected = selectedDate && isSameDay(day, selectedDate);
          const hasBook = hasBooking(day);

          return (
            <div key={idx} className="relative flex flex-col items-center justify-center p-0.5">
              <button
                onClick={() => handleDayClick(day)}
                className={`w-7.5 h-7.5 rounded-full text-[10px] font-bold flex items-center justify-center transition-all cursor-pointer relative
                  ${!isCurrentMonth ? 'text-gray-300 font-semibold' : 'text-[#475569] hover:bg-gray-100'}
                  ${isToday ? 'border border-[#7C3AED] text-[#7C3AED]' : ''}
                  ${isSelected ? 'bg-[#7C3AED] text-white hover:bg-[#6D28D9] font-black shadow-sm shadow-[#7C3AED]/25' : ''}
                `}
              >
                {format(day, 'd')}
                {/* Booked dot */}
                {hasBook && !isSelected && (
                  <span
                    className={`absolute bottom-1 w-1 h-1 rounded-full ${
                      isToday ? 'bg-[#7C3AED]' : 'bg-[#9CA3AF]'
                    }`}
                  />
                )}
              </button>
            </div>
          );
        })}
      </div>

      <div className="mt-4 border-t border-[#F3F4F6] pt-3 text-center">
        <button
          onClick={() => {
            // Reset filters to show all bookings in May 2025
            if (onDateSelect) onDateSelect(null);
            alert('Full Calendar view triggered! Resets calendar filters.');
          }}
          className="text-[10px] font-black text-[#7C3AED] hover:text-[#6D28D9] transition-colors cursor-pointer inline-flex items-center gap-1"
        >
          <span>View Full Calendar</span>
          <span>→</span>
        </button>
      </div>
    </div>
  );
}
