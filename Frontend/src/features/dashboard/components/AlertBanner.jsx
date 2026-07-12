import React from 'react';
import { AlertTriangle } from 'lucide-react';

export default function AlertBanner({ count = 3, onAction }) {
  return (
    <div className="bg-[#FEF2F2] border border-[#FEE2E2] rounded-2xl p-4.5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-300">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-[#FEE2E2] rounded-xl text-[#DC2626] flex items-center justify-center flex-shrink-0">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div>
          <h5 className="text-sm font-bold text-[#DC2626]">
            {count} assets overdue for return
          </h5>
          <p className="text-xs text-[#DC2626]/80 mt-0.5">
            These assets are past the expected return date. Please follow up.
          </p>
        </div>
      </div>
      
      <button
        onClick={onAction}
        className="px-4 py-2 bg-white border border-[#FCA5A5] text-[#DC2626] font-bold text-xs rounded-xl hover:bg-[#FEF2F2] transition-colors duration-200 cursor-pointer shadow-sm select-none"
      >
        View Overdue Assets
      </button>
    </div>
  );
}
