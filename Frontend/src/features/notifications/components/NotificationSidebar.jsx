import React, { useState } from 'react';
import * as Icons from 'lucide-react';

const categoryIcons = {
  all: Icons.Bell,
  Asset: Icons.Package,
  Booking: Icons.CalendarDays,
  Maintenance: Icons.Wrench,
  Audit: Icons.ShieldCheck,
};

export default function NotificationSidebar({
  categories = [],
  activeCategory = 'all',
  onCategoryChange
}) {
  const [isOpenMobile, setIsOpenMobile] = useState(false);

  // Find active category label for mobile selector
  const activeLabel = categories.find((c) => c.id === activeCategory)?.label || 'Filters';

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl shadow-sm overflow-hidden select-none w-full text-left">
      {/* Sidebar Header (toggles accordion on mobile) */}
      <div
        onClick={() => setIsOpenMobile(!isOpenMobile)}
        className="px-5 py-4.5 bg-gray-50/50 border-b border-[#E5E7EB] flex items-center justify-between cursor-pointer md:cursor-default"
      >
        <span className="text-xs font-black text-[#111827] uppercase tracking-wider flex items-center gap-2">
          <Icons.Filter className="w-4 h-4 text-[#7C3AED]" />
          <span>Filters</span>
        </span>
        
        {/* Mobile active indicator or arrow */}
        <div className="flex items-center gap-2 md:hidden">
          <span className="text-xs font-bold text-[#7C3AED] bg-[#F5F3FF] px-2.5 py-0.5 rounded-full border border-[#EDE9FE]">
            {activeLabel}
          </span>
          <Icons.ChevronDown
            className={`w-4 h-4 text-[#6B7280] transition-transform duration-200 ${isOpenMobile ? 'rotate-180' : ''}`}
          />
        </div>
      </div>

      {/* Categories List (collapsible accordion wrapper on mobile, always open on desktop) */}
      <div
        className={`md:block transition-all duration-305 ease-in-out overflow-hidden
          ${isOpenMobile ? 'max-h-[400px] border-b border-[#E5E7EB]' : 'max-h-0 md:max-h-none'}
        `}
      >
        <nav className="p-3 flex flex-col gap-1">
          {categories.map((cat) => {
            const Icon = categoryIcons[cat.id] || Icons.Bell;
            const isActive = activeCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => {
                  onCategoryChange(cat.id);
                  setIsOpenMobile(false); // Close mobile accordion after click
                }}
                className={`w-full h-11 px-3.5 rounded-xl flex items-center justify-between text-xs font-bold transition-all cursor-pointer select-none
                  ${isActive
                    ? 'bg-[#F5F3FF] text-[#7C3AED] shadow-sm'
                    : 'text-[#475569] hover:bg-gray-50 hover:text-[#111827]'
                  }
                `}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4.5 h-4.5 ${isActive ? 'text-[#7C3AED]' : 'text-[#6B7280]'}`} />
                  <span>{cat.label}</span>
                </div>

                {/* Count Badge */}
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-black tracking-wide min-w-[20px] text-center
                    ${isActive
                      ? 'bg-[#7C3AED] text-white'
                      : 'bg-gray-100 text-[#6B7280]'
                    }
                  `}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
