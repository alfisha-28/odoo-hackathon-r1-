import * as Icons from 'lucide-react';

const colorStyles = {
  indigo: {
    bg: 'bg-[#F5F3FF]',
    text: 'text-[#7C3AED]',
    border: 'border-[#EDE9FE]',
  },
  emerald: {
    bg: 'bg-[#EEFDF3]',
    text: 'text-[#16A34A]',
    border: 'border-[#DCFCE7]',
  },
  orange: {
    bg: 'bg-[#FFF7ED]',
    text: 'text-[#F97316]',
    border: 'border-[#FFEDD5]',
  },
  red: {
    bg: 'bg-[#FEF2F2]',
    text: 'text-[#EF4444]',
    border: 'border-[#FEE2E2]',
  },
  blue: {
    bg: 'bg-[#EFF6FF]',
    text: 'text-[#3B82F6]',
    border: 'border-[#DBEAFE]',
  },
  green: {
    bg: 'bg-[#EEFDF3]',
    text: 'text-[#16A34A]',
    border: 'border-[#DCFCE7]',
  },
};

export default function StatsCard({ title, value, subtitle, icon, color = 'indigo' }) {
  const IconComponent = Icons[icon] || Icons.HelpCircle;
  const style = colorStyles[color] || colorStyles.indigo;

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300 flex items-center gap-4 select-none">
      <div className={`w-12 h-12 rounded-2xl ${style.bg} ${style.border} border ${style.text} flex items-center justify-center flex-shrink-0 shadow-sm`}>
        <IconComponent className="w-6 h-6" />
      </div>

      <div className="flex flex-col gap-0.5 text-left">
        <span className="text-2xl font-black text-[#111827]">{value}</span>
        <h4 className="text-xs font-bold text-[#6B7280]">{title}</h4>
        {subtitle && (
          <span className="text-[10px] font-bold text-[#9CA3AF] mt-0.5">{subtitle}</span>
        )}
      </div>
    </div>
  );
}
