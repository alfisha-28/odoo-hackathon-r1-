import MaintenanceRow from './MaintenanceRow';
import { ClipboardList } from 'lucide-react';

export default function MaintenanceTable({ tickets = [], onView, onMore, isLoading = false }) {
  if (isLoading) {
    return (
      <div className="w-full bg-white border border-[#E5E7EB] rounded-2xl p-12 flex flex-col items-center justify-center gap-4 select-none min-h-[300px] shadow-sm">
        <div className="w-10 h-10 border-2 border-t-[#7C3AED] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
        <span className="text-xs font-bold text-[#6B7280]">Loading tickets...</span>
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <div className="w-full bg-white border border-[#E5E7EB] rounded-2xl p-12 flex flex-col items-center justify-center gap-3 text-center min-h-[300px] select-none shadow-sm">
        <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center border border-[#E5E7EB]">
          <ClipboardList className="w-6 h-6 text-[#9CA3AF]" />
        </div>
        <div className="flex flex-col gap-0.5">
          <h3 className="text-sm font-black text-[#111827]">No Tickets Found</h3>
          <p className="text-xs font-semibold text-[#6B7280] max-w-[280px]">
            Try adjusting your search terms or filters to find what you are looking for.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-sm">
      <div className="w-full overflow-x-auto no-scrollbar">
        <table className="w-full min-w-[900px] border-collapse">
          <thead>
            <tr className="bg-gray-50/75 border-b border-[#E5E7EB] select-none">
              <th className="px-6 py-4.5 text-left text-[10px] font-black text-[#6B7280] uppercase tracking-wider">
                Ticket ID
              </th>
              <th className="px-6 py-4.5 text-left text-[10px] font-black text-[#6B7280] uppercase tracking-wider">
                Asset
              </th>
              <th className="px-6 py-4.5 text-left text-[10px] font-black text-[#6B7280] uppercase tracking-wider">
                Issue / Description
              </th>
              <th className="px-6 py-4.5 text-left text-[10px] font-black text-[#6B7280] uppercase tracking-wider">
                Priority
              </th>
              <th className="px-6 py-4.5 text-left text-[10px] font-black text-[#6B7280] uppercase tracking-wider">
                Reported By
              </th>
              <th className="px-6 py-4.5 text-left text-[10px] font-black text-[#6B7280] uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4.5 text-left text-[10px] font-black text-[#6B7280] uppercase tracking-wider">
                Due Date
              </th>
              <th className="px-6 py-4.5 text-left text-[10px] font-black text-[#6B7280] uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <MaintenanceRow
                key={ticket.id}
                ticket={ticket}
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
