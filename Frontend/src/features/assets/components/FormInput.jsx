import React, { forwardRef } from 'react';

const FormInput = forwardRef(
  ({ label, name, type = 'text', required, error, suffixIcon, placeholder, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {/* Label */}
        {label && (
          <label className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider pl-0.5 select-none">
            {label} {required && <span className="text-[#EF4444] font-black">*</span>}
          </label>
        )}

        {/* Input Wrapper */}
        <div className="relative">
          <input
            ref={ref}
            name={name}
            type={type}
            placeholder={placeholder}
            className={`w-full h-11 bg-white border rounded-xl px-4 text-xs font-semibold text-[#111827] placeholder-[#9CA3AF] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/15 focus:border-[#7C3AED]
              ${error ? 'border-[#EF4444] focus:ring-red-100' : 'border-[#E5E7EB]'}
              ${suffixIcon ? 'pr-11' : ''}
            `}
            {...props}
          />
          {suffixIcon && (
            <div className="absolute inset-y-0 right-3.5 flex items-center text-[#9CA3AF]">
              {suffixIcon}
            </div>
          )}
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

FormInput.displayName = 'FormInput';
export default FormInput;
