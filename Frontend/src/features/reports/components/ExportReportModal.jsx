import React, { useState, useEffect } from 'react';
import { X, FileText, FileSpreadsheet, FileJson, CheckCircle } from 'lucide-react';

export default function ExportReportModal({ isOpen, onClose }) {
  const [exportType, setExportType] = useState('PDF');
  const [inclusions, setInclusions] = useState({
    charts: true,
    rawData: false,
    summary: true,
    attachments: false,
  });
  const [dataRange, setDataRange] = useState('filtered');

  // Prevent background scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Reset states on open/close
  useEffect(() => {
    if (!isOpen) {
      setExportType('PDF');
      setInclusions({
        charts: true,
        rawData: false,
        summary: true,
        attachments: false,
      });
      setDataRange('filtered');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleInclusionChange = (key) => {
    setInclusions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleExportSubmit = (e) => {
    e.preventDefault();
    const config = {
      exportType,
      inclusions,
      dataRange,
      exportedAt: new Date().toISOString(),
    };
    console.log('Initiated file export configuration:', config);
    alert(`Success: Export started in ${exportType} format! Check console for export settings.`);
    onClose();
  };

  const exportTypes = [
    { value: 'PDF', label: 'PDF Document', icon: FileText, color: 'text-red-500 bg-red-50 border-red-100 hover:bg-red-100/50' },
    { value: 'Excel', label: 'Excel Sheet', icon: FileSpreadsheet, color: 'text-green-600 bg-green-50 border-green-100 hover:bg-green-100/50' },
    { value: 'CSV', label: 'CSV File', icon: FileSpreadsheet, color: 'text-blue-500 bg-blue-50 border-blue-100 hover:bg-blue-100/50' },
    { value: 'JSON', label: 'JSON Dataset', icon: FileJson, color: 'text-amber-500 bg-amber-50 border-amber-100 hover:bg-amber-100/50' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 select-none">
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-[2px] transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Box */}
      <div className="bg-white rounded-2xl shadow-2xl border border-[#E5E7EB] w-full max-w-[480px] flex flex-col relative z-10 overflow-hidden transform transition-all scale-100 duration-300 animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#E5E7EB] px-6 py-4.5 bg-gray-50/50">
          <div className="flex flex-col gap-0.5 select-none text-left">
            <h2 className="text-base font-black text-[#111827]">Export Report</h2>
            <p className="text-xs font-semibold text-[#6B7280]">
              Configure export options for local saving.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 text-[#9CA3AF] hover:text-[#475569] rounded-xl transition-colors cursor-pointer"
            title="Close Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleExportSubmit} className="flex flex-col gap-5 p-6 text-left">
          
          {/* Export Type / Grid Buttons */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider pl-0.5 select-none">
              1. Choose Format
            </span>
            <div className="grid grid-cols-2 gap-3">
              {exportTypes.map((type) => {
                const Icon = type.icon;
                const isSelected = exportType === type.value;
                return (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setExportType(type.value)}
                    className={`p-3.5 border rounded-xl flex items-center gap-2.5 transition-all cursor-pointer relative select-none
                      ${isSelected 
                        ? 'border-[#7C3AED] ring-2 ring-[#7C3AED]/15 bg-[#F5F3FF]' 
                        : 'border-[#E5E7EB] hover:bg-gray-50'
                      }
                    `}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${type.color} flex-shrink-0`}>
                      <Icon className="w-4.5 h-4.5" />
                    </div>
                    <span className="text-xs font-bold text-[#111827]">{type.label}</span>
                    {isSelected && (
                      <CheckCircle className="w-4 h-4 text-[#7C3AED] absolute top-2 right-2 fill-white" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="border-t border-[#F3F4F6] w-full" />

          {/* Range Selection */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider pl-0.5 select-none">
              2. Data Range
            </span>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { value: 'page', label: 'Current Page' },
                { value: 'filtered', label: 'Filtered Data' },
                { value: 'complete', label: 'Complete Report' },
              ].map((range) => {
                const isSelected = dataRange === range.value;
                return (
                  <button
                    key={range.value}
                    type="button"
                    onClick={() => setDataRange(range.value)}
                    className={`py-2 px-3 border text-center text-xs font-bold rounded-xl transition-all cursor-pointer select-none
                      ${isSelected
                        ? 'bg-[#7C3AED] border-[#7C3AED] text-white shadow-sm shadow-[#7C3AED]/20'
                        : 'bg-white border-[#E5E7EB] text-[#475569] hover:border-gray-300'
                      }
                    `}
                  >
                    {range.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="border-t border-[#F3F4F6] w-full" />

          {/* Inclusions */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider pl-0.5 select-none">
              3. Include in File
            </span>
            <div className="grid grid-cols-2 gap-3">
              {[
                { key: 'charts', label: 'Visual Charts' },
                { key: 'rawData', label: 'Raw Data Tables' },
                { key: 'summary', label: 'Executive Summary' },
                { key: 'attachments', label: 'Linked Attachments' },
              ].map((item) => (
                <label
                  key={item.key}
                  className="flex items-center gap-2 p-2.5 border border-[#E5E7EB] rounded-xl hover:bg-gray-50/50 cursor-pointer transition-all select-none"
                >
                  <input
                    type="checkbox"
                    checked={inclusions[item.key]}
                    onChange={() => handleInclusionChange(item.key)}
                    className="w-4.5 h-4.5 rounded border-gray-300 text-[#7C3AED] focus:ring-[#7C3AED]"
                  />
                  <span className="text-xs font-semibold text-[#475569]">{item.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Modal Actions */}
          <div className="border-t border-[#E5E7EB] pt-4.5 mt-2 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={onClose}
              className="h-11 px-5 border border-[#E5E7EB] hover:bg-gray-105 text-[#475569] font-bold text-xs rounded-xl transition-colors cursor-pointer text-center"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="h-11 px-6 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-xs rounded-xl flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-md shadow-[#7C3AED]/15"
            >
              Export Report
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
