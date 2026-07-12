import React from 'react';
import { Info } from 'lucide-react';

export default function FormSection({ title, description, children }) {
  return (
    <div className="flex flex-col gap-5 w-full">
      {/* Header */}
      <div className="flex items-start gap-3 select-none">
        <div className="w-8 h-8 rounded-lg bg-[#F5F3FF] border border-[#EDE9FE] text-[#7C3AED] flex items-center justify-center flex-shrink-0 mt-0.5">
          <Info className="w-4.5 h-4.5" />
        </div>
        <div className="flex flex-col gap-0.5">
          <h3 className="text-sm font-black text-[#111827]">{title}</h3>
          {description && (
            <p className="text-xs font-semibold text-[#6B7280]">{description}</p>
          )}
        </div>
      </div>

      {/* Inputs Content */}
      <div className="w-full">
        {children}
      </div>
    </div>
  );
}
