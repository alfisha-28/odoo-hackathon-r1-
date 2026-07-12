import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { ArrowRight } from 'lucide-react';

export default function MaintenanceTrendChart({ data = [], isLoading = false, onViewReport }) {
  if (isLoading) {
    return (
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm h-[400px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-[#7C3AED]/20 border-t-[#7C3AED] rounded-full animate-spin" />
          <span className="text-xs font-bold text-[#6B7280]">Loading maintenance trend...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm select-none flex flex-col gap-4 text-left w-full h-[400px]">
      <h3 className="text-sm font-black text-[#111827]">Maintenance Trend</h3>

      {/* Recharts Container */}
      <div className="flex-grow w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 5, left: -20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#6B7280', fontSize: 10, fontWeight: 'bold' }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#6B7280', fontSize: 10, fontWeight: 'bold' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #E5E7EB',
                borderRadius: '12px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                fontSize: '11px',
                fontWeight: 'bold',
              }}
            />
            <Legend
              verticalAlign="top"
              align="right"
              height={32}
              iconType="circle"
              iconSize={8}
              wrapperStyle={{
                fontSize: '10px',
                fontWeight: 'bold',
                color: '#475569',
                paddingBottom: '10px',
              }}
            />
            <Line
              name="Tickets Created"
              type="monotone"
              dataKey="created"
              stroke="#7C3AED"
              strokeWidth={2.5}
              dot={{ fill: '#7C3AED', strokeWidth: 1, r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              name="Tickets Resolved"
              type="monotone"
              dataKey="resolved"
              stroke="#22C55E"
              strokeWidth={2.5}
              dot={{ fill: '#22C55E', strokeWidth: 1, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Footer CTA */}
      <button
        onClick={onViewReport || (() => alert('Navigating to Maintenance Report...'))}
        className="w-full h-11 bg-gray-50 border border-[#E5E7EB] hover:bg-[#F5F3FF] hover:border-[#EDE9FE] text-[#7C3AED] font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer select-none"
      >
        <span>View Maintenance Report</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}
