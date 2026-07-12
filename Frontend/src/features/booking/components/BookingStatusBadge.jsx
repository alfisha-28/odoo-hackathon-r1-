const statusStyles = {
  approved: {
    bg: 'bg-[#EEFDF3]',
    border: 'border-[#DCFCE7]',
    text: 'text-[#16A34A]',
  },
  pending: {
    bg: 'bg-[#FFF7ED]',
    border: 'border-[#FFEDD5]',
    text: 'text-[#F97316]',
  },
  completed: {
    bg: 'bg-[#EFF6FF]',
    border: 'border-[#DBEAFE]',
    text: 'text-[#3B82F6]',
  },
  cancelled: {
    bg: 'bg-gray-100',
    border: 'border-gray-200',
    text: 'text-[#6B7280]',
  },
  rejected: {
    bg: 'bg-[#FEF2F2]',
    border: 'border-[#FEE2E2]',
    text: 'text-[#EF4444]',
  },
  overdue: {
    bg: 'bg-[#FFF1F2]',
    border: 'border-[#FFE4E6]',
    text: 'text-[#E11D48]',
  },
};

export default function BookingStatusBadge({ status = '' }) {
  const normStatus = status.toLowerCase();
  const style = statusStyles[normStatus] || statusStyles.pending;

  return (
    <span
      className={`inline-flex items-center justify-center px-2.5 py-1 text-[10px] font-black rounded-full border leading-none select-none ${style.bg} ${style.border} ${style.text}`}
    >
      {status}
    </span>
  );
}
