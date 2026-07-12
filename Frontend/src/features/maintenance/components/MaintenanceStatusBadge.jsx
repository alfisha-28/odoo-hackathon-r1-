const statusStyles = {
  open: {
    bg: 'bg-[#EEFDF3]',
    border: 'border-[#DCFCE7]',
    text: 'text-[#16A34A]',
  },
  'in progress': {
    bg: 'bg-[#EFF6FF]',
    border: 'border-[#DBEAFE]',
    text: 'text-[#3B82F6]',
  },
  resolved: {
    bg: 'bg-[#EEFDF3]',
    border: 'border-[#DCFCE7]',
    text: 'text-[#16A34A]',
  },
  closed: {
    bg: 'bg-gray-100',
    border: 'border-gray-200',
    text: 'text-[#6B7280]',
  },
  cancelled: {
    bg: 'bg-gray-100',
    border: 'border-gray-200',
    text: 'text-[#9CA3AF]',
  },
};

export default function MaintenanceStatusBadge({ status = '' }) {
  const normStatus = status.toLowerCase();
  const style = statusStyles[normStatus] || statusStyles.open;

  return (
    <span
      className={`inline-flex items-center justify-center px-2.5 py-1 text-[10px] font-black rounded-full border leading-none select-none ${style.bg} ${style.border} ${style.text}`}
    >
      {status}
    </span>
  );
}
