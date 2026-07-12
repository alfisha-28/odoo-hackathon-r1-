import React from 'react';
import { Search, Bell, Menu, ChevronDown } from 'lucide-react';
import { useAuthStore } from '../../../store/useAuthStore';

export default function Topbar({ onToggleMenu, notificationCount = 8 }) {
  const { user } = useAuthStore();

  const getInitials = (name) => {
    if (!name) return 'JD';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="sticky top-0 right-0 bg-[#F8FAFC]/90 backdrop-blur-md border-b border-[#E5E7EB] h-18 px-6 flex items-center justify-between z-30 transition-all">
      {/* Left: Mobile Menu Trigger & Search */}
      <div className="flex items-center gap-4 flex-grow max-w-lg">
        {/* Toggle Menu Button (Mobile & Tablet) */}
        <button
          onClick={onToggleMenu}
          className="lg:hidden p-2 rounded-xl border border-[#E5E7EB] hover:bg-gray-150 text-[#475569] cursor-pointer flex-shrink-0"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search Box */}
        <div className="relative w-full hidden sm:block">
          <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-[#9CA3AF]">
            <Search className="w-4.5 h-4.5" />
          </div>
          <input
            type="text"
            placeholder="Search assets, tags, IDs..."
            className="w-full h-11 bg-white border border-[#E5E7EB] rounded-xl pl-10 pr-20 text-xs font-semibold text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:border-[#7C3AED] transition-colors"
          />
          <div className="absolute inset-y-0 right-3.5 flex items-center pointer-events-none">
            <kbd className="hidden md:inline-flex items-center gap-0.5 px-2 py-0.5 border border-[#E5E7EB] bg-gray-50 rounded-lg text-[9px] font-black text-[#9CA3AF] shadow-sm select-none">
              Ctrl + K
            </kbd>
          </div>
        </div>
      </div>

      {/* Right: Actions, Notifications, Profile */}
      <div className="flex items-center gap-4.5">
        {/* Mobile Search Button (only visible on mobile, clicking does nothing for now) */}
        <button className="sm:hidden p-2.5 rounded-full hover:bg-white text-[#475569] cursor-pointer">
          <Search className="w-5 h-5" />
        </button>

        {/* Notifications Bell */}
        <div className="relative">
          <button className="p-2.5 bg-white border border-[#E5E7EB] hover:bg-gray-50 text-[#475569] rounded-xl cursor-pointer shadow-sm transition-colors select-none flex items-center justify-center">
            <Bell className="w-4.5 h-4.5" />
          </button>
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-[#DC2626] text-white text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 border-white select-none">
              {notificationCount}
            </span>
          )}
        </div>

        {/* Divider */}
        <span className="h-6 w-px bg-[#E5E7EB]" />

        {/* User Badge */}
        <div className="flex items-center gap-2 cursor-pointer group select-none">
          <div className="w-9 h-9 rounded-full bg-[#EDE9FE] text-[#7C3AED] flex items-center justify-center text-xs font-black border border-[#EDE9FE] shadow-sm">
            {getInitials(user?.name)}
          </div>
          <ChevronDown className="w-4 h-4 text-[#6B7280] group-hover:text-[#111827] transition-colors" />
        </div>
      </div>
    </header>
  );
}
