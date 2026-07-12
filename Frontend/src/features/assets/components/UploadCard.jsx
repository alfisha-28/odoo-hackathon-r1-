import React, { useState, useRef } from 'react';
import { UploadCloud, Image, Trash2 } from 'lucide-react';

export default function UploadCard({ label = 'Upload Asset Image', onFileSelect }) {
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
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
    if (file.size > 5 * 1024 * 1024) {
      alert('File size exceeds 5MB limit.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
      if (onFileSelect) {
        onFileSelect(file);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleBrowseClick = () => {
    fileInputRef.current.click();
  };

  const handleRemove = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setPreviewUrl(null);
    if (onFileSelect) {
      onFileSelect(null);
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full select-none">
      <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider pl-0.5">
        {label}
      </span>

      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        className={`w-full min-h-[260px] border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center text-center transition-all duration-300 relative overflow-hidden group
          ${previewUrl ? 'border-[#E5E7EB] bg-white' : 'bg-[#F9FAFB]'}
          ${dragActive ? 'border-[#7C3AED] bg-[#F5F3FF]' : 'border-[#E5E7EB] hover:border-[#7C3AED] hover:bg-[#F5F3FF]/40'}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png, image/jpeg, image/webp"
          onChange={handleChange}
          className="hidden"
        />

        {previewUrl ? (
          /* Preview Mode */
          <div className="w-full h-full flex flex-col items-center justify-center gap-3 relative">
            <img
              src={previewUrl}
              alt="Asset Preview"
              className="max-h-[160px] object-contain rounded-xl border border-[#E5E7EB] shadow-sm transition-transform duration-300 group-hover:scale-102"
            />
            <button
              onClick={handleRemove}
              className="absolute top-0 right-0 p-2 bg-red-50 hover:bg-red-100 text-[#DC2626] rounded-xl transition-colors cursor-pointer"
              title="Remove Image"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <span className="text-[10px] font-bold text-[#6B7280]">Image Selected</span>
          </div>
        ) : (
          /* Upload Mode */
          <div className="flex flex-col items-center justify-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white border border-[#E5E7EB] flex items-center justify-center text-[#7C3AED] shadow-sm transition-transform group-hover:scale-105 duration-300">
              <UploadCloud className="w-6 h-6" />
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-xs font-black text-[#111827]">Drag & Drop Image Here</span>
              <span className="text-[10px] font-bold text-[#9CA3AF]">or</span>
            </div>

            <button
              type="button"
              onClick={handleBrowseClick}
              className="px-4 py-2 border border-[#7C3AED] hover:bg-[#7C3AED] text-[#7C3AED] hover:text-white text-xs font-bold rounded-xl transition-all duration-200 cursor-pointer shadow-sm hover:scale-105 active:scale-95"
            >
              Browse Files
            </button>

            <div className="flex flex-col gap-0.5 text-[9px] font-bold text-[#9CA3AF] mt-1.5">
              <span>JPG, PNG or WEBP</span>
              <span>Max 5MB</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
