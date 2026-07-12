import { useState } from 'react';

export default function QuickBookingCard({ resourceTypes = [], onQuickBook }) {
  const [selectedType, setSelectedType] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedType) {
      alert('Please select a resource type first.');
      return;
    }
    onQuickBook(selectedType);
  };

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow duration-300 text-left">
      <div className="flex flex-col gap-0.5 select-none">
        <h3 className="text-xs font-black text-[#111827]">Quick Booking</h3>
        <p className="text-[10px] font-bold text-[#6B7280]">
          Book a resource in just a few steps.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3">
        <div className="flex flex-col gap-1 w-full">
          <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider pl-0.5 select-none">
            Select Resource Type
          </span>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full h-11 bg-white border border-[#E5E7EB] rounded-xl px-4 text-xs font-semibold text-[#475569] focus:outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/15 cursor-pointer transition-colors"
          >
            <option value="">All Types</option>
            {resourceTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full h-11 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-md shadow-[#7C3AED]/10 cursor-pointer select-none"
        >
          <span>Book Now</span>
          <span>→</span>
        </button>
      </form>
    </div>
  );
}
