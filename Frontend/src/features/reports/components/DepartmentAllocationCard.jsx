import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function DepartmentAllocationCard({
  data = [],
  isLoading = false,
  onViewReport
}) {
  if (isLoading) {
    return (
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm h-[400px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-[#7C3AED]/20 border-t-[#7C3AED] rounded-full animate-spin" />
          <span className="text-xs font-bold text-[#6B7280]">Loading department allocations...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm select-none flex flex-col gap-4 text-left w-full h-[400px]">
      <h3 className="text-sm font-black text-[#111827]">Department-wise Allocation</h3>

      {/* Responsive Table Container */}
      <div className="flex-grow overflow-x-auto scrollbar-thin min-h-0">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#F3F4F6]">
              <th className="pb-3 text-[10px] font-black text-[#9CA3AF] uppercase tracking-wider">
                Department
              </th>
              <th className="pb-3 text-right text-[10px] font-black text-[#9CA3AF] uppercase tracking-wider">
                Allocated Assets
              </th>
              <th className="pb-3 pl-6 text-[10px] font-black text-[#9CA3AF] uppercase tracking-wider">
                Utilization
              </th>
              <th className="pb-3 text-right text-[10px] font-black text-[#9CA3AF] uppercase tracking-wider">
                Availability
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F9FAFB]">
            {data.map((row, idx) => (
              <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                {/* Department Name */}
                <td className="py-2.5 text-xs font-bold text-[#111827]">
                  {row.department}
                </td>
                
                {/* Allocated Count */}
                <td className="py-2.5 text-right text-xs font-black text-[#475569]">
                  {row.allocated}
                </td>

                {/* Utilization Progress Bar */}
                <td className="py-2.5 pl-6">
                  <div className="flex items-center gap-3 min-w-[120px]">
                    <div className="w-full bg-[#F3F4F6] h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-[#7C3AED] h-full rounded-full transition-all duration-500"
                        style={{ width: `${row.utilization}%` }}
                      />
                    </div>
                    <span className="text-xs font-black text-[#111827] min-w-[28px] text-right">
                      {row.utilization}%
                    </span>
                  </div>
                </td>

                {/* Availability Percentage & Dot */}
                <td className="py-2.5">
                  <div className="flex items-center justify-end gap-1.5 text-xs font-bold text-[#475569]">
                    <span className="w-2 h-2 rounded-full bg-[#22C55E] flex-shrink-0 animate-pulse" />
                    <span>{row.availability}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Table Footer Action Button */}
      <button
        onClick={onViewReport || (() => alert('Navigating to Department Report...'))}
        className="w-full h-11 bg-gray-50 border border-[#E5E7EB] hover:bg-[#F5F3FF] hover:border-[#EDE9FE] text-[#7C3AED] font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer select-none"
      >
        <span>View Full Department Report</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}
