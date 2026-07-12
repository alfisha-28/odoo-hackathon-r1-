import { MoreVertical, Laptop, Building2, Car, Monitor, Projector, HelpCircle } from 'lucide-react';
import Avatar from './Avatar';
import BookingStatusBadge from './BookingStatusBadge';

const resourceIcons = {
  laptop: Laptop,
  'conference room': Building2,
  vehicle: Car,
  monitor: Monitor,
  equipment: Projector,
};

export default function BookingRow({ booking, onView, onMore }) {
  const { id, resource, employee, date, startTime, endTime, purpose, status } = booking;

  // Format date: e.g. "2025-05-15" -> "15 May 2025"
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  };

  // Format time: e.g. "10:00" -> "10:00 AM"
  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    const [hourStr, minStr] = timeStr.split(':');
    const hour = parseInt(hourStr, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 === 0 ? 12 : hour % 12;
    // Format hour as simple string, no leading pad to match design (e.g. 10:00 AM - 01:00 PM)
    return `${displayHour}:${minStr} ${ampm}`;
  };

  const ResourceIcon = resourceIcons[(resource.type || '').toLowerCase()] || HelpCircle;

  return (
    <tr className="hover:bg-gray-50/70 border-b border-[#E5E7EB] transition-colors">
      {/* Booking ID */}
      <td className="px-6 py-4.5 text-xs font-black text-[#7C3AED] select-all cursor-pointer hover:underline" onClick={() => onView(id)}>
        {id}
      </td>

      {/* Resource Details */}
      <td className="px-6 py-4.5">
        <div className="flex items-center gap-3">
          {/* Resource icon or placeholder display */}
          <div className="w-10 h-10 rounded-xl bg-gray-50 border border-[#E5E7EB] flex items-center justify-center text-[#6B7280] flex-shrink-0 shadow-sm">
            <ResourceIcon className="w-5 h-5" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xs font-bold text-[#111827]">{resource.name}</span>
            <span className="text-[10px] font-semibold text-[#9CA3AF]">{resource.type}</span>
          </div>
        </div>
      </td>

      {/* Booked By */}
      <td className="px-6 py-4.5">
        <div className="flex items-center gap-3">
          <Avatar name={employee.name} avatarUrl={employee.avatar} size="md" />
          <div className="flex flex-col text-left">
            <span className="text-xs font-bold text-[#111827]">{employee.name}</span>
            <span className="text-[10px] font-semibold text-[#9CA3AF]">{employee.department}</span>
          </div>
        </div>
      </td>

      {/* Date & Time */}
      <td className="px-6 py-4.5 text-left">
        <div className="flex flex-col">
          <span className="text-xs font-bold text-[#111827]">{formatDate(date)}</span>
          <span className="text-[10px] font-semibold text-[#6B7280]">
            {formatTime(startTime)} – {formatTime(endTime)}
          </span>
        </div>
      </td>

      {/* Purpose */}
      <td className="px-6 py-4.5 text-xs font-semibold text-[#475569] max-w-[200px] truncate text-left">
        {purpose}
      </td>

      {/* Status Badge */}
      <td className="px-6 py-4.5 text-left">
        <BookingStatusBadge status={status} />
      </td>

      {/* Actions */}
      <td className="px-6 py-4.5 text-right">
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => onView(id)}
            className="px-3.5 py-1.5 border border-[#E5E7EB] hover:bg-gray-100 text-[#475569] hover:text-[#111827] text-xs font-bold rounded-lg transition-colors cursor-pointer"
          >
            View
          </button>
          <button
            onClick={() => onMore(id)}
            className="p-1.5 hover:bg-gray-100 text-[#9CA3AF] hover:text-[#475569] rounded-lg transition-colors cursor-pointer"
            title="More actions"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}
