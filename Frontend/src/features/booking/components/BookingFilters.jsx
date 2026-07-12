import { Calendar } from 'lucide-react';
import SearchBar from './SearchBar';
import FilterDropdown from './FilterDropdown';

export default function BookingFilters({
  searchQuery,
  onSearchChange,
  selectedType,
  onTypeChange,
  selectedLocation,
  onLocationChange,
  selectedStatus,
  onStatusChange,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  onReset,
  resourceTypes = [],
  locations = [],
  statuses = [],
}) {
  return (
    <section className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="flex flex-wrap items-end gap-4 w-full text-left">
        {/* Search Input */}
        <div className="flex flex-col gap-1 w-full sm:w-auto flex-grow sm:min-w-[240px]">
          <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider pl-0.5 select-none">
            Search
          </span>
          <SearchBar
            value={searchQuery}
            onChange={onSearchChange}
            placeholder="Search resources or bookings..."
          />
        </div>

        {/* Resource Type Dropdown */}
        <FilterDropdown
          label="Resource Type"
          value={selectedType}
          onChange={onTypeChange}
          options={resourceTypes}
          placeholder="All Types"
        />

        {/* Location Dropdown */}
        <FilterDropdown
          label="Location"
          value={selectedLocation}
          onChange={onLocationChange}
          options={locations}
          placeholder="All Locations"
        />

        {/* Status Dropdown */}
        <FilterDropdown
          label="Status"
          value={selectedStatus}
          onChange={onStatusChange}
          options={statuses}
          placeholder="All Status"
        />

        {/* Date Range Picker */}
        <div className="flex flex-col gap-1 w-full sm:w-auto">
          <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider pl-0.5 select-none">
            Date Range
          </span>
          <div className="flex items-center gap-2 bg-white border border-[#E5E7EB] rounded-xl h-11 px-3.5 focus-within:ring-2 focus-within:ring-[#7C3AED]/15 focus-within:border-[#7C3AED] transition-all w-full sm:w-auto">
            <Calendar className="w-4 h-4 text-[#9CA3AF] mr-1.5 flex-shrink-0" />
            <input
              type="date"
              value={startDate}
              onChange={(e) => onStartDateChange(e.target.value)}
              className="bg-transparent text-xs font-semibold text-[#475569] outline-none w-full sm:w-[105px] cursor-pointer"
              title="Start Date"
            />
            <span className="text-gray-300 text-xs select-none font-bold">to</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => onEndDateChange(e.target.value)}
              className="bg-transparent text-xs font-semibold text-[#475569] outline-none w-full sm:w-[105px] cursor-pointer"
              title="End Date"
            />
          </div>
        </div>

        {/* Reset Button */}
        <button
          onClick={onReset}
          className="h-11 px-4.5 border border-[#E5E7EB] hover:bg-gray-50 text-[#6B7280] hover:text-[#111827] text-xs font-bold rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 select-none w-full sm:w-auto"
        >
          <span>Reset</span>
        </button>
      </div>
    </section>
  );
}
