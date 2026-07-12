import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, Trash2 } from 'lucide-react';

export default function UploadArea({ label = 'Attachments', onFileSelect }) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file) => {
    setSelectedFile(file);
    if (onFileSelect) {
      onFileSelect(file);
    }
  };

  const handleBrowseClick = (e) => {
    e.preventDefault();
    fileInputRef.current.click();
  };

  const handleRemove = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedFile(null);
    if (onFileSelect) {
      onFileSelect(null);
    }
  };

  return (
    <div className="flex flex-col gap-1.5 w-full select-none">
      {label && (
        <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider pl-0.5">
          {label}
        </span>
      )}

      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        className={`w-full min-h-[120px] border-2 border-dashed rounded-2xl p-4 flex flex-col items-center justify-center text-center transition-all duration-300 relative
          ${selectedFile ? 'border-[#E5E7EB] bg-white' : 'bg-[#F9FAFB]'}
          ${dragActive ? 'border-[#7C3AED] bg-[#F5F3FF]' : 'border-[#E5E7EB] hover:border-[#7C3AED] hover:bg-[#F5F3FF]/40'}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf, image/png, image/jpeg"
          onChange={handleChange}
          className="hidden"
        />

        {selectedFile ? (
          /* File Selected Mode */
          <div className="w-full flex items-center justify-between gap-3 p-2 bg-gray-50 border border-gray-100 rounded-xl">
            <div className="flex items-center gap-2 max-w-[80%]">
              <FileText className="w-5 h-5 text-[#7C3AED] flex-shrink-0" />
              <div className="flex flex-col text-left">
                <span className="text-xs font-black text-[#111827] truncate">
                  {selectedFile.name}
                </span>
                <span className="text-[9px] font-bold text-[#9CA3AF]">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </span>
              </div>
            </div>
            <button
              onClick={handleRemove}
              className="p-1.5 hover:bg-red-50 text-[#DC2626] rounded-lg transition-colors cursor-pointer"
              title="Remove Attachment"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ) : (
          /* Empty Drag Mode */
          <div className="flex flex-col items-center justify-center gap-2">
            <UploadCloud className="w-6 h-6 text-[#7C3AED]" />
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-black text-[#111827]">
                Drag & Drop or{' '}
                <button
                  type="button"
                  onClick={handleBrowseClick}
                  className="text-[#7C3AED] hover:underline font-black cursor-pointer bg-transparent"
                >
                  Browse Files
                </button>
              </span>
              <span className="text-[9px] font-bold text-[#9CA3AF]">
                Supports PDF, JPG, PNG (Max 10MB)
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
