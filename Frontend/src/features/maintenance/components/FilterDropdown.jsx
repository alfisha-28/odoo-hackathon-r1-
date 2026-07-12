import { ChevronDown } from 'lucide-react';

export default function FilterDropdown({ label, value, onChange, options = [], placeholder = 'All' }) {
  return (
    <div className="flex flex-col gap-1 w-full sm:w-auto">
      {label && (
        <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider pl-0.5 select-none text-left">
          {label}
        </span>
      )}
      <div className="relative w-full sm:min-w-[150px]">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-11 bg-white border border-[#E5E7EB] rounded-xl pl-4 pr-10 text-xs font-semibold text-[#475569] focus:outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/15 appearance-none cursor-pointer transition-colors"
        >
          <option value="">{placeholder}</option>
          {options.map((opt, idx) => {
            const val = typeof opt === 'string' ? opt : opt.value;
            const lbl = typeof opt === 'string' ? opt : opt.label;
            return (
              <option key={idx} value={val}>
                {lbl}
              </option>
            );
          })}
        </select>
        <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] pointer-events-none" />
      </div>
    </div>
  );
}
