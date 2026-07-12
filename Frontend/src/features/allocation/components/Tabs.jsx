import React from 'react';

export default function Tabs({ tabs = [], activeTab, onChange }) {
  return (
    <div className="flex border-b border-[#E5E7EB] w-full overflow-x-auto no-scrollbar select-none gap-2">
      {tabs.map((tab) => {
        const isActive = activeTab === tab;
        return (
          <button
            key={tab}
            onClick={() => onChange(tab)}
            className={`px-5 py-3.5 text-xs font-black transition-all relative cursor-pointer whitespace-nowrap
              ${isActive
                ? 'text-[#7C3AED]'
                : 'text-[#6B7280] hover:text-[#111827]'
              }
            `}
          >
            <span>{tab}</span>
            {isActive && (
              <div className="absolute bottom-0 inset-x-0 h-0.5 bg-[#7C3AED] rounded-t-full" />
            )}
          </button>
        );
      })}
    </div>
  );
}
