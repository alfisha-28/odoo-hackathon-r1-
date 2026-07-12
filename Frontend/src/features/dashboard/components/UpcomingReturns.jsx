import React, { useRef } from 'react';
import * as Lucide from 'lucide-react';

export default function UpcomingReturns({ returns = [] }) {
  const scrollContainerRef = useRef(null);

  // Resolve Lucide icons based on asset type
  const getAssetIcon = (type) => {
    switch (type) {
      case 'laptop':
        return Lucide.Laptop;
      case 'chair':
        return Lucide.Armchair || Lucide.Package; // fallback if Armchair isn't in this version
      case 'camera':
        return Lucide.Camera;
      case 'projector':
        return Lucide.Monitor; // fallback for projector
      default:
        return Lucide.Package;
    }
  };

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 flex flex-col justify-between relative">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-base font-bold text-[#111827]">Upcoming Returns</h3>
        <div className="flex items-center gap-4">
          <button className="text-xs font-bold text-[#7C3AED] hover:underline cursor-pointer">
            View all
          </button>
          
          {/* Scroll Navigation */}
          <div className="hidden sm:flex items-center gap-1.5">
            <button
              onClick={() => scroll('left')}
              className="p-1.5 rounded-lg border border-[#E5E7EB] hover:bg-gray-50 text-[#6B7280] cursor-pointer"
            >
              <Lucide.ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-1.5 rounded-lg border border-[#E5E7EB] hover:bg-gray-50 text-[#6B7280] cursor-pointer"
            >
              <Lucide.ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Cards Scroll Container */}
      <div
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto pb-2 scrollbar-none snap-x snap-mandatory no-scrollbar"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {returns.map((item) => {
          const Icon = getAssetIcon(item.type);
          return (
            <div
              key={item.id}
              className="min-w-[280px] flex-1 max-w-[340px] bg-white border border-[#E5E7EB] rounded-2xl p-4 flex items-center justify-between gap-4 snap-start transition-all duration-300 hover:border-[#7C3AED] hover:shadow-md cursor-pointer"
            >
              {/* Left Side: Asset Icon and Details */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gray-50 border border-[#E5E7EB] text-[#475569] flex items-center justify-center flex-shrink-0">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">
                    {item.assetId}
                  </span>
                  <h4 className="text-xs font-bold text-[#111827] truncate mt-0.5">
                    {item.assetName}
                  </h4>
                  <p className="text-[11px] text-[#6B7280] mt-0.5">{item.assignedUser}</p>
                  <p className="text-[10px] font-semibold text-[#D97706] mt-1">
                    {item.daysLeft}
                  </p>
                </div>
              </div>

              {/* Right Side: Calendar Date Badge */}
              <div className="w-12 h-14 rounded-xl bg-[#FEF2F2] border border-[#FEE2E2] flex flex-col items-center justify-center flex-shrink-0 select-none">
                <span className="text-lg font-black text-[#DC2626] leading-none">
                  {item.dueDate}
                </span>
                <span className="text-[9px] font-bold text-[#DC2626] uppercase mt-1">
                  {item.dueMonth}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
