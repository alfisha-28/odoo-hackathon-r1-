import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { RefreshCw } from 'lucide-react';

export default function AssetStatusChart({ data = [] }) {
  const totalAssets = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 flex flex-col justify-between h-full">
      {/* Header */}
      <div>
        <h3 className="text-base font-bold text-[#111827]">Asset Status</h3>
      </div>

      {/* Chart & Legend Content */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 my-4">
        {/* Left: Donut Chart with Center Text */}
        <div className="relative w-[180px] h-[180px] flex items-center justify-center flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                animationBegin={0}
                animationDuration={800}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-2xl font-black text-[#111827] leading-none">
              {totalAssets}
            </span>
            <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider mt-1">
              Assets
            </span>
          </div>
        </div>

        {/* Right: Custom Legend List */}
        <div className="flex-grow w-full flex flex-col gap-2">
          {data.map((item) => (
            <div key={item.name} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="font-semibold text-[#6B7280]">{item.name}</span>
              </div>
              <div className="font-bold text-[#111827]">
                {item.value} <span className="font-medium text-[#9CA3AF] text-[10px]">({item.percentage}%)</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-[#F3F4F6] pt-4 flex justify-between items-center text-[10px] text-[#9CA3AF] font-bold">
        <span>Last updated: 10 min ago</span>
        <button className="p-1 hover:bg-gray-50 rounded-lg text-[#6B7280] cursor-pointer flex items-center justify-center transition-colors">
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
