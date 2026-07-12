import React, { useState, useRef, useEffect } from 'react';
import { Download, ChevronDown, FileText, FileSpreadsheet, Settings } from 'lucide-react';

export default function ExportButton({ onOpenExportModal }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleExportDirect = (format) => {
    console.log(`Initiating quick export for format: ${format}`);
    alert(`Success: Quick Exporting in ${format} format...`);
    setIsOpen(false);
  };

  const handleCustomClick = () => {
    setIsOpen(false);
    if (onOpenExportModal) {
      onOpenExportModal();
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Dropdown Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="h-11 px-4.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-md shadow-[#7C3AED]/20 select-none"
      >
        <Download className="w-4 h-4" />
        <span>Export</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-250 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Options */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-[#E5E7EB] rounded-2xl shadow-xl z-50 py-2.5 flex flex-col gap-1.5 animate-in fade-in slide-in-from-top-2 duration-200 text-left">
          
          <button
            onClick={() => handleExportDirect('PDF')}
            className="w-[calc(100%-16px)] mx-2 py-2 px-3 text-xs font-semibold text-[#475569] hover:text-[#111827] hover:bg-gray-50 rounded-xl flex items-center gap-2.5 transition-colors cursor-pointer"
          >
            <FileText className="w-4.5 h-4.5 text-red-500" />
            <span>Export as PDF</span>
          </button>

          <button
            onClick={() => handleExportDirect('Excel')}
            className="w-[calc(100%-16px)] mx-2 py-2 px-3 text-xs font-semibold text-[#475569] hover:text-[#111827] hover:bg-gray-50 rounded-xl flex items-center gap-2.5 transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-4.5 h-4.5 text-green-600" />
            <span>Export as Excel</span>
          </button>

          <button
            onClick={() => handleExportDirect('CSV')}
            className="w-[calc(100%-16px)] mx-2 py-2 px-3 text-xs font-semibold text-[#475569] hover:text-[#111827] hover:bg-gray-50 rounded-xl flex items-center gap-2.5 transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-4.5 h-4.5 text-blue-500" />
            <span>Export as CSV</span>
          </button>

          <div className="border-t border-[#F3F4F6] my-1 mx-2" />

          <button
            onClick={handleCustomClick}
            className="w-[calc(100%-16px)] mx-2 py-2 px-3 text-xs font-bold text-[#7C3AED] hover:bg-[#F5F3FF] rounded-xl flex items-center gap-2.5 transition-colors cursor-pointer"
          >
            <Settings className="w-4.5 h-4.5 text-[#7C3AED]" />
            <span>Custom Export...</span>
          </button>

        </div>
      )}
    </div>
  );
}
