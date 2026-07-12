import React from 'react';
import { Building2, FolderTree, Users } from 'lucide-react';

const tabsConfig = [
  { id: 'Departments', label: 'Departments', icon: Building2 },
  { id: 'Asset Categories', label: 'Asset Categories', icon: FolderTree },
  { id: 'Employees', label: 'Employees', icon: Users },
];

export default function OrganizationTabs({ activeTab, onTabChange }) {
  return (
    <div className="flex border-b border-[#E5E7EB] w-full overflow-x-auto no-scrollbar select-none gap-1 bg-[#F1F5F9]/20 p-1.5 rounded-t-2xl">
      {tabsConfig.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-2 px-5 py-2.5 text-xs font-bold transition-all duration-300 rounded-xl cursor-pointer
              ${isActive
                ? 'bg-white text-[#7C3AED] shadow-sm border border-[#E5E7EB]'
                : 'text-[#6B7280] hover:text-[#111827] hover:bg-white/50'
              }
            `}
          >
            <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-[#7C3AED]' : 'text-[#9CA3AF]'}`} />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
