import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { ArrowRight } from 'lucide-react';

export default function AssetDistributionChart({
  data = [],
  totalAssets = '1,248',
  isLoading = false,
  onViewBreakdown
}) {
  if (isLoading) {
    return (
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm h-[380px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-[#7C3AED]/20 border-t-[#7C3AED] rounded-full animate-spin" />
          <span className="text-xs font-bold text-[#6B7280]">Loading distribution...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm select-none flex flex-col gap-4 text-left w-full h-[380px]">
      <h3 className="text-sm font-black text-[#111827]">Asset Status Distribution</h3>

      {/* Chart Layout Container */}
      <div className="flex-grow flex items-center justify-between gap-6 min-h-0 relative">
        {/* Left Side: Donut Chart with Centered Text */}
        <div className="w-1/2 h-full relative flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                innerRadius="65%"
                outerRadius="85%"
                paddingAngle={3}
                dataKey="value"
                animationDuration={800}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #E5E7EB',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  fontSize: '11px',
                  fontWeight: 'bold',
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Centered Counter Text */}
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-xl font-black text-[#111827]">{totalAssets}</span>
            <span className="text-[9px] font-bold text-[#9CA3AF] uppercase tracking-wider">
              Total Assets
            </span>
          </div>
        </div>

        {/* Right Side: Detailed Legends */}
        <div className="w-1/2 flex flex-col justify-center gap-3">
          {data.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between text-xs font-semibold">
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-[#475569]">{item.name}</span>
              </div>
              <span className="text-[#111827] font-bold text-right pl-2">
                {item.value} <span className="text-[#9CA3AF] font-medium text-[10px]">({item.percentage}{String(item.percentage).endsWith('%') ? '' : '%'})</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* View Detailed Breakdown Footer Button */}
      <button
        onClick={onViewBreakdown || (() => alert('Navigating to Detailed Breakdown...'))}
        className="w-full h-11 bg-gray-50 border border-[#E5E7EB] hover:bg-[#F5F3FF] hover:border-[#EDE9FE] text-[#7C3AED] font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer select-none"
      >
        <span>View Detailed Breakdown</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}
