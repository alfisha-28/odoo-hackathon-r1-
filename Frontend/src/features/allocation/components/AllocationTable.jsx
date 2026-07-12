import React from 'react';
import { PackageCheck } from 'lucide-react';
import AllocationRow from './AllocationRow';

export default function AllocationTable({ allocations = [], onView, onMore }) {
  if (allocations.length === 0) {
    return (
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-12 text-center flex flex-col items-center justify-center gap-4.5 select-none shadow-sm">
        <div className="w-14 h-14 rounded-2xl bg-[#F5F3FF] border border-[#EDE9FE] text-[#7C3AED] flex items-center justify-center shadow-sm">
          <PackageCheck className="w-7 h-7" />
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-black text-[#111827]">No allocations found</h3>
          <p className="text-xs font-semibold text-[#9CA3AF]">
            Try adjusting your search queries or adding a new allocation.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left border-collapse min-w-[960px]">
          <thead>
            <tr className="border-b border-[#E5E7EB] bg-slate-50/50 text-[10px] font-bold text-[#6B7280] uppercase tracking-wider select-none">
              <th className="py-4.5 px-4 font-black">Allocation ID</th>
              <th className="py-4.5 px-4 font-black">Asset</th>
              <th className="py-4.5 px-4 font-black">Allocated To</th>
              <th className="py-4.5 px-4 font-black">Department</th>
              <th className="py-4.5 px-4 font-black">Allocated On</th>
              <th className="py-4.5 px-4 font-black">Due Date</th>
              <th className="py-4.5 px-4 font-black">Status</th>
              <th className="py-4.5 px-4 font-black text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {allocations.map((alloc) => (
              <AllocationRow
                key={alloc.id}
                allocation={alloc}
                onView={onView}
                onMore={onMore}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
