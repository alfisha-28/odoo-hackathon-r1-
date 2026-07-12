import React from 'react';
import DataTable from './DataTable';
import StatusBadge from './StatusBadge';
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

const roleStyles = {
  ADMIN: 'bg-[#F5F3FF] text-[#7C3AED] border-[#EDE9FE]',
  ASSET_MANAGER: 'bg-[#EFF6FF] text-[#2563EB] border-[#DBEAFE]',
  DEPARTMENT_HEAD: 'bg-[#FFFBEB] text-[#D97706] border-[#FEF3C7]',
  EMPLOYEE: 'bg-[#F0FDF4] text-[#16A34A] border-[#DCFCE7]',
};

function RoleSelect({ currentRole, onChange }) {
  const normRole = (currentRole || 'EMPLOYEE').toUpperCase();
  const style = roleStyles[normRole] || roleStyles.EMPLOYEE;

  return (
    <div className="relative inline-block select-none">
      <select
        value={normRole}
        onChange={(e) => onChange && onChange(e.target.value)}
        className={`px-2.5 py-1 text-[10px] font-extrabold rounded-lg border ${style} appearance-none pr-6 cursor-pointer select-none transition-all duration-250 hover:scale-105 outline-none font-sans`}
        style={{
          backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 6px center',
          backgroundSize: '10px',
        }}
      >
        <option value="EMPLOYEE">EMPLOYEE</option>
        <option value="DEPARTMENT_HEAD">DEPARTMENT HEAD</option>
        <option value="ASSET_MANAGER">ASSET MANAGER</option>
        <option value="ADMIN">ADMIN</option>
      </select>
    </div>
  );
}

export default function EmployeeTable({ employees = [], onEdit, onDelete, onRoleChange }) {
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
        <RoleSelect
          currentRole={
            Array.isArray(emp.roles) && emp.roles.length > 0
              ? emp.roles[0]
              : emp.role || 'EMPLOYEE'
          }
          onChange={(newRole) => onRoleChange && onRoleChange(emp.id, newRole)}
        />
      </td>

      {/* Department */}
      <td className="py-3.5 px-4 align-middle text-xs font-semibold text-[#475569]">
        {typeof emp.department === 'object' ? emp.department?.name : emp.department || 'N/A'}
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
