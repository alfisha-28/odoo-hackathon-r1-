import SearchBar from './SearchBar';
import FilterDropdown from './FilterDropdown';
import { RotateCcw, SlidersHorizontal } from 'lucide-react';

export default function MaintenanceFilters({
  searchQuery,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  selectedPriority,
  onPriorityChange,
  selectedCategory,
  onCategoryChange,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  onReset,
  statuses = [],
  priorities = [],
  categories = [],
}) {
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-sm flex flex-col gap-4 w-full select-none text-left">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        {/* Search and Filters grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 flex-grow items-end">
          {/* Search bar */}
          <div className="col-span-1 sm:col-span-2 flex flex-col gap-1 w-full">
            <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider pl-0.5 select-none text-left">
              Search
            </span>
            <SearchBar
              value={searchQuery}
              onChange={onSearchChange}
              placeholder="Search tickets, assets or IDs..."
            />
          </div>

          {/* Status filter */}
          <FilterDropdown
            label="Status"
            value={selectedStatus}
            onChange={onStatusChange}
            options={statuses}
            placeholder="All Status"
          />

          {/* Priority filter */}
          <FilterDropdown
            label="Priority"
            value={selectedPriority}
            onChange={onPriorityChange}
            options={priorities}
            placeholder="All Priority"
          />

          {/* Category filter */}
          <FilterDropdown
            label="Category"
            value={selectedCategory}
            onChange={onCategoryChange}
            options={categories}
            placeholder="All Category"
          />

          {/* Date range pickers */}
          <div className="flex flex-col gap-1 w-full">
            <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider pl-0.5 select-none text-left">
              Date Range
            </span>
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={startDate}
                onChange={(e) => onStartDateChange(e.target.value)}
                className="w-full h-11 bg-white border border-[#E5E7EB] rounded-xl px-3.5 text-xs font-semibold text-[#475569] focus:outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/15 transition-colors cursor-pointer"
              />
              <span className="text-xs font-bold text-[#9CA3AF] select-none">-</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => onEndDateChange(e.target.value)}
                className="w-full h-11 bg-white border border-[#E5E7EB] rounded-xl px-3.5 text-xs font-semibold text-[#475569] focus:outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/15 transition-colors cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Buttons Panel */}
        <div className="flex items-center gap-3 self-end select-none">
          <button
            onClick={() => alert('Toggle Advanced filters')}
            className="h-11 px-4 border border-[#E5E7EB] hover:bg-gray-50 text-[#475569] font-black text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters</span>
          </button>
          
          <button
            onClick={onReset}
            className="h-11 px-4 border border-[#E5E7EB] hover:bg-gray-100 text-[#EF4444] hover:text-[#DC2626] font-black text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            title="Reset Filters"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
}
