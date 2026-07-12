import React, { useState, useEffect } from 'react';
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
import { allocationService } from '../services/allocationService';

const getAssetImage = (name = '') => {
  const lower = name.toLowerCase();
  if (lower.includes('laptop') || lower.includes('macbook') || lower.includes('xps') || lower.includes('thinkpad')) return 'Laptop';
  if (lower.includes('printer') || lower.includes('laserjet') || lower.includes('canon')) return 'Printer';
  if (lower.includes('projector') || lower.includes('epson') || lower.includes('video')) return 'Projector';
  if (lower.includes('room') || lower.includes('hall') || lower.includes('office') || lower.includes('drive')) return 'Room';
  if (lower.includes('phone') || lower.includes('mobile') || lower.includes('iphone') || lower.includes('android')) return 'Mobile';
  return '';
};

const getInitials = (name = '') => {
  if (!name) return '';
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
};

export default function AllocationPage() {
  const [allocationsList, setAllocationsList] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // KPIs State
  const [kpis, setKpis] = useState({
    total: 0,
    active: 0,
    pending: 0,
    returned: 0
  });

  const fetchKPIs = async () => {
    try {
      const [totalRes, activeRes, pendingRes, returnedRes] = await Promise.all([
        allocationService.getAllocations({ limit: 1 }),
        allocationService.getAllocations({ status: 'ACTIVE', limit: 1 }),
        allocationService.getTransfers({ status: 'REQUESTED', limit: 1 }),
        allocationService.getAllocations({ status: 'RETURNED', limit: 1 })
      ]);

      setKpis({
        total: totalRes?.meta?.total || totalRes?.total || 0,
        active: activeRes?.meta?.total || activeRes?.total || 0,
        pending: pendingRes?.meta?.total || pendingRes?.total || 0,
        returned: returnedRes?.meta?.total || returnedRes?.total || 0
      });
    } catch (err) {
      console.error("Failed to load backend KPIs for allocation page:", err);
    }
  };

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

  const fetchAllocations = async () => {
    setLoading(true);
    try {
      let data;
      if (activeTab === 'Pending Approvals') {
        data = await allocationService.getTransfers({
          status: 'REQUESTED',
          page: currentPage,
          limit: itemsPerPage
        });
      } else {
        let fetchStatus = selectedStatus;
        if (activeTab === 'Active Allocations') fetchStatus = 'ACTIVE';
        if (activeTab === 'Returned Assets') fetchStatus = 'RETURNED';

        data = await allocationService.getAllocations({
          assetId: searchQuery, // Basic mapping, adjust as needed
          departmentId: selectedDepartment,
          status: fetchStatus,
          page: currentPage,
          limit: itemsPerPage
        });
      }

      const rawList = data?.allocations || data?.transfers || data?.data || [];
      const mappedList = rawList.map(item => {
        const isTransfer = item.requestedBy !== undefined;
        if (isTransfer) {
          return {
            id: item.id,
            rawItem: item,
            isTransfer: true,
            asset: {
              name: item.asset?.name || 'Unknown Asset',
              code: item.asset?.assetTag || 'N/A',
              image: getAssetImage(item.asset?.name)
            },
            employee: {
              name: item.requestedBy?.name || 'Unknown User',
              role: 'Requester',
              avatar: getInitials(item.requestedBy?.name)
            },
            department: item.requestedToDepartment || 'N/A',
            allocatedOn: item.createdAt,
            dueDate: null,
            status: item.status
          };
        } else {
          const empName = item.allocatedToEmployee?.name || '';
          const deptName = item.allocatedToDepartment?.name || '';
          return {
            id: item.id,
            rawItem: item,
            isTransfer: false,
            asset: {
              name: item.asset?.name || 'Unknown Asset',
              code: item.asset?.assetTag || 'N/A',
              image: getAssetImage(item.asset?.name)
            },
            employee: item.allocatedToEmployee ? {
              name: empName,
              role: 'Employee',
              avatar: getInitials(empName)
            } : {
              name: deptName || 'Department-wide',
              role: 'Department',
              avatar: getInitials(deptName)
            },
            department: deptName || 'Personal',
            allocatedOn: item.allocationDate,
            dueDate: item.expectedReturnDate,
            status: item.status
          };
        }
      });

      setAllocationsList(mappedList);
      setTotalItems(data?.meta?.total || data?.total || 0);
    } catch (err) {
      console.error('Failed to fetch allocations', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllocations();
    fetchKPIs();
  }, [activeTab, searchQuery, selectedStatus, selectedDepartment, startDateFilter, endDateFilter, currentPage]);

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    setCurrentPage(1);
  };

  // View item handler
  const handleView = (id) => {
    const alloc = allocationsList.find((a) => a.id === id);
    if (!alloc) return;
    alert(`Viewing Details for: ${alloc.id}\nStatus: ${alloc.status}`);
  };

  const handleMore = async (id) => {
    const alloc = allocationsList.find((a) => a.id === id);
    if (!alloc) return;

    if (activeTab === 'Pending Approvals') {
      const action = window.prompt("Action: Type 'approve' or 'reject'", "approve");
      if (!action) return;
      const reason = window.prompt("Reason (Optional):", "");
      try {
        await allocationService.processTransfer(id, action.toUpperCase(), reason);
        alert(`Transfer ${action.toUpperCase()} successfully!`);
        fetchAllocations();
        fetchKPIs();
      } catch (err) {
        console.error(err);
        alert("Failed to process transfer.");
      }
    } else {
      const action = window.prompt("Action: Type 'return' to return asset, or 'transfer' to request transfer", "return");
      if (action === 'return') {
        const condition = window.prompt("Enter Check-in Condition (e.g. Good, Damaged):", "Good");
        const notes = window.prompt("Enter Check-in Notes:", "Returned by user");
        if (condition) {
          try {
            await allocationService.returnAsset(id, { checkInCondition: condition, checkInNotes: notes });
            alert("Asset returned successfully!");
            fetchAllocations();
            fetchKPIs();
          } catch (e) {
            console.error(e);
            alert("Failed to return asset.");
          }
        }
      } else if (action === 'transfer') {
        const toEmployee = window.prompt("Enter target Employee ID for Transfer:");
        const reason = window.prompt("Enter reason for transfer:", "Reassigned");
        if (toEmployee) {
          try {
            await allocationService.requestTransfer({
              assetId: alloc.assetId || alloc.asset?.id || id,
              toAssigneeId: toEmployee,
              reason: reason
            });
            alert("Transfer requested successfully!");
            fetchAllocations();
            fetchKPIs();
          } catch (e) {
            console.error(e);
            alert("Failed to request transfer.");
          }
        }
      }
    }
  };

  // Modal Submit Success
  const handleAllocateSubmit = async (formData) => {
    try {
      await allocationService.allocateAsset({
        assetId: formData.assetId,
        assigneeId: formData.employeeId,
        departmentId: formData.departmentName,
        expectedReturnDate: formData.dueDate,
      });
      setIsModalOpen(false);
      alert('Asset successfully allocated!');
      fetchAllocations();
      fetchKPIs();
    } catch (err) {
      console.error(err);
      alert('Failed to allocate asset.');
    }
  };

  const statsCardsData = React.useMemo(() => {
    return [
      {
        id: 'stat-total',
        title: 'Total Allocations',
        value: kpis.total,
        subtitle: 'All time',
        icon: 'PackageCheck',
        color: 'indigo'
      },
      {
        id: 'stat-active',
        title: 'Active Allocations',
        value: kpis.active,
        subtitle: 'Currently active',
        icon: 'ArrowLeftRight',
        color: 'emerald'
      },
      {
        id: 'stat-pending',
        title: 'Pending Requests',
        value: kpis.pending,
        subtitle: 'Awaiting approval',
        icon: 'Clock3',
        color: 'orange'
      },
      {
        id: 'stat-returned',
        title: 'Returned Assets',
        value: kpis.returned,
        subtitle: 'All returned',
        icon: 'History',
        color: 'blue'
      }
    ];
  }, [kpis]);



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
        {statsCardsData.map((stat) => (
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

        {loading ? (
          <div className="flex items-center justify-center h-32 text-gray-500 font-semibold">Loading...</div>
        ) : (
          <AllocationTable
            allocations={allocationsList}
            onView={handleView}
            onMore={handleMore}
          />
        )}

        {/* Pagination controls */}
        {totalItems > 0 && (
          <Pagination
            totalItems={totalItems}
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
          onSubmitSuccess={handleAllocateSubmit}
        />
      </AllocationModal>
    </>
  );
}
