import React, { forwardRef } from 'react';
import { Calendar } from 'lucide-react';

const DatePicker = forwardRef(
  ({ label, name, required, error, placeholder = 'Select Date', ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {/* Label */}
        {label && (
          <label className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider pl-0.5 select-none">
            {label} {required && <span className="text-[#EF4444] font-black">*</span>}
          </label>
        )}

        {/* Input Date wrapper */}
        <div className="relative">
          <input
            ref={ref}
            name={name}
            type="date"
            placeholder={placeholder}
            className={`w-full h-11 bg-white border rounded-xl pl-4 pr-11 text-xs font-semibold text-[#475569] placeholder-[#9CA3AF] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/15 focus:border-[#7C3AED] cursor-pointer
              ${error ? 'border-[#EF4444] focus:ring-red-100' : 'border-[#E5E7EB]'}
            `}
            {...props}
          />
          <Calendar className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#9CA3AF] pointer-events-none" />
        </div>

        {/* Error message */}
        {error && (
          <span className="text-[10px] font-bold text-[#EF4444] pl-0.5 select-none">
            {error.message || error}
          </span>
        )}
      </div>
    );
  }
);

DatePicker.displayName = 'DatePicker';
export default DatePicker;
