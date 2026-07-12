import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import AssetStats from '../components/AssetStats';
import AssetFilters from '../components/AssetFilters';
import AssetTable from '../components/AssetTable';
import Pagination from '../components/Pagination';

import assetData from '../data/data.json';

export default function AssetDirectoryPage() {
  const navigate = useNavigate();

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');

  // Selection State
  const [selectedIds, setSelectedIds] = useState([]);

  // Sorting State
  const [sortKey, setSortKey] = useState('tag');
  const [sortDirection, setSortDirection] = useState('asc');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Reset page when filter queries change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedStatus, selectedDepartment, selectedLocation]);

  // Handle filter resets
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedStatus('');
    setSelectedDepartment('');
    setSelectedLocation('');
    setSelectedIds([]);
  };

  // Perform filtering
  const filteredAssets = useMemo(() => {
    return assetData.assets.filter((asset) => {
      // Search text query
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        asset.name.toLowerCase().includes(query) ||
        asset.tag.toLowerCase().includes(query) ||
        asset.serialNumber.toLowerCase().includes(query);

      // Dropdown filters
      const matchesCategory = !selectedCategory || asset.category === selectedCategory;
      const matchesStatus = !selectedStatus || asset.status === selectedStatus;
      const matchesDepartment = !selectedDepartment || asset.department === selectedDepartment;
      const matchesLocation = !selectedLocation || asset.location === selectedLocation;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesStatus &&
        matchesDepartment &&
        matchesLocation
      );
    });
  }, [searchQuery, selectedCategory, selectedStatus, selectedDepartment, selectedLocation]);

  // Perform sorting
  const sortedAssets = useMemo(() => {
    const sorted = [...filteredAssets];
    if (!sortKey) return sorted;

    sorted.sort((a, b) => {
      const valA = String(a[sortKey] || '').toLowerCase();
      const valB = String(b[sortKey] || '').toLowerCase();

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [filteredAssets, sortKey, sortDirection]);

  // Slice paginated items
  const paginatedAssets = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedAssets.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedAssets, currentPage, itemsPerPage]);

  // Row selection actions
  const handleToggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleToggleSelectAll = () => {
    const currentPageIds = paginatedAssets.map((asset) => asset.id);
    const allCurrentPageSelected = currentPageIds.every((id) => selectedIds.includes(id));

    if (allCurrentPageSelected) {
      // Deselect page items
      setSelectedIds((prev) => prev.filter((id) => !currentPageIds.includes(id)));
    } else {
      // Select page items
      setSelectedIds((prev) => {
        const unique = new Set([...prev, ...currentPageIds]);
        return Array.from(unique);
      });
    }
  };

  // Header Sorting toggler
  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  // Actions Callbacks
  const handleRegisterAsset = () => {
    navigate('/assets/register');
  };

  const handleViewAsset = (id) => {
    const asset = assetData.assets.find((a) => a.id === id);
    alert(`Viewing Details for: ${asset.tag} - ${asset.name}`);
  };

  const handleEditAsset = (id) => {
    const asset = assetData.assets.find((a) => a.id === id);
    alert(`Editing Asset Info: ${asset.tag} - ${asset.name}`);
  };

  const handleMoreAsset = (id) => {
    alert(`More Actions for Asset ID: ${id}`);
  };

  return (
    <>
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 select-none">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-[#111827]">
            Asset Directory
          </h1>
          <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-[#9CA3AF]">
            <span>Dashboard</span>
            <span className="text-gray-300">/</span>
            <span>Assets</span>
            <span className="text-gray-300">/</span>
            <span className="text-[#7C3AED]">Asset Directory</span>
          </div>
        </div>

        {/* Register Asset Action button */}
        <button
          onClick={handleRegisterAsset}
          className="flex items-center justify-center gap-1.5 px-4.5 py-3.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold rounded-xl shadow-md shadow-[#7C3AED]/15 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer self-start sm:self-auto select-none"
        >
          <Plus className="w-4 h-4" />
          <span>Register Asset</span>
        </button>
      </div>

      {/* Asset Stats Summary */}
      <section>
        <AssetStats stats={assetData.stats} />
      </section>

      {/* Filter Card */}
      <section>
        <AssetFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          selectedDepartment={selectedDepartment}
          setSelectedDepartment={setSelectedDepartment}
          selectedLocation={selectedLocation}
          setSelectedLocation={setSelectedLocation}
          filterOptions={assetData.filters}
          onReset={handleResetFilters}
        />
      </section>

      {/* Data Table */}
      <section className="flex flex-col gap-4">
        <AssetTable
          assets={paginatedAssets}
          selectedIds={selectedIds}
          onToggleSelect={handleToggleSelect}
          onToggleSelectAll={handleToggleSelectAll}
          onSort={handleSort}
          sortConfig={{ key: sortKey, direction: sortDirection }}
          onView={handleViewAsset}
          onEdit={handleEditAsset}
          onMore={handleMoreAsset}
        />

        {/* Pagination Controls */}
        <Pagination
          totalItems={filteredAssets.length}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={(val) => {
            setItemsPerPage(val);
            setCurrentPage(1);
          }}
        />
      </section>
    </>
  );
}
