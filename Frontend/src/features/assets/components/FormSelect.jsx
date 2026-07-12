import React, { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

const FormSelect = forwardRef(
  ({ label, name, required, error, placeholder = 'Select Option', options = [], ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {/* Label */}
        {label && (
          <label className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider pl-0.5 select-none">
            {label} {required && <span className="text-[#EF4444] font-black">*</span>}
          </label>
        )}

        {/* Select Wrapper */}
        <div className="relative">
          <select
            ref={ref}
            name={name}
            className={`w-full h-11 bg-white border rounded-xl pl-4 pr-10 text-xs font-semibold text-[#475569] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/15 focus:border-[#7C3AED] appearance-none cursor-pointer
              ${error ? 'border-[#EF4444] focus:ring-red-100' : 'border-[#E5E7EB]'}
            `}
            {...props}
          >
            <option value="" disabled hidden>
              {placeholder}
            </option>
            {options.map((opt, idx) => {
              const val = typeof opt === 'string' ? opt : opt.value;
              const lbl = typeof opt === 'string' ? opt : opt.label;
              return (
                <option key={idx} value={val}>
                  {lbl}
                </option>
              );
            })}
          </select>
          <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] pointer-events-none" />
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

FormSelect.displayName = 'FormSelect';
export default FormSelect;
