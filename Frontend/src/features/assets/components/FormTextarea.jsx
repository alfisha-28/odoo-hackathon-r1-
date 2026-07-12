import React, { forwardRef, useState } from 'react';

const FormTextarea = forwardRef(
  ({ label, name, required, error, placeholder, maxLength = 500, value, onChange, defaultValue, ...props }, ref) => {
    const [localValue, setLocalValue] = useState(defaultValue || '');

    const handleChange = (e) => {
      setLocalValue(e.target.value);
      if (onChange) {
        onChange(e);
      }
    };

    const currentLength = value !== undefined ? String(value).length : String(localValue).length;

    const textareaProps = {
      ref,
      name,
      placeholder,
      maxLength,
      onChange: handleChange,
      ...props
    };

    if (value !== undefined) {
      textareaProps.value = value;
    } else if (defaultValue !== undefined) {
      textareaProps.defaultValue = defaultValue;
    }

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {/* Label */}
        {label && (
          <label className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider pl-0.5 select-none">
            {label} {required && <span className="text-[#EF4444] font-black">*</span>}
          </label>
        )}

        {/* Textarea */}
        <div className="relative">
          <textarea
            className={`w-full min-h-[110px] bg-white border rounded-xl p-4 text-xs font-semibold text-[#111827] placeholder-[#9CA3AF] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/15 focus:border-[#7C3AED] resize-none
              ${error ? 'border-[#EF4444] focus:ring-red-100' : 'border-[#E5E7EB]'}
            `}
            {...textareaProps}
          />
          {/* Character counter */}
          <div className="absolute bottom-3.5 right-4 text-[9px] font-bold text-[#9CA3AF] select-none">
            {currentLength} / {maxLength}
          </div>
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

FormTextarea.displayName = 'FormTextarea';
export default FormTextarea;
