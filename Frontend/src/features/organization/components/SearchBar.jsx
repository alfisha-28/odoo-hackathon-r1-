import React from 'react';
import { Search } from 'lucide-react';

export default function SearchBar({ value, onChange, placeholder = 'Search...' }) {
  return (
    <div className="relative w-full max-w-[240px]">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-9 bg-white border border-[#E5E7EB] rounded-xl pl-3 pr-10 text-xs font-semibold text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:border-[#7C3AED] transition-colors"
      />
      <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-[#9CA3AF]">
        <Search className="w-4 h-4" />
      </div>
    </div>
  );
}
