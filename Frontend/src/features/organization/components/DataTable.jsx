import React from 'react';
import EmptyState from './EmptyState';

export default function DataTable({ headers = [], items = [], renderRow, emptyState }) {
  return (
    <div className="overflow-x-auto w-full no-scrollbar border border-[#F3F4F6] rounded-xl">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-[#E5E7EB] bg-[#F9FAFB] text-[10px] font-bold text-[#6B7280] uppercase tracking-wider h-11 select-none">
            {headers.map((header, idx) => {
              const label = typeof header === 'string' ? header : header.label;
              const align = header.align || 'left';
              const width = header.width || '';

              return (
                <th
                  key={idx}
                  style={{ width }}
                  className={`px-4 align-middle font-bold ${
                    align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left'
                  }`}
                >
                  {label}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {items.length > 0 ? (
            items.map((item, index) => renderRow(item, index))
          ) : (
            <tr>
              <td colSpan={headers.length} className="py-8">
                {emptyState || <EmptyState />}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
