import React from 'react';
import * as Lucide from 'lucide-react';

export default function QuickActionCard({ title, subtitle, icon, color, onClick }) {
  const IconComponent = Lucide[icon] || Lucide.Plus;

  const colorMap = {
    green: {
      bg: 'bg-[#F0FDF4]',
      text: 'text-[#16A34A]',
      border: 'border-[#DCFCE7]',
    },
    purple: {
      bg: 'bg-[#F5F3FF]',
      text: 'text-[#7C3AED]',
      border: 'border-[#EDE9FE]',
    },
    orange: {
      bg: 'bg-[#FFFBEB]',
      text: 'text-[#D97706]',
      border: 'border-[#FEF3C7]',
    },
  };

  const styles = colorMap[color] || colorMap.purple;

  return (
    <div
      onClick={onClick}
      className="bg-white border border-[#E5E7EB] rounded-2xl p-5 flex items-center gap-4 cursor-pointer transition-all duration-300 hover:border-[#7C3AED] hover:scale-[1.02] hover:shadow-md"
    >
      <div className={`w-12 h-12 rounded-xl border ${styles.border} ${styles.bg} ${styles.text} flex items-center justify-center flex-shrink-0`}>
        <IconComponent className="w-6 h-6" />
      </div>
      <div>
        <h4 className="text-sm font-bold text-[#111827]">{title}</h4>
        <p className="text-xs text-[#6B7280] mt-0.5">{subtitle}</p>
      </div>
    </div>
  );
}
