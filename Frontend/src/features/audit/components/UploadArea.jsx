import { useState } from 'react';
import { UploadCloud, CheckCircle2, AlertCircle } from 'lucide-react';

export default function UploadArea({ label, onFileSelect }) {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    validateAndSetFile(selected);
  };

  const validateAndSetFile = (selected) => {
    if (!selected) return;

    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/png',
      'image/jpeg',
      'image/jpg',
    ];
    if (!allowedTypes.includes(selected.type) && !selected.name.endsWith('.docx')) {
      setError('Only PDF, DOCX, PNG, and JPG files are supported.');
      setFile(null);
      onFileSelect(null);
      return;
    }

    if (selected.size > 5 * 1024 * 1024) {
      setError('File size must be under 5MB.');
      setFile(null);
      onFileSelect(null);
      return;
    }

    setError('');
    setFile(selected);
    onFileSelect(selected);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const selected = e.dataTransfer.files[0];
    validateAndSetFile(selected);
  };

  const removeFile = () => {
    setFile(null);
    onFileSelect(null);
  };

  return (
    <div className="flex flex-col gap-1.5 w-full text-left">
      {label && (
        <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider pl-0.5 select-none">
          {label}
        </span>
      )}

      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`w-full min-h-[140px] border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-5 text-center transition-all bg-gray-50/50 hover:bg-gray-50/100
          ${file ? 'border-[#22C55E]' : error ? 'border-[#EF4444]' : 'border-[#E5E7EB] hover:border-[#7C3AED]'}
        `}
      >
        <input
          type="file"
          id="audit-file-upload"
          accept=".pdf,.docx,.png,.jpg,.jpeg"
          className="hidden"
          onChange={handleFileChange}
        />

        {!file ? (
          <label
            htmlFor="audit-file-upload"
            className="flex flex-col items-center justify-center gap-2 cursor-pointer w-full h-full select-none"
          >
            <UploadCloud className={`w-8 h-8 ${error ? 'text-[#EF4444]' : 'text-[#9CA3AF]'}`} />
            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold text-[#111827]">
                Click to upload or drag & drop
              </span>
              <span className="text-[10px] font-semibold text-[#9CA3AF]">
                Supports PDF, DOCX, PNG, JPG (Max 5MB)
              </span>
            </div>
          </label>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 w-full select-none">
            <CheckCircle2 className="w-8 h-8 text-[#22C55E]" />
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-black text-[#111827] max-w-[200px] truncate">
                {file.name}
              </span>
              <span className="text-[10px] font-semibold text-[#6B7280]">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </span>
            </div>
            <button
              type="button"
              onClick={removeFile}
              className="text-[10px] font-black text-[#EF4444] hover:text-[#DC2626] transition-colors cursor-pointer mt-1.5"
            >
              Remove File
            </button>
          </div>
        )}
      </div>

      {error && (
        <span className="text-[10px] font-bold text-[#EF4444] flex items-center gap-1 pl-0.5 select-none mt-1 animate-in fade-in slide-in-from-top-1">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{error}</span>
        </span>
      )}
    </div>
  );
}
