import { useMemo } from 'react';
import { Clock } from 'lucide-react';

export default function TimeSlotPicker({ register, watch, errors }) {
  const startTime = watch('startTime');
  const endTime = watch('endTime');

  const durationText = useMemo(() => {
    if (!startTime || !endTime) return '';

    const [startH, startM] = startTime.split(':').map(Number);
    const [endH, endM] = endTime.split(':').map(Number);

    const startMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;

    if (endMinutes <= startMinutes) {
      return 'Invalid time range (End time must be after Start time)';
    }

    const diff = endMinutes - startMinutes;
    const hours = Math.floor(diff / 60);
    const mins = diff % 60;

    let text = 'Duration: ';
    if (hours > 0) {
      text += `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
    }
    if (mins > 0) {
      if (hours > 0) text += ' ';
      text += `${mins} mins`;
    }
    return text;
  }, [startTime, endTime]);

  const isInvalid = durationText.startsWith('Invalid');

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Start Time input */}
        <div className="flex flex-col gap-1.5 w-full text-left">
          <label className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider pl-0.5 select-none">
            Start Time <span className="text-[#EF4444] font-black">*</span>
          </label>
          <div className="relative">
            <input
              type="time"
              className={`w-full h-11 bg-white border rounded-xl px-4 text-xs font-semibold text-[#111827] placeholder-[#9CA3AF] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/15 focus:border-[#7C3AED] cursor-pointer
                ${errors?.startTime ? 'border-[#EF4444] focus:ring-red-100' : 'border-[#E5E7EB]'}
              `}
              {...register('startTime', { required: 'Start time is required' })}
            />
          </div>
          {errors?.startTime && (
            <span className="text-[10px] font-bold text-[#EF4444] pl-0.5 select-none">
              {errors.startTime.message}
            </span>
          )}
        </div>

        {/* End Time input */}
        <div className="flex flex-col gap-1.5 w-full text-left">
          <label className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider pl-0.5 select-none">
            End Time <span className="text-[#EF4444] font-black">*</span>
          </label>
          <div className="relative">
            <input
              type="time"
              className={`w-full h-11 bg-white border rounded-xl px-4 text-xs font-semibold text-[#111827] placeholder-[#9CA3AF] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/15 focus:border-[#7C3AED] cursor-pointer
                ${errors?.endTime ? 'border-[#EF4444] focus:ring-red-100' : 'border-[#E5E7EB]'}
              `}
              {...register('endTime', { required: 'End time is required' })}
            />
          </div>
          {errors?.endTime && (
            <span className="text-[10px] font-bold text-[#EF4444] pl-0.5 select-none">
              {errors.endTime.message}
            </span>
          )}
        </div>
      </div>

      {/* Duration Calculation Indicator */}
      {durationText && (
        <div
          className={`flex items-center gap-2 text-[10px] font-bold select-none p-3.5 rounded-xl border leading-none animate-in fade-in slide-in-from-top-1
            ${isInvalid
              ? 'bg-[#FEF2F2] border-[#FEE2E2] text-[#EF4444]'
              : 'bg-[#F5F3FF] border-[#EDE9FE] text-[#7C3AED]'
            }
          `}
        >
          <Clock className="w-4 h-4" />
          <span>{durationText}</span>
        </div>
      )}
    </div>
  );
}
