import React from 'react';

export default function CardHeader({ title, description, actions }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#E5E7EB] pb-4 mb-4 select-none">
      <div className="flex flex-col gap-0.5">
        <h3 className="text-sm font-black text-[#111827] uppercase tracking-wider">{title}</h3>
        {description && (
          <p className="text-xs font-bold text-[#6B7280]">{description}</p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-3 self-end sm:self-auto">
          {actions}
        </div>
      )}
    </div>
  );
}
