const priorityStyles = {
  low: {
    bg: 'bg-[#EEFDF3]',
    border: 'border-[#DCFCE7]',
    text: 'text-[#16A34A]',
  },
  medium: {
    bg: 'bg-[#FFFBEB]',
    border: 'border-[#FEF3C7]',
    text: 'text-[#D97706]',
  },
  high: {
    bg: 'bg-[#FFF5F5]',
    border: 'border-[#FED7D7]',
    text: 'text-[#E53E3E]',
  },
  critical: {
    bg: 'bg-[#FEF2F2]',
    border: 'border-[#FEE2E2]',
    text: 'text-[#EF4444]',
  },
};

export default function PriorityBadge({ priority = '' }) {
  const normPriority = priority.toLowerCase();
  const style = priorityStyles[normPriority] || priorityStyles.low;

  return (
    <span
      className={`inline-flex items-center justify-center px-2 py-0.5 text-[10px] font-black rounded border select-none uppercase tracking-wide leading-none ${style.bg} ${style.border} ${style.text}`}
    >
      {priority}
    </span>
  );
}
