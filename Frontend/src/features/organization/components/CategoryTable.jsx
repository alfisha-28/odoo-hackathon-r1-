import React from 'react';
import { FolderTree } from 'lucide-react';
import DataTable from './DataTable';
import StatusBadge from './StatusBadge';
import ActionButtons from './ActionButtons';

const headers = [
  'Category Name',
  { label: 'Assets', align: 'left' },
  'Custom Fields',
  'Status',
  { label: 'Actions', align: 'right', width: '90px' },
];

export default function CategoryTable({ categories = [], onEdit, onDelete }) {
  const renderRow = (cat) => (
    <tr
      key={cat.id}
      className="border-b border-[#F3F4F6] transition-colors hover:bg-slate-50 select-none"
    >
      {/* Category Name with Icon */}
      <td className="py-3.5 px-4 align-middle">
        <div className="flex items-center gap-3">
          <div className="w-7.5 h-7.5 rounded-lg bg-[#F5F3FF] border border-[#EDE9FE] text-[#7C3AED] flex items-center justify-center flex-shrink-0">
            <FolderTree className="w-4 h-4" />
          </div>
          <span className="text-xs font-black text-[#111827]">{cat.name}</span>
        </div>
      </td>

      {/* Assets Count */}
      <td className="py-3.5 px-4 align-middle text-xs font-black text-[#475569]">
        {cat.assets || 0}
      </td>

      {/* Custom Fields */}
      <td className="py-3.5 px-4 align-middle text-[10px] text-gray-500 max-w-[200px] truncate">
        {cat.customFields ? JSON.stringify(cat.customFields) : 'None'}
      </td>

      {/* Status */}
      <td className="py-3.5 px-4 align-middle">
        <StatusBadge status={cat.status || 'ACTIVE'} />
      </td>

      {/* Actions */}
      <td className="py-3.5 px-4 align-middle text-right">
        <ActionButtons id={cat.id} onEdit={onEdit} onDelete={onDelete} />
      </td>
    </tr>
  );

  return <DataTable headers={headers} items={categories} renderRow={renderRow} />;
}
