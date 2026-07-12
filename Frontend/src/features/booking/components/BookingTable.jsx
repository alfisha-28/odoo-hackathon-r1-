import BookingRow from './BookingRow';
import { CalendarDays } from 'lucide-react';

export default function BookingTable({ bookings = [], onView, onMore }) {
  return (
    <div className="w-full bg-white border border-[#E5E7EB] rounded-2xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
      <div className="overflow-x-auto w-full no-scrollbar">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-gray-50/70 border-b border-[#E5E7EB] select-none">
              <th className="px-6 py-4 text-[10px] font-black text-[#6B7280] uppercase tracking-wider">
                Booking ID
              </th>
              <th className="px-6 py-4 text-[10px] font-black text-[#6B7280] uppercase tracking-wider">
                Resource
              </th>
              <th className="px-6 py-4 text-[10px] font-black text-[#6B7280] uppercase tracking-wider">
                Booked By
              </th>
              <th className="px-6 py-4 text-[10px] font-black text-[#6B7280] uppercase tracking-wider">
                Date & Time
              </th>
              <th className="px-6 py-4 text-[10px] font-black text-[#6B7280] uppercase tracking-wider">
                Purpose
              </th>
              <th className="px-6 py-4 text-[10px] font-black text-[#6B7280] uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-[10px] font-black text-[#6B7280] uppercase tracking-wider text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E7EB]">
            {bookings.length > 0 ? (
              bookings.map((booking) => (
                <BookingRow
                  key={booking.id}
                  booking={booking}
                  onView={onView}
                  onMore={onMore}
                />
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-16 text-center select-none">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#F5F3FF] border border-[#EDE9FE] flex items-center justify-center text-[#7C3AED]">
                      <CalendarDays className="w-6 h-6" />
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm font-bold text-[#111827]">No Bookings Found</span>
                      <span className="text-xs font-semibold text-[#9CA3AF]">
                        Try refining your search queries or filter categories.
                      </span>
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
