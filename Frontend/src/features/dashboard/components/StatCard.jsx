import React from 'react';
import * as Lucide from 'lucide-react';

export default function StatCard({ title, value, change, isPositive, icon, color }) {
  // Resolve Lucide icon component dynamically
  const IconComponent = Lucide[icon] || Lucide.Package;

  // Custom styling mappings based on color prop
  const colorMap = {
    green: {
      bg: 'bg-[#F0FDF4]',
      border: 'border-[#DCFCE7]',
      text: 'text-[#16A34A]',
    },
    blue: {
      bg: 'bg-[#EFF6FF]',
      border: 'border-[#DBEAFE]',
      text: 'text-[#3B82F6]',
    },
    orange: {
      bg: 'bg-[#FFFBEB]',
      border: 'border-[#FEF3C7]',
      text: 'text-[#D97706]',
    },
    purple: {
      bg: 'bg-[#F5F3FF]',
      border: 'border-[#EDE9FE]',
      text: 'text-[#7C3AED]',
    },
    red: {
      bg: 'bg-[#FEF2F2]',
      border: 'border-[#FEE2E2]',
      text: 'text-[#DC2626]',
    },
  };

  const styles = colorMap[color] || colorMap.blue;

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer flex flex-col justify-between min-h-[140px]">
      {/* Top Row: Icon and Title */}
      <div className="flex justify-between items-start">
        <div className={`p-2.5 rounded-xl border ${styles.border} ${styles.bg} ${styles.text} flex items-center justify-center`}>
          <IconComponent className="w-5 h-5" />
        </div>
        <span className="text-xs font-semibold text-[#6B7280] tracking-wide text-right">{title}</span>
      </div>

      {/* Middle Row: Large Value */}
      <div className="mt-3">
        <span className="text-3xl font-extrabold text-[#111827] tracking-tight">{value}</span>
      </div>

      {/* Bottom Row: Percentage and Comparison */}
      <div className="flex items-center gap-1 mt-2 text-xs font-medium">
        {isPositive ? (
          <span className="text-[#16A34A] flex items-center font-bold">
            <span className="mr-0.5">↗</span> {change}%
          </span>
        ) : (
          <span className="text-[#DC2626] flex items-center font-bold">
            <span className="mr-0.5">↘</span> {change}%
          </span>
        )}
        <span className="text-[#6B7280]">from last week</span>
      </div>
    </div>
  );
}
