import { Info } from 'lucide-react';

export default function InfoBanner() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-[#F5F3FF] border border-[#EDE9FE] rounded-2xl select-none w-full text-left">
      <div className="flex items-start sm:items-center gap-3">
        <Info className="w-5 h-5 text-[#7C3AED] flex-shrink-0 mt-0.5 sm:mt-0" />
        <span className="text-xs font-bold text-[#4F46E5] leading-relaxed">
          Easily book resources like rooms, equipment, and vehicles. Get real-time availability and instant confirmations.
        </span>
      </div>
      <button
        onClick={() => alert('Redirect: Learn more about booking policies')}
        className="text-xs font-black text-[#7C3AED] hover:text-[#6D28D9] flex items-center gap-1 self-start sm:self-auto cursor-pointer transition-colors whitespace-nowrap"
      >
        <span>Learn more</span>
        <span>→</span>
      </button>
    </div>
  );
}
