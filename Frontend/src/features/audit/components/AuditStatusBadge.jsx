const statusStyles = {
  scheduled: {
    bg: 'bg-[#F5F3FF]',
    border: 'border-[#EDE9FE]',
    text: 'text-[#7C3AED]',
  },
  'in progress': {
    bg: 'bg-[#EFF6FF]',
    border: 'border-[#DBEAFE]',
    text: 'text-[#3B82F6]',
  },
  completed: {
    bg: 'bg-[#EEFDF3]',
    border: 'border-[#DCFCE7]',
    text: 'text-[#16A34A]',
  },
  overdue: {
    bg: 'bg-[#FEF2F2]',
    border: 'border-[#FEE2E2]',
    text: 'text-[#EF4444]',
  },
  cancelled: {
    bg: 'bg-gray-100',
    border: 'border-gray-200',
    text: 'text-[#6B7280]',
  },
};

export default function AuditStatusBadge({ status = '' }) {
  const normStatus = status.toLowerCase();
  const style = statusStyles[normStatus] || statusStyles.scheduled;

  return (
    <span
      className={`inline-flex items-center justify-center px-2.5 py-1 text-[10px] font-black rounded-full border leading-none select-none ${style.bg} ${style.border} ${style.text}`}
    >
      {status}
    </span>
  );
}
