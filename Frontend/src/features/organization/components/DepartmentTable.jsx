import React from 'react';
import { Building2 } from 'lucide-react';
import DataTable from './DataTable';
import StatusBadge from './StatusBadge';
import ActionButtons from './ActionButtons';

const headers = [
  'Department Name',
  'Department Head',
  { label: 'Assets', align: 'left' },
  { label: 'Employees', align: 'left' },
  'Status',
  { label: 'Actions', align: 'right', width: '90px' },
];

export default function DepartmentTable({ departments = [], onEdit, onDelete }) {
  const renderRow = (dept) => (
    <tr
      key={dept.id}
      className="border-b border-[#F3F4F6] transition-colors hover:bg-slate-50 select-none"
    >
      {/* Department Name with Icon */}
      <td className="py-3.5 px-4 align-middle">
        <div className="flex items-center gap-3">
          <div className="w-7.5 h-7.5 rounded-lg bg-[#F5F3FF] border border-[#EDE9FE] text-[#7C3AED] flex items-center justify-center flex-shrink-0">
            <Building2 className="w-4 h-4" />
          </div>
          <span className="text-xs font-black text-[#111827]">{dept.name}</span>
        </div>
      </td>

      {/* Head */}
      <td className="py-3.5 px-4 align-middle text-xs font-bold text-[#475569]">
        {dept.head}
      </td>

      {/* Assets Count */}
      <td className="py-3.5 px-4 align-middle text-xs font-black text-[#475569]">
        {dept.assets}
      </td>

      {/* Employees Count */}
      <td className="py-3.5 px-4 align-middle text-xs font-black text-[#475569]">
        {dept.employees}
      </td>

      {/* Status */}
      <td className="py-3.5 px-4 align-middle">
        <StatusBadge status={dept.status} />
      </td>

      {/* Actions */}
      <td className="py-3.5 px-4 align-middle text-right">
        <ActionButtons id={dept.id} onEdit={onEdit} onDelete={onDelete} />
      </td>
    </tr>
  );

  return <DataTable headers={headers} items={departments} renderRow={renderRow} />;
}
