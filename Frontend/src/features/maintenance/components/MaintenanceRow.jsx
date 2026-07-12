import { MoreVertical, Laptop, Printer, Hammer, HelpCircle } from 'lucide-react';
import Avatar from './Avatar';
import MaintenanceStatusBadge from './MaintenanceStatusBadge';
import PriorityBadge from './PriorityBadge';

export default function MaintenanceRow({ ticket, onView, onMore }) {
  const formatDueDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr + 'T00:00:00');
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const getDueDateLabel = (dateStr) => {
    if (!dateStr) return null;
    const targetDate = new Date(dateStr + 'T00:00:00');
    const today = new Date('2025-05-15T00:00:00'); // Mock today

    targetDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { text: 'Overdue', isOverdue: true };
    } else if (diffDays === 0) {
      return { text: 'Due today', isOverdue: false, isUrgent: true };
    } else if (diffDays === 1) {
      return { text: '1 day left', isOverdue: false, isUrgent: true };
    } else {
      return { text: `${diffDays} days left`, isOverdue: false };
    }
  };

  const dueLabel = getDueDateLabel(ticket.dueDate);
  const formattedDate = formatDueDate(ticket.dueDate);

  // Fallback icon selection
  const nameLower = ticket.asset?.name?.toLowerCase() || '';
  let AssetIcon = HelpCircle;
  if (nameLower.includes('laptop') || nameLower.includes('xps') || nameLower.includes('macbook')) {
    AssetIcon = Laptop;
  } else if (nameLower.includes('printer') || nameLower.includes('laserjet')) {
    AssetIcon = Printer;
  } else if (nameLower.includes('ac') || nameLower.includes('ton') || nameLower.includes('generator') || nameLower.includes('table') || nameLower.includes('desk')) {
    AssetIcon = Hammer;
  }

  return (
    <tr className="border-b border-[#F3F4F6] hover:bg-[#F9FAFB] transition-colors duration-150">
      {/* Ticket ID */}
      <td className="px-6 py-4.5 text-left whitespace-nowrap">
        <button
          onClick={() => onView(ticket.id)}
          className="text-xs font-black text-[#7C3AED] hover:text-[#6D28D9] hover:underline cursor-pointer select-none transition-colors"
        >
          {ticket.id}
        </button>
      </td>

      {/* Asset Info */}
      <td className="px-6 py-4.5 text-left">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gray-50 border border-[#E5E7EB] flex items-center justify-center flex-shrink-0 overflow-hidden select-none">
            {ticket.asset?.image && !ticket.asset.image.startsWith('/assets/') ? (
              <img
                src={ticket.asset.image}
                alt={ticket.asset.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            ) : (
              <AssetIcon className="w-5 h-5 text-[#6B7280]" />
            )}
          </div>
          <div className="flex flex-col gap-0.5 min-w-0">
            <span className="text-xs font-black text-[#111827] truncate max-w-[140px]">
              {ticket.asset?.name}
            </span>
            <span className="text-[10px] font-bold text-[#9CA3AF]">
              {ticket.asset?.code}
            </span>
          </div>
        </div>
      </td>

      {/* Issue Description */}
      <td className="px-6 py-4.5 text-left max-w-xs">
        <p className="text-xs font-semibold text-[#475569] line-clamp-2 leading-relaxed">
          {ticket.issue}
        </p>
      </td>

      {/* Priority Badge */}
      <td className="px-6 py-4.5 text-left whitespace-nowrap">
        <PriorityBadge priority={ticket.priority} />
      </td>

      {/* Reported By */}
      <td className="px-6 py-4.5 text-left whitespace-nowrap">
        <div className="flex items-center gap-2.5">
          <Avatar name={ticket.reportedBy?.name} avatarUrl={ticket.reportedBy?.avatar} size="sm" />
          <div className="flex flex-col gap-0.5">
            <span className="text-xs font-black text-[#111827]">
              {ticket.reportedBy?.name}
            </span>
            <span className="text-[10px] font-semibold text-[#9CA3AF]">
              {ticket.reportedBy?.department}
            </span>
          </div>
        </div>
      </td>

      {/* Status Badge */}
      <td className="px-6 py-4.5 text-left whitespace-nowrap">
        <MaintenanceStatusBadge status={ticket.status} />
      </td>

      {/* Due Date & Relativeness */}
      <td className="px-6 py-4.5 text-left whitespace-nowrap">
        <div className="flex flex-col gap-0.5 select-none">
          <span className="text-xs font-bold text-[#475569]">
            {formattedDate}
          </span>
          {dueLabel && (
            <span
              className={`text-[10px] font-bold
                ${dueLabel.isOverdue
                  ? 'text-[#EF4444] font-black'
                  : dueLabel.isUrgent
                    ? 'text-[#F59E0B] font-black'
                    : 'text-[#6B7280]'
                }
              `}
            >
              {dueLabel.text}
            </span>
          )}
        </div>
      </td>

      {/* Actions */}
      <td className="px-6 py-4.5 text-left whitespace-nowrap">
        <div className="flex items-center gap-2 select-none">
          <button
            onClick={() => onView(ticket.id)}
            className="h-8 px-3.5 border border-[#E5E7EB] hover:bg-gray-50 text-[#7C3AED] font-black text-[11px] rounded-lg transition-colors cursor-pointer"
          >
            View
          </button>
          <button
            onClick={() => onMore(ticket.id)}
            className="w-8 h-8 rounded-lg border border-[#E5E7EB] hover:bg-gray-50 text-[#6B7280] flex items-center justify-center cursor-pointer transition-colors"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}
