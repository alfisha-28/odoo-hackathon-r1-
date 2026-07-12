import React from 'react';

export default function TableContainer({ children }) {
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all duration-300 flex flex-col h-full">
      {children}
    </div>
  );
}
