import React from 'react';
import * as Lucide from 'lucide-react';
import AssetStatusBadge from './AssetStatusBadge';
import CategoryBadge from './CategoryBadge';
import ActionMenu from './ActionMenu';

// Thumbnail helper
const renderThumbnail = (category) => {
  let Icon = Lucide.Package;
  if (category === 'Laptop') Icon = Lucide.Laptop;
  else if (category === 'Projector') Icon = Lucide.Projector;
  else if (category === 'Camera') Icon = Lucide.Camera;
  else if (category === 'Monitor') Icon = Lucide.Monitor;
  else if (category === 'Printer') Icon = Lucide.Printer;
  else if (category === 'Furniture') Icon = Lucide.Armchair || Lucide.Boxes;
  else if (category === 'Audio') Icon = Lucide.Mic;

  return (
    <div className="w-9 h-9 rounded-xl bg-[#F8FAFC] border border-[#E5E7EB] flex items-center justify-center flex-shrink-0 shadow-sm transition-transform group-hover:scale-105 duration-200">
      <Icon className="w-4.5 h-4.5 text-[#6B7280]" />
    </div>
  );
};

// User initials helper
const getInitials = (name) => {
  if (!name) return '';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export default function AssetTableRow({
  asset,
  isSelected,
  onToggleSelect,
  onView,
  onEdit,
  onMore,
}) {
  const handleRowClick = (e) => {
    if (e.target.closest('button') || e.target.closest('input[type="checkbox"]')) {
      return;
    }
    onToggleSelect(asset.id);
  };

  return (
    <tr
      onClick={handleRowClick}
      className={`border-b border-[#F3F4F6] transition-colors cursor-pointer group
        ${isSelected ? 'bg-[#F5F3FF]/40' : 'hover:bg-[#F8FAFC]'}
      `}
    >
      {/* Checkbox */}
      <td className="py-4.5 pl-6 w-12 align-middle">
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onToggleSelect(asset.id)}
            className="w-4 h-4 text-[#7C3AED] border-[#D1D5DB] rounded focus:ring-[#7C3AED] focus:ring-2 cursor-pointer transition-colors"
          />
        </div>
      </td>

      {/* Asset Tag */}
      <td className="py-4.5 px-4 align-middle">
        <span className="text-xs font-black text-[#7C3AED] hover:underline">
          {asset.assetTag || asset.tag}
        </span>
      </td>

      {/* Asset Thumbnail, Name & SN */}
      <td className="py-4.5 px-4 align-middle">
        <div className="flex items-center gap-3">
          {renderThumbnail(asset.category?.name || asset.category || '')}
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-black text-[#111827] truncate">
              {asset.name}
            </span>
            <span className="text-[10px] font-bold text-[#9CA3AF] mt-0.5">
              SN: {asset.serialNumber || 'N/A'}
            </span>
          </div>
        </div>
      </td>

      {/* Category */}
      <td className="py-4.5 px-4 align-middle">
        <CategoryBadge category={asset.category?.name || asset.category || 'Uncategorized'} />
      </td>

      {/* Department */}
      <td className="py-4.5 px-4 align-middle">
        <span className="text-xs font-bold text-[#475569]">{asset.department?.name || asset.department || 'N/A'}</span>
      </td>

      {/* Location */}
      <td className="py-4.5 px-4 align-middle">
        <span className="text-xs font-bold text-[#475569]">{asset.location}</span>
      </td>

      {/* Assigned To */}
      <td className="py-4.5 px-4 align-middle">
        {asset.assignedTo || asset.currentAllocation?.allocatedToEmp?.name ? (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-[#F5F3FF] text-[#7C3AED] border border-[#EDE9FE] flex items-center justify-center text-[9px] font-black shadow-sm flex-shrink-0">
              {getInitials(asset.assignedTo || asset.currentAllocation?.allocatedToEmp?.name)}
            </div>
            <span className="text-xs font-bold text-[#475569] truncate max-w-[120px]">
              {asset.assignedTo || asset.currentAllocation?.allocatedToEmp?.name}
            </span>
          </div>
        ) : (
          <span className="text-xs text-[#9CA3AF] font-bold pl-2">—</span>
        )}
      </td>

      {/* Status */}
      <td className="py-4.5 px-4 align-middle">
        <AssetStatusBadge status={asset.status} />
      </td>

      {/* Actions */}
      <td className="py-4.5 pr-6 align-middle text-right">
        <ActionMenu
          assetId={asset.id}
          onView={onView}
          onEdit={onEdit}
          onMore={onMore}
        />
      </td>
    </tr>
  );
}
