import React from 'react';
import { Users } from 'lucide-react';

export default function Avatar({ name, role, avatar }) {
  const isTeam = role === 'Team' || name?.toLowerCase().includes('team');

  return (
    <div className="flex items-center gap-2.5">
      {isTeam ? (
        /* Team Icon circle */
        <div className="w-8 h-8 rounded-full bg-[#EFF6FF] border border-[#DBEAFE] text-[#2563EB] flex items-center justify-center flex-shrink-0 shadow-sm">
          <Users className="w-4 h-4" />
        </div>
      ) : (
        /* Person Initials circle */
        <div className="w-8 h-8 rounded-full bg-[#F5F3FF] border border-[#EDE9FE] text-[#7C3AED] flex items-center justify-center text-[10px] font-black tracking-wider flex-shrink-0 shadow-sm">
          {avatar || (name ? name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : '')}
        </div>
      )}
      <div className="flex flex-col select-none">
        <span className="text-xs font-black text-[#111827]">{name}</span>
        {role && (
          <span className="text-[10px] font-bold text-[#9CA3AF] mt-0.5">{role}</span>
        )}
      </div>
    </div>
  );
}
