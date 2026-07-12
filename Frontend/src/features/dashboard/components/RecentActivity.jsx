import React from 'react';
import * as Lucide from 'lucide-react';

export default function RecentActivity({ activities = [] }) {
  const statusColorMap = {
    success: {
      bg: 'bg-[#F0FDF4]',
      border: 'border-[#DCFCE7]',
      text: 'text-[#16A34A]',
    },
    purple: {
      bg: 'bg-[#F5F3FF]',
      border: 'border-[#EDE9FE]',
      text: 'text-[#7C3AED]',
    },
    warning: {
      bg: 'bg-[#FFFBEB]',
      border: 'border-[#FEF3C7]',
      text: 'text-[#D97706]',
    },
    info: {
      bg: 'bg-[#EFF6FF]',
      border: 'border-[#DBEAFE]',
      text: 'text-[#3B82F6]',
    },
    danger: {
      bg: 'bg-[#FEF2F2]',
      border: 'border-[#FEE2E2]',
      text: 'text-[#DC2626]',
    },
  };

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-base font-bold text-[#111827]">Recent Activities</h3>
        <button className="text-xs font-bold text-[#7C3AED] hover:underline cursor-pointer">
          View all
        </button>
      </div>

      {/* Timeline */}
      <div className="relative pl-6 flex-grow flex flex-col gap-6">
        {/* Vertical line connecting the dots */}
        <div className="absolute left-[11px] top-2 bottom-2 w-0.5 border-l border-dashed border-[#E5E7EB]" />

        {activities.map((activity, index) => {
          const IconComponent = Lucide[activity.icon] || Lucide.Circle;
          const colors = statusColorMap[activity.status] || statusColorMap.info;

          return (
            <div key={activity.id} className="relative flex gap-4 items-start">
              {/* Timeline dot / icon */}
              <div className="absolute -left-[27px] top-0.5 z-10 flex items-center justify-center">
                <div className={`w-8 h-8 rounded-full border-2 ${colors.border} ${colors.bg} ${colors.text} flex items-center justify-center shadow-sm`}>
                  <IconComponent className="w-4 h-4" />
                </div>
              </div>

              {/* Content */}
              <div className="flex-grow min-w-0">
                <h4 className="text-xs font-bold text-[#111827] truncate">
                  {activity.title}
                </h4>
                <p className="text-[11px] text-[#6B7280] mt-0.5 flex items-center gap-1.5">
                  <span>{activity.subtitle}</span>
                  <span className="text-[#E5E7EB]">•</span>
                  <span>{activity.time}</span>
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
