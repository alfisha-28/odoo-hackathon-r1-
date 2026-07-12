import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function FormActions({ onCancel, onSaveDraft, isSubmitting }) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4.5 px-6 select-none bg-white border border-[#E5E7EB] rounded-2xl shadow-sm">
      {/* Left: Cancel */}
      <button
        type="button"
        onClick={onCancel}
        className="w-full sm:w-auto h-11 px-6 border border-[#E5E7EB] hover:bg-gray-50 text-[#475569] font-bold text-xs rounded-xl transition-all duration-200 cursor-pointer text-center select-none"
      >
        Cancel
      </button>

      {/* Right: Save as Draft & Next */}
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
        <button
          type="button"
          onClick={onSaveDraft}
          disabled={isSubmitting}
          className="w-full sm:w-auto h-11 px-5 border border-[#7C3AED] hover:bg-[#F5F3FF] text-[#7C3AED] font-bold text-xs rounded-xl transition-all duration-200 cursor-pointer disabled:opacity-40 select-none"
        >
          Save as Draft
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto h-11 px-6 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95 disabled:opacity-40 disabled:hover:scale-100 select-none shadow-md shadow-[#7C3AED]/15"
        >
          <span>Next</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
