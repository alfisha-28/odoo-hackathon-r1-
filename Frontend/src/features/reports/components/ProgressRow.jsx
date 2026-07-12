import React from 'react';

/**
 * Reusable ProgressRow component for displaying progress bars with percentages
 */
export default function ProgressRow({
  label,
  value,
  percentage,
  barColor = 'bg-[#7C3AED]',
  trackColor = 'bg-gray-100',
  showPercentageOnRight = true,
}) {
  return (
    <div className="flex flex-col gap-2 w-full select-none">
      <div className="flex justify-between items-center text-xs font-semibold">
        <span className="text-[#475569]">{label}</span>
        {showPercentageOnRight && (
          <span className="text-[#111827] font-bold">{percentage}%</span>
        )}
      </div>
      <div className={`w-full h-2 ${trackColor} rounded-full overflow-hidden`}>
        <div
          className={`h-full ${barColor} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
