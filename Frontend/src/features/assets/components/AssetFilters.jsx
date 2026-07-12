import React from 'react';
import { Search, RotateCcw, ChevronDown } from 'lucide-react';

export default function AssetFilters({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedStatus,
  setSelectedStatus,
  selectedDepartment,
  setSelectedDepartment,
  selectedLocation,
  setSelectedLocation,
  filterOptions = {},
  onReset,
}) {
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-sm">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 items-end">
        {/* Search Query */}
        <div className="lg:col-span-3 relative w-full">
          <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-[#9CA3AF]">
            <Search className="w-4.5 h-4.5" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search assets..."
            className="w-full h-11 bg-white border border-[#E5E7EB] rounded-xl pl-10 pr-4 text-xs font-semibold text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:border-[#7C3AED] transition-colors"
          />
        </div>

        {/* Category Filter */}
        <div className="lg:col-span-2 relative w-full flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider pl-1">
            Category
          </label>
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full h-11 bg-white border border-[#E5E7EB] rounded-xl pl-4 pr-10 text-xs font-semibold text-[#475569] focus:outline-none focus:border-[#7C3AED] appearance-none cursor-pointer transition-colors"
            >
              <option value="">All Categories</option>
              {filterOptions.categories?.map((cat) => (
                <option key={cat.value || cat} value={cat.value || cat}>
                  {cat.label || cat}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] pointer-events-none" />
          </div>
        </div>

        {/* Status Filter */}
        <div className="lg:col-span-2 relative w-full flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider pl-1">
            Status
          </label>
          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full h-11 bg-white border border-[#E5E7EB] rounded-xl pl-4 pr-10 text-xs font-semibold text-[#475569] focus:outline-none focus:border-[#7C3AED] appearance-none cursor-pointer transition-colors"
            >
              <option value="">All Statuses</option>
              {filterOptions.statuses?.map((stat) => (
                <option key={stat.value || stat} value={stat.value || stat}>
                  {stat.label || stat}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] pointer-events-none" />
          </div>
        </div>

        {/* Department Filter */}
        <div className="lg:col-span-2 relative w-full flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider pl-1">
            Department
          </label>
          <div className="relative">
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full h-11 bg-white border border-[#E5E7EB] rounded-xl pl-4 pr-10 text-xs font-semibold text-[#475569] focus:outline-none focus:border-[#7C3AED] appearance-none cursor-pointer transition-colors"
            >
              <option value="">All Departments</option>
              {filterOptions.departments?.map((dept) => (
                <option key={dept.value || dept} value={dept.value || dept}>
                  {dept.label || dept}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] pointer-events-none" />
          </div>
        </div>

        {/* Location Filter */}
        <div className="lg:col-span-2 relative w-full flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider pl-1">
            Location
          </label>
          <div className="relative">
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full h-11 bg-white border border-[#E5E7EB] rounded-xl pl-4 pr-10 text-xs font-semibold text-[#475569] focus:outline-none focus:border-[#7C3AED] appearance-none cursor-pointer transition-colors"
            >
              <option value="">All Locations</option>
              {filterOptions.locations?.map((loc) => (
                <option key={loc.value || loc} value={loc.value || loc}>
                  {loc.label || loc}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] pointer-events-none" />
          </div>
        </div>

        {/* Reset Button */}
        <div className="lg:col-span-1 w-full">
          <button
            onClick={onReset}
            className="w-full h-11 bg-white border border-[#E5E7EB] hover:bg-gray-50 text-[#475569] hover:text-[#111827] rounded-xl flex items-center justify-center gap-1.5 text-xs font-bold transition-all duration-200 cursor-pointer shadow-sm select-none border-dashed"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
}
