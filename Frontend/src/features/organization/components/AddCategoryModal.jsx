import { useState } from 'react';
import { X } from 'lucide-react';

export default function AddCategoryModal({ onClose, onAdd }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [customFields, setCustomFields] = useState('');
  const [jsonError, setJsonError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setJsonError('');
    if (!name.trim()) return;

    let parsedFields = {};
    if (customFields.trim()) {
      try {
        parsedFields = JSON.parse(customFields);
      } catch (err) {
        setJsonError('Invalid JSON format');
        return;
      }
    }

    onAdd({ 
      name: name.trim(), 
      description: description.trim(),
      customFields: parsedFields
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-black text-[#111827]">Add Asset Category</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#374151]">Category Name <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. IT Equipment"
              className="h-10 px-3 border border-[#E5E7EB] rounded-xl text-sm text-[#111827] focus:outline-none focus:border-[#7C3AED] transition-colors"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#374151]">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of this category..."
              rows={2}
              className="px-3 py-2 border border-[#E5E7EB] rounded-xl text-sm text-[#111827] focus:outline-none focus:border-[#7C3AED] transition-colors resize-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#374151]">Custom Fields (JSON format)</label>
            <textarea
              value={customFields}
              onChange={(e) => setCustomFields(e.target.value)}
              placeholder='e.g. {"warrantyPeriodMonths": 24}'
              rows={3}
              className="px-3 py-2 border border-[#E5E7EB] rounded-xl text-sm text-[#111827] focus:outline-none focus:border-[#7C3AED] transition-colors resize-none font-mono text-xs"
            />
            {jsonError && <span className="text-[10px] text-red-500">{jsonError}</span>}
          </div>

          <div className="flex justify-end gap-2 mt-1">
            <button
              type="button"
              onClick={onClose}
              className="h-9 px-4 rounded-xl text-xs font-bold text-[#6B7280] border border-[#E5E7EB] hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-9 px-4 rounded-xl text-xs font-bold text-white bg-[#7C3AED] hover:bg-[#6D28D9] transition-colors cursor-pointer"
            >
              Add Category
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
