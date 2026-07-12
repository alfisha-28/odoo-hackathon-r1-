import { useState } from 'react';
import SearchBar from './SearchBar';
import FilterDropdown from './FilterDropdown';
import { RotateCcw, SlidersHorizontal, ChevronDown } from 'lucide-react';

export default function AuditFilters({
  searchQuery,
  onSearchChange,
  selectedType,
  onTypeChange,
  selectedStatus,
  onStatusChange,
  selectedLocation,
  onLocationChange,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  onReset,
  types = [],
  statuses = [],
  locations = [],
}) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const activeCount = [selectedType, selectedStatus, selectedLocation, startDate, endDate].filter(Boolean).length;

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl shadow-sm w-full select-none text-left overflow-hidden">

      {/* Panel Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#F3F4F6]">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-[#7C3AED]" />
          <span className="text-xs font-black text-[#111827] uppercase tracking-wider">Filters</span>
          {activeCount > 0 && (
            <span className="bg-[#7C3AED] text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">
              {activeCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {activeCount > 0 && (
            <button
              onClick={onReset}
              className="flex items-center gap-1 text-[11px] font-black text-[#EF4444] hover:text-[#DC2626] transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          )}
          <button
            onClick={() => setShowAdvanced((p) => !p)}
            className="flex items-center gap-1 text-[11px] font-black text-[#6B7280] hover:text-[#111827] transition-colors cursor-pointer"
          >
            <span>{showAdvanced ? 'Less' : 'More'}</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${showAdvanced ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Filters Row */}
      <div className="px-5 py-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-end">
        {/* Search */}
        <div className="sm:col-span-2 lg:col-span-1 flex flex-col gap-1">
          <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider pl-0.5">Search</span>
          <SearchBar
            value={searchQuery}
            onChange={onSearchChange}
            placeholder="Search audits, assets or IDs..."
          />
        </div>

        {/* Audit Type */}
        <FilterDropdown
          label="Audit Type"
          value={selectedType}
          onChange={onTypeChange}
          options={types}
          placeholder="All Types"
        />

        {/* Status */}
        <FilterDropdown
          label="Status"
          value={selectedStatus}
          onChange={onStatusChange}
          options={statuses}
          placeholder="All Status"
        />

        {/* Location */}
        <FilterDropdown
          label="Location"
          value={selectedLocation}
          onChange={onLocationChange}
          options={locations}
          placeholder="All Locations"
        />
      </div>

      {/* Advanced: Date Range (toggle) */}
      {showAdvanced && (
        <div className="px-5 pb-4 grid grid-cols-1 sm:grid-cols-2 gap-3 border-t border-[#F3F4F6] pt-4">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider pl-0.5">From Date</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => onStartDateChange(e.target.value)}
              className="w-full h-11 bg-white border border-[#E5E7EB] rounded-xl px-3.5 text-xs font-semibold text-[#475569] focus:outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/15 transition-colors cursor-pointer"
            />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider pl-0.5">To Date</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => onEndDateChange(e.target.value)}
              className="w-full h-11 bg-white border border-[#E5E7EB] rounded-xl px-3.5 text-xs font-semibold text-[#475569] focus:outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/15 transition-colors cursor-pointer"
            />
          </div>
        </div>
      )}
    </div>
  );
}
