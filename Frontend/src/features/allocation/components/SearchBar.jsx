import React from 'react';
import { Search } from 'lucide-react';

export default function SearchBar({ value, onChange, placeholder = 'Search...' }) {
  return (
    <div className="relative w-full sm:max-w-[280px]">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-11 bg-white border border-[#E5E7EB] rounded-xl pl-10 pr-4 text-xs font-semibold text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/15 transition-all"
      />
      <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-[#9CA3AF]">
        <Search className="w-4.5 h-4.5" />
      </div>
    </div>
  );
}
