import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from 'recharts';

export default function AuditTypeChart({ data = [] }) {
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-sm flex flex-col gap-4 w-full select-none text-left">
      <h3 className="text-xs font-black text-[#111827] uppercase tracking-wider">
        Audit Types Breakdown
      </h3>

      {/* Bar Chart Area */}
      <div className="w-full h-44 py-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6B7280', fontSize: 10, fontWeight: '700' }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6B7280', fontSize: 10, fontWeight: '700' }}
              domain={[0, 30]}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={16}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill="#7C3AED" />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="border-t border-[#F3F4F6] w-full" />

      {/* Footer Link */}
      <button
        onClick={() => alert('Redirect to All Audit Types Breakdown')}
        className="text-[11px] font-black text-[#7C3AED] hover:text-[#6D28D9] transition-colors cursor-pointer self-center"
      >
        View All Types →
      </button>
    </div>
  );
}
