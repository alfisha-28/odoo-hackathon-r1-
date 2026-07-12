import React from 'react';
import { ArrowRight } from 'lucide-react';
import ProgressRow from './ProgressRow';

export default function CategoryUtilizationCard({
  data = [],
  isLoading = false,
  onViewAll
}) {
  if (isLoading) {
    return (
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm h-[400px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-[#7C3AED]/20 border-t-[#7C3AED] rounded-full animate-spin" />
          <span className="text-xs font-bold text-[#6B7280]">Loading categories...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm select-none flex flex-col gap-4 text-left w-full h-[400px]">
      <h3 className="text-sm font-black text-[#111827]">Top Asset Categories by Utilization</h3>

      {/* Progress Rows Container */}
      <div className="flex-grow flex flex-col justify-center gap-4.5 min-h-0 overflow-y-auto no-scrollbar">
        {data.map((row, idx) => (
          <ProgressRow
            key={idx}
            label={row.category}
            percentage={row.percentage}
            barColor="bg-[#7C3AED]"
            showPercentageOnRight={true}
          />
        ))}
      </div>

      {/* Footer CTA */}
      <button
        onClick={onViewAll || (() => alert('Navigating to Categories Report...'))}
        className="w-full h-11 bg-gray-50 border border-[#E5E7EB] hover:bg-[#F5F3FF] hover:border-[#EDE9FE] text-[#7C3AED] font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer select-none"
      >
        <span>View All Categories</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}
