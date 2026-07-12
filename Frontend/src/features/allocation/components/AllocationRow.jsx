import React from 'react';
import { format, parseISO } from 'date-fns';
import { MoreVertical, Laptop, Printer, HelpCircle, HardDrive, Smartphone, Video } from 'lucide-react';
import StatusBadge from './StatusBadge';
import Avatar from './Avatar';

const assetIcons = {
  Laptop: Laptop,
  Printer: Printer,
  Projector: Video,
  Room: HardDrive,
  Mobile: Smartphone,
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  try {
    return format(parseISO(dateStr), 'dd MMM yyyy');
  } catch (err) {
    return dateStr;
  }
};

export default function AllocationRow({ allocation, onView, onMore }) {
  const AssetIcon = assetIcons[allocation.asset?.image] || HelpCircle;

  return (
    <tr className="border-b border-[#F3F4F6] transition-colors hover:bg-slate-50 select-none">
      {/* Allocation ID */}
      <td className="py-4.5 px-4 align-middle">
        <button
          onClick={() => onView(allocation.id)}
          className="text-xs font-black text-[#7C3AED] hover:text-[#6D28D9] hover:underline cursor-pointer bg-transparent"
        >
          {allocation.id}
        </button>
      </td>

      {/* Asset name & code */}
      <td className="py-4.5 px-4 align-middle">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#F5F3FF] border border-[#EDE9FE] text-[#7C3AED] flex items-center justify-center flex-shrink-0">
            <AssetIcon className="w-4.5 h-4.5" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-black text-[#111827]">{allocation.asset?.name}</span>
            <span className="text-[10px] font-bold text-[#9CA3AF] mt-0.5">{allocation.asset?.code}</span>
          </div>
        </div>
      </td>

      {/* Allocated To */}
      <td className="py-4.5 px-4 align-middle">
        <Avatar
          name={allocation.employee?.name}
          role={allocation.employee?.role}
          avatar={allocation.employee?.avatar}
        />
      </td>

      {/* Department */}
      <td className="py-4.5 px-4 align-middle text-xs font-semibold text-[#475569]">
        {allocation.department}
      </td>

      {/* Allocated On */}
      <td className="py-4.5 px-4 align-middle text-xs font-bold text-[#475569]">
        {formatDate(allocation.allocatedOn)}
      </td>

      {/* Due Date */}
      <td className="py-4.5 px-4 align-middle text-xs font-bold text-[#475569]">
        {formatDate(allocation.dueDate)}
      </td>

      {/* Status */}
      <td className="py-4.5 px-4 align-middle">
        <StatusBadge status={allocation.status} />
      </td>

      {/* Actions */}
      <td className="py-4.5 px-4 align-middle text-right">
        <div className="flex items-center gap-2 justify-end">
          <button
            onClick={() => onView(allocation.id)}
            className="px-3.5 py-1.5 bg-[#F9FAFB] hover:bg-[#F3F4F6] text-xs font-bold text-[#475569] border border-[#E5E7EB] rounded-lg transition-colors cursor-pointer select-none"
          >
            View
          </button>
          <button
            onClick={() => onMore(allocation.id)}
            className="p-1.5 hover:bg-gray-100 text-[#9CA3AF] hover:text-[#475569] rounded-lg transition-colors cursor-pointer"
            title="More Actions"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}
