import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import AssetStats from '../components/AssetStats';
import AssetFilters from '../components/AssetFilters';
import AssetTable from '../components/AssetTable';
import Pagination from '../components/Pagination';

import assetData from '../data/data.json';
import { assetService } from '../services/assetService';

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
  
  // Data State
  const [assets, setAssets] = useState([]);
  const [totalAssets, setTotalAssets] = useState(0);
  const [loading, setLoading] = useState(false);

  // Reset page when filter queries change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedStatus, selectedDepartment, selectedLocation]);

  const fetchAssets = async () => {
    setLoading(true);
    try {
      const data = await assetService.getAssets({
        search: searchQuery,
        status: selectedStatus,
        categoryId: selectedCategory, // Note: backend expects IDs if possible, but adjust if it uses names
        departmentId: selectedDepartment,
        location: selectedLocation,
        page: currentPage,
        limit: itemsPerPage
      });
      setAssets(data.assets);
      setTotalAssets(data.total);
    } catch (err) {
      console.error('Failed to load assets', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, [searchQuery, selectedCategory, selectedStatus, selectedDepartment, selectedLocation, currentPage, itemsPerPage]);

  // Handle filter resets
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedStatus('');
    setSelectedDepartment('');
    setSelectedLocation('');
    setSelectedIds([]);
  };

  // Row selection actions
  const handleToggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleToggleSelectAll = () => {
    const currentPageIds = assets.map((asset) => asset.id);
    const allCurrentPageSelected = currentPageIds.every((id) => selectedIds.includes(id));

    if (allCurrentPageSelected) {
      setSelectedIds((prev) => prev.filter((id) => !currentPageIds.includes(id)));
    } else {
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
        {loading ? (
          <div className="flex items-center justify-center h-32 text-gray-500 font-semibold">Loading...</div>
        ) : (
          <AssetTable
            assets={assets}
            selectedIds={selectedIds}
            onToggleSelect={handleToggleSelect}
            onToggleSelectAll={handleToggleSelectAll}
            onSort={handleSort}
            sortConfig={{ key: sortKey, direction: sortDirection }}
            onView={handleViewAsset}
            onEdit={handleEditAsset}
            onMore={handleMoreAsset}
          />
        )}

        {/* Pagination Controls */}
        <Pagination
          totalItems={totalAssets}
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
