import React from 'react';
import { ArrowUpDown, ShieldAlert } from 'lucide-react';
import AssetTableRow from './AssetTableRow';

export default function AssetTable({
  assets = [],
  selectedIds = [],
  onToggleSelect,
  onToggleSelectAll,
  onSort,
  sortConfig = {},
  onView,
  onEdit,
  onMore,
}) {
  const isAllSelected = assets.length > 0 && selectedIds.length === assets.length;
  const isSomeSelected = selectedIds.length > 0 && selectedIds.length < assets.length;

  const handleSelectAllChange = () => {
    onToggleSelectAll();
  };

  const getSortIcon = (key) => {
    // Return standard arrow-up-down for sorting trigger
    return <ArrowUpDown className="w-3.5 h-3.5 ml-1 inline-block text-[#9CA3AF] group-hover:text-[#475569] transition-colors" />;
  };

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl shadow-sm overflow-hidden flex flex-col">
      {/* Table scroll container */}
      <div className="overflow-x-auto w-full">
        <table className="w-full border-collapse text-left">
          {/* Table Headers */}
          <thead>
            <tr className="border-b border-[#E5E7EB] bg-[#F9FAFB] select-none text-[10px] font-bold text-[#6B7280] uppercase tracking-wider h-12">
              <th className="pl-6 w-12 align-middle">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    ref={(el) => {
                      if (el) {
                        el.indeterminate = isSomeSelected;
                      }
                    }}
                    onChange={handleSelectAllChange}
                    className="w-4 h-4 text-[#7C3AED] border-[#D1D5DB] rounded focus:ring-[#7C3AED] focus:ring-2 cursor-pointer transition-colors"
                  />
                </div>
              </th>
              
              <th
                onClick={() => onSort('tag')}
                className="px-4 align-middle cursor-pointer group hover:bg-[#F1F5F9] transition-colors h-full"
              >
                <div className="flex items-center">
                  <span>Asset Tag</span>
                  {getSortIcon('tag')}
                </div>
              </th>

              <th
                onClick={() => onSort('name')}
                className="px-4 align-middle cursor-pointer group hover:bg-[#F1F5F9] transition-colors h-full"
              >
                <div className="flex items-center">
                  <span>Asset</span>
                  {getSortIcon('name')}
                </div>
              </th>

              <th className="px-4 align-middle">Category</th>
              <th className="px-4 align-middle">Department</th>
              <th className="px-4 align-middle">Location</th>
              <th className="px-4 align-middle">Assigned To</th>
              <th className="px-4 align-middle">Status</th>
              <th className="pr-6 align-middle text-right w-28">Actions</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {assets.length > 0 ? (
              assets.map((asset) => (
                <AssetTableRow
                  key={asset.id}
                  asset={asset}
                  isSelected={selectedIds.includes(asset.id)}
                  onToggleSelect={onToggleSelect}
                  onView={onView}
                  onEdit={onEdit}
                  onMore={onMore}
                />
              ))
            ) : (
              <tr>
                <td colSpan="9" className="py-16 text-center">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-[#FEF2FE] text-[#7C3AED] flex items-center justify-center border border-[#F3E8FF] shadow-sm animate-bounce duration-1000">
                      <ShieldAlert className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-[#111827]">No assets match filter</h4>
                      <p className="text-xs text-[#6B7280] mt-1 font-semibold">
                        Try modifying search query or selecting other filter choices.
                      </p>
                    </div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
