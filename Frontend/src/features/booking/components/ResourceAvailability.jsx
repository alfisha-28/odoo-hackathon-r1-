import { Clock3, CheckCircle2 } from 'lucide-react';

export default function ResourceAvailability({ resourceName, availability }) {
  if (!availability) return null;

  const { availableToday, timeSlots = [] } = availability;

  return (
    <div className="bg-[#EEFDF3] border border-[#DCFCE7] rounded-xl p-4.5 text-left flex flex-col gap-2.5 select-none animate-in fade-in zoom-in-95 duration-200">
      <div className="flex items-center gap-2">
        <CheckCircle2 className="w-5 h-5 text-[#16A34A] flex-shrink-0" />
        <div className="flex flex-col">
          <span className="text-xs font-black text-[#111827]">{resourceName}</span>
          <span className="text-[10px] font-bold text-[#16A34A]">
            {availableToday ? 'Available Today' : 'Unavailable Today'}
          </span>
        </div>
      </div>

      {availableToday && timeSlots.length > 0 && (
        <div className="flex flex-col gap-1.5 border-t border-[#DCFCE7] pt-2.5">
          <span className="text-[9px] font-black text-[#6B7280] uppercase tracking-wider">
            Available Time Slots
          </span>
          <div className="flex flex-wrap gap-2">
            {timeSlots.map((slot, index) => (
              <div
                key={index}
                className="bg-white border border-[#DCFCE7] rounded-lg px-2.5 py-1 flex items-center gap-1.5 text-[10px] font-bold text-[#16A34A] shadow-sm"
              >
                <Clock3 className="w-3.5 h-3.5" />
                <span>
                  {slot.start} – {slot.end}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
