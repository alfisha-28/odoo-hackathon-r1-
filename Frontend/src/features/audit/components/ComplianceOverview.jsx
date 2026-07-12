import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export default function ComplianceOverview({ complianceRate = '98%', data = [] }) {
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-sm flex flex-col gap-4 w-full select-none text-left">
      <h3 className="text-xs font-black text-[#111827] uppercase tracking-wider">
        Compliance Overview
      </h3>

      {/* Donut Chart centered */}
      <div className="relative w-36 h-36 flex-shrink-0 mx-auto">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={66}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-2">
          <span className="text-2xl font-black text-[#111827] leading-none">
            {complianceRate}
          </span>
          <span className="text-[8px] font-bold text-[#9CA3AF] mt-1 uppercase tracking-wider leading-tight">
            Overall Compliance
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-col gap-2.5 w-full">
        {data.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between text-xs w-full">
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="font-semibold text-[#475569]">{item.name}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-[#111827]">{item.value}</span>
              <span className="text-[10px] font-bold text-[#9CA3AF]">({item.percentage}%)</span>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-[#F3F4F6] w-full" />

      {/* Footer Link */}
      <button
        onClick={() => alert('Redirect to Full Compliance Reports')}
        className="text-[11px] font-black text-[#7C3AED] hover:text-[#6D28D9] transition-colors cursor-pointer self-center"
      >
        View Compliance Report →
      </button>
    </div>
  );
}
