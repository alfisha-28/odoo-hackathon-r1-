import React from 'react';
import { Eye, Pencil, MoreVertical } from 'lucide-react';

export default function ActionMenu({ assetId, onView, onEdit, onMore }) {
  return (
    <div className="flex items-center gap-1.5 justify-end">
      {/* View Action */}
      <button
        onClick={() => onView && onView(assetId)}
        title="View Details"
        className="p-1.5 hover:bg-[#F5F3FF] text-[#6B7280] hover:text-[#7C3AED] rounded-lg transition-all duration-200 cursor-pointer flex items-center justify-center hover:scale-105 active:scale-95"
      >
        <Eye className="w-4 h-4" />
      </button>

      {/* Edit Action */}
      <button
        onClick={() => onEdit && onEdit(assetId)}
        title="Edit Asset"
        className="p-1.5 hover:bg-[#F5F3FF] text-[#6B7280] hover:text-[#7C3AED] rounded-lg transition-all duration-200 cursor-pointer flex items-center justify-center hover:scale-105 active:scale-95"
      >
        <Pencil className="w-4 h-4" />
      </button>

      {/* More Action */}
      <button
        onClick={() => onMore && onMore(assetId)}
        title="More Actions"
        className="p-1.5 hover:bg-[#F5F3FF] text-[#6B7280] hover:text-[#7C3AED] rounded-lg transition-all duration-200 cursor-pointer flex items-center justify-center hover:scale-105 active:scale-95"
      >
        <MoreVertical className="w-4 h-4" />
      </button>
    </div>
  );
}
