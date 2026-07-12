import React from 'react';
import DataTable from './DataTable';
import StatusBadge from './StatusBadge';
import RoleBadge from './RoleBadge';
import ActionButtons from './ActionButtons';

const headers = [
  'Employee Name',
  'Email',
  'Role',
  'Department',
  'Phone',
  'Status',
  { label: 'Actions', align: 'right', width: '90px' },
];

const getInitials = (name) => {
  if (!name) return '';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export default function EmployeeTable({ employees = [], onEdit, onDelete }) {
  const renderRow = (emp) => (
    <tr
      key={emp.id}
      className="border-b border-[#F3F4F6] transition-colors hover:bg-slate-50 select-none"
    >
      {/* Employee Name with Initials Avatar */}
      <td className="py-3.5 px-4 align-middle">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#F5F3FF] text-[#7C3AED] border border-[#EDE9FE] flex items-center justify-center text-[10px] font-black shadow-sm flex-shrink-0">
            {getInitials(emp.name)}
          </div>
          <span className="text-xs font-black text-[#111827]">{emp.name}</span>
        </div>
      </td>

      {/* Email */}
      <td className="py-3.5 px-4 align-middle text-xs font-semibold text-[#475569]">
        {emp.email}
      </td>

      {/* Role */}
      <td className="py-3.5 px-4 align-middle">
        <RoleBadge role={emp.role} />
      </td>

      {/* Department */}
      <td className="py-3.5 px-4 align-middle text-xs font-semibold text-[#475569]">
        {emp.department}
      </td>

      {/* Phone */}
      <td className="py-3.5 px-4 align-middle text-xs font-semibold text-[#475569] whitespace-nowrap">
        {emp.phone}
      </td>

      {/* Status */}
      <td className="py-3.5 px-4 align-middle">
        <StatusBadge status={emp.status} />
      </td>

      {/* Actions */}
      <td className="py-3.5 px-4 align-middle text-right">
        <ActionButtons id={emp.id} onEdit={onEdit} onDelete={onDelete} />
      </td>
    </tr>
  );

  return <DataTable headers={headers} items={employees} renderRow={renderRow} />;
}
