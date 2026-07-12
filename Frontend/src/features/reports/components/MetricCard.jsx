import React from 'react';
import * as Icons from 'lucide-react';

const colorStyles = {
  purple: {
    bg: 'bg-[#F5F3FF]',
    text: 'text-[#7C3AED]',
    border: 'border-[#EDE9FE]',
  },
  green: {
    bg: 'bg-[#EEFDF3]',
    text: 'text-[#16A34A]',
    border: 'border-[#DCFCE7]',
  },
  orange: {
    bg: 'bg-[#FFF7ED]',
    text: 'text-[#F97316]',
    border: 'border-[#FFEDD5]',
  },
  blue: {
    bg: 'bg-[#EFF6FF]',
    text: 'text-[#3B82F6]',
    border: 'border-[#DBEAFE]',
  },
  red: {
    bg: 'bg-[#FEF2F2]',
    text: 'text-[#EF4444]',
    border: 'border-[#FEE2E2]',
  },
};

export default function MetricCard({
  title,
  value,
  change,
  isPositive,
  icon,
  color = 'purple',
  subtitle = 'vs last month'
}) {
  const IconComponent = Icons[icon] || Icons.HelpCircle;
  const style = colorStyles[color] || colorStyles.purple;

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300 flex items-center gap-4 select-none">
      {/* Icon Wrapper */}
      <div className={`w-12 h-12 rounded-2xl ${style.bg} ${style.border} border ${style.text} flex items-center justify-center flex-shrink-0 shadow-sm`}>
        <IconComponent className="w-6 h-6" />
      </div>

      {/* Text Info */}
      <div className="flex flex-col text-left">
        <span className="text-2xl font-black text-[#111827]">{value}</span>
        <h4 className="text-xs font-bold text-[#6B7280]">{title}</h4>
        
        {/* Trend Indicator */}
        {change && (
          <div className="flex items-center gap-1 mt-1 text-[10px] font-bold">
            <span className={isPositive ? 'text-[#22C55E]' : 'text-[#EF4444]'}>
              {isPositive ? '↑' : '↓'}{change}
            </span>
            <span className="text-[#9CA3AF]">{subtitle}</span>
          </div>
        )}
      </div>
    </div>
  );
}
