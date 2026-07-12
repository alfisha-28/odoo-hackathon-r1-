import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChevronDown } from 'lucide-react';

export default function MonthlyAllocationChart({ data = [] }) {
  const [timeRange, setTimeRange] = useState('This Month');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const ranges = ['This Month', 'Last Month', 'This Quarter', 'Year to Date'];

  // Custom premium tooltip component
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-3 shadow-lg select-none">
          <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">{payload[0].payload.name}</p>
          <p className="text-sm font-black text-[#7C3AED] mt-1">
            {payload[0].value} <span className="text-[10px] font-medium text-[#6B7280]">allocations</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 flex flex-col justify-between h-full relative">
      {/* Header with Dropdown */}
      <div className="flex justify-between items-center mb-6 z-20">
        <h3 className="text-base font-bold text-[#111827]">Monthly Allocation</h3>
        
        {/* Dropdown Selector */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-[#E5E7EB] rounded-xl text-xs font-bold text-[#475569] hover:bg-gray-50 transition-colors cursor-pointer select-none"
          >
            {timeRange}
            <ChevronDown className="w-3.5 h-3.5 text-[#6B7280]" />
          </button>

          {dropdownOpen && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setDropdownOpen(false)} />
              <div className="absolute right-0 mt-1.5 w-32 bg-white border border-[#E5E7EB] rounded-xl shadow-xl py-1 z-40 animate-in fade-in slide-in-from-top-1 duration-150">
                {ranges.map((range) => (
                  <button
                    key={range}
                    onClick={() => {
                      setTimeRange(range);
                      setDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs font-semibold transition-colors ${
                      timeRange === range
                        ? 'bg-[#F5F3FF] text-[#7C3AED]'
                        : 'text-[#475569] hover:bg-gray-50 cursor-pointer'
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Bar Chart Container */}
      <div className="w-full h-[180px] my-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 5, left: -25, bottom: 0 }}
          >
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor="#7C3AED" />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9CA3AF', fontSize: 10, fontWeight: 'bold' }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9CA3AF', fontSize: 10, fontWeight: 'bold' }}
              domain={[0, 120]}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F9FAFB', radius: 8 }} />
            <Bar
              dataKey="allocations"
              fill="url(#barGradient)"
              radius={[6, 6, 0, 0]}
              maxBarSize={28}
              animationBegin={100}
              animationDuration={1000}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Footer Text */}
      <div className="border-t border-[#F3F4F6] pt-4 flex items-center gap-1.5 text-xs text-[#16A34A] font-bold">
        <span>↗</span>
        <span>18% increase in allocations this month</span>
      </div>
    </div>
  );
}
