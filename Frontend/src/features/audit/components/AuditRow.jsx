import { MoreVertical } from 'lucide-react';
import Avatar from './Avatar';
import AuditStatusBadge from './AuditStatusBadge';

export default function AuditRow({ audit, onView, onMore }) {
  const formatScheduledDate = (dateStr) => {
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

  return (
    <tr className="border-b border-[#F3F4F6] hover:bg-[#F9FAFB] transition-colors duration-150">
      {/* Audit ID */}
      <td className="px-6 py-4.5 text-left whitespace-nowrap">
        <button
          onClick={() => onView(audit.id)}
          className="text-xs font-black text-[#7C3AED] hover:text-[#6D28D9] hover:underline cursor-pointer select-none transition-colors"
        >
          {audit.id}
        </button>
      </td>

      {/* Audit Name */}
      <td className="px-6 py-4.5 text-left">
        <div className="flex flex-col text-left">
          <span className="text-xs font-black text-[#111827] max-w-[200px] truncate">
            {audit.name}
          </span>
        </div>
      </td>

      {/* Audit Type */}
      <td className="px-6 py-4.5 text-left whitespace-nowrap text-xs font-bold text-[#475569]">
        {audit.type}
      </td>

      {/* Location */}
      <td className="px-6 py-4.5 text-left whitespace-nowrap text-xs font-semibold text-[#475569]">
        {audit.location}
      </td>

      {/* Scheduled On */}
      <td className="px-6 py-4.5 text-left whitespace-nowrap text-xs font-bold text-[#475569]">
        {formatScheduledDate(audit.scheduledOn)}
      </td>

      {/* Status Badge */}
      <td className="px-6 py-4.5 text-left whitespace-nowrap">
        <AuditStatusBadge status={audit.status} />
      </td>

      {/* Auditor Card */}
      <td className="px-6 py-4.5 text-left whitespace-nowrap">
        <div className="flex items-center gap-2.5">
          <Avatar name={audit.auditor?.name} avatarUrl={audit.auditor?.avatar} size="sm" />
          <div className="flex flex-col text-left">
            <span className="text-xs font-black text-[#111827]">
              {audit.auditor?.name}
            </span>
            <span className="text-[10px] font-semibold text-[#9CA3AF]">
              {audit.auditor?.department}
            </span>
          </div>
        </div>
      </td>

      {/* Actions */}
      <td className="px-6 py-4.5 text-left whitespace-nowrap">
        <div className="flex items-center gap-2 select-none">
          <button
            onClick={() => onView(audit.id)}
            className="h-8 px-3.5 border border-[#E5E7EB] hover:bg-gray-50 text-[#7C3AED] font-black text-[11px] rounded-lg transition-colors cursor-pointer"
          >
            View
          </button>
          <button
            onClick={() => onMore(audit.id)}
            className="w-8 h-8 rounded-lg border border-[#E5E7EB] hover:bg-gray-50 text-[#6B7280] flex items-center justify-center cursor-pointer transition-colors"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}
