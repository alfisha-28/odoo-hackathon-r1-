import React, { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import StatsCard from '../components/StatsCard';
import SearchBar from '../components/SearchBar';
import FilterDropdown from '../components/FilterDropdown';
import DateRangePicker from '../components/DateRangePicker';
import Tabs from '../components/Tabs';
import AllocationTable from '../components/AllocationTable';
import Pagination from '../components/Pagination';
import InfoBanner from '../components/InfoBanner';
import AllocationModal from '../components/AllocationModal';
import AllocationForm from '../components/AllocationForm';

import allocationData from '../data/data.json';

export default function AllocationPage() {
  const [allocationsList, setAllocationsList] = useState(allocationData.allocations);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [startDateFilter, setStartDateFilter] = useState('');
  const [endDateFilter, setEndDateFilter] = useState('');
  const [activeTab, setActiveTab] = useState('Active Allocations');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedStatus('');
    setSelectedDepartment('');
    setStartDateFilter('');
    setEndDateFilter('');
    setCurrentPage(1);
  };

  // Perform filtration logic
  const filteredAllocations = useMemo(() => {
    const list = allocationsList.filter((item) => {
      // 1. Tab filter
      if (activeTab === 'Active Allocations' && item.status !== 'Active') return false;
      if (activeTab === 'Pending Approvals' && item.status !== 'Pending') return false;
      if (activeTab === 'Returned Assets' && item.status !== 'Returned') return false;
      // "Allocation History" tab shows all records

      // 2. Text Search (ID, Asset Name, Employee Name)
      if (searchQuery) {
        const query = searchQuery.toLowerCase().trim();
        const matchesId = item.id.toLowerCase().includes(query);
        const matchesAsset = item.asset.name.toLowerCase().includes(query);
        const matchesEmployee = item.employee.name.toLowerCase().includes(query);
        if (!matchesId && !matchesAsset && !matchesEmployee) return false;
      }

      // 3. Dropdown Status Filter
      if (selectedStatus && item.status !== selectedStatus) return false;

      // 4. Dropdown Department Filter
      if (selectedDepartment && item.department !== selectedDepartment) return false;

      // 5. Date Range Filter (based on Allocated On date)
      if (startDateFilter) {
        const start = new Date(startDateFilter);
        const itemDate = new Date(item.allocatedOn);
        if (itemDate < start) return false;
      }
      if (endDateFilter) {
        const end = new Date(endDateFilter);
        const itemDate = new Date(item.allocatedOn);
        if (itemDate > end) return false;
      }

      return true;
    });

    return list;
  }, [allocationsList, activeTab, searchQuery, selectedStatus, selectedDepartment, startDateFilter, endDateFilter]);

  // Paginated subgrid
  const paginatedAllocations = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAllocations.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAllocations, currentPage]);

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    setCurrentPage(1);
  };

  // View item handler
  const handleView = (id) => {
    const alloc = allocationsList.find((a) => a.id === id);
    alert(`Viewing Details for: ${alloc.id}\nAsset: ${alloc.asset.name}\nAssigned: ${alloc.employee.name}\nDepartment: ${alloc.department}`);
  };

  const handleMore = (id) => {
    alert(`More Actions Menu triggered for ID: ${id}`);
  };

  // Modal Submit Success
  const handleAllocateSubmit = (formData) => {
    console.log('Allocate Asset Form Submitted:', formData);

    // Find the asset metadata
    const assetMeta = allocationData.assets.find(a => String(a.id) === String(formData.assetId)) || {
      name: 'Generic Asset',
      code: 'AF-TEMP',
      image: 'Laptop'
    };

    // Find the employee metadata if applicable
    let employeeMeta = { name: formData.departmentName, role: 'Team', avatar: 'DEPT' };
    if (formData.allocationType === 'Employee') {
      const emp = allocationData.employees.find(e => String(e.id) === String(formData.employeeId));
      if (emp) {
        employeeMeta = { name: emp.name, role: emp.role, avatar: emp.avatar };
      }
    }

    // Append new item to local state list
    const newAllocation = {
      id: `ALC-2025-00${133 + allocationsList.length}`,
      asset: {
        name: assetMeta.name,
        code: assetMeta.code,
        image: assetMeta.image
      },
      employee: employeeMeta,
      department: formData.allocationType === 'Employee'
        ? (formData.departmentName || 'IT Department')
        : formData.departmentName,
      allocatedOn: formData.allocationDate,
      dueDate: formData.dueDate,
      status: 'Active'
    };

    setAllocationsList(prev => [newAllocation, ...prev]);
    setIsModalOpen(false);
    alert('Asset successfully allocated! Check console logs.');
  };

  const handleSaveDraft = (draftData) => {
    console.log('Save Draft Allocation Form Data:', draftData);
    alert('Allocation successfully saved as draft! Form values logged to console.');
  };

  return (
    <>
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 select-none">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-[#111827]">
            Allocation & Transfer
          </h1>
          <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-[#9CA3AF]">
            <span>Dashboard</span>
            <span className="text-gray-300">/</span>
            <span className="text-[#7C3AED]">Allocation & Transfer</span>
          </div>
        </div>

        {/* Action Trigger Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-1.5 px-5 py-3 bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-black rounded-xl shadow-md shadow-[#7C3AED]/15 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer self-start sm:self-auto select-none"
        >
          <Plus className="w-4 h-4" />
          <span>New Allocation</span>
        </button>
      </div>

      {/* Statistics Cards grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        {allocationData.stats.map((stat) => (
          <StatsCard
            key={stat.id}
            title={stat.title}
            value={stat.value}
            subtitle={stat.subtitle}
            icon={stat.icon}
            color={stat.color}
          />
        ))}
      </section>

      {/* Filter Options box */}
      <section className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="flex flex-wrap items-end gap-4 w-full">
          {/* Search bar */}
          <div className="flex flex-col gap-1 w-full sm:w-auto flex-1 sm:min-w-[280px]">
            <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider pl-0.5 select-none">
              Search
            </span>
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search by asset, user or ID..."
            />
          </div>

          {/* Status Select */}
          <FilterDropdown
            label="Status"
            value={selectedStatus}
            onChange={setSelectedStatus}
            options={allocationData.statuses}
            placeholder="All Status"
          />

          {/* Department Select */}
          <FilterDropdown
            label="Department"
            value={selectedDepartment}
            onChange={setSelectedDepartment}
            options={allocationData.departments}
            placeholder="All Departments"
          />

          {/* Date Picker */}
          <DateRangePicker
            startDate={startDateFilter}
            endDate={endDateFilter}
            onStartChange={setStartDateFilter}
            onEndChange={setEndDateFilter}
          />

          {/* Reset Filters action */}
          <button
            onClick={handleResetFilters}
            className="h-11 px-4.5 border border-[#E5E7EB] hover:bg-gray-50 text-[#6B7280] hover:text-[#111827] text-xs font-bold rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 select-none w-full sm:w-auto"
          >
            <span>Reset</span>
          </button>
        </div>
      </section>

      {/* Main Table section */}
      <section className="flex flex-col gap-5">
        {/* Navigation Tabs */}
        <Tabs
          tabs={allocationData.tabs}
          activeTab={activeTab}
          onChange={handleTabChange}
        />

        {/* Data list */}
        <AllocationTable
          allocations={paginatedAllocations}
          onView={handleView}
          onMore={handleMore}
        />

        {/* Pagination controls */}
        {filteredAllocations.length > 0 && (
          <Pagination
            totalItems={filteredAllocations.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        )}
      </section>

      {/* Footer Info Message banner */}
      <section>
        <InfoBanner />
      </section>

      {/* Modal overlays */}
      <AllocationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <AllocationForm
          onCancel={() => setIsModalOpen(false)}
          onSaveDraft={handleSaveDraft}
          onSubmitSuccess={handleAllocateSubmit}
        />
      </AllocationModal>
    </>
  );
}
