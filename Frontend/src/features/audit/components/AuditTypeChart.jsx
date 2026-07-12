import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell, Tooltip } from 'recharts';

export default function AuditTypeChart({ data = [] }) {
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-sm flex flex-col gap-4 w-full select-none text-left">
      <h3 className="text-xs font-black text-[#111827] uppercase tracking-wider">
        Audit Types Breakdown
      </h3>

      {/* Horizontal Bar list */}
      <div className="flex flex-col gap-3 w-full">
        {data.map((item, idx) => {
          const max = Math.max(...data.map((d) => d.value), 1);
          const pct = Math.round((item.value / max) * 100);
          return (
            <div key={idx} className="flex flex-col gap-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#475569] truncate pr-2">{item.name}</span>
                <span className="font-black text-[#111827] flex-shrink-0">{item.value}</span>
              </div>
              <div className="h-2 w-full bg-[#F3F4F6] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#7C3AED] transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="border-t border-[#F3F4F6] w-full" />

      <button
        onClick={() => alert('Redirect to All Audit Types Breakdown')}
        className="text-[11px] font-black text-[#7C3AED] hover:text-[#6D28D9] transition-colors cursor-pointer self-center"
      >
        View All Types →
      </button>
    </div>
  );
}
