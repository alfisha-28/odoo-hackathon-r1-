import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';

export default function ActionButtons({ id, onEdit, onDelete }) {
  return (
    <div className="flex items-center gap-1 justify-end">
      {/* Edit button */}
      <button
        onClick={() => onEdit && onEdit(id)}
        title="Edit Record"
        className="p-1.5 hover:bg-[#F5F3FF] text-[#6B7280] hover:text-[#7C3AED] rounded-lg transition-all duration-200 cursor-pointer flex items-center justify-center hover:scale-105 active:scale-95"
      >
        <Pencil className="w-4 h-4" />
      </button>

      {/* Delete button */}
      <button
        onClick={() => onDelete && onDelete(id)}
        title="Delete Record"
        className="p-1.5 hover:bg-red-50 text-[#6B7280] hover:text-[#DC2626] rounded-lg transition-all duration-200 cursor-pointer flex items-center justify-center hover:scale-105 active:scale-95"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
