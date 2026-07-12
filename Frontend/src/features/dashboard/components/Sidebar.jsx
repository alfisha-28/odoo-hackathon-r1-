import React from 'react';
import * as Lucide from 'lucide-react';
import { useAuthStore } from '../../../store/useAuthStore';

export default function Sidebar({
  isOpen,
  setIsOpen,
  isCollapsed,
  setIsCollapsed,
  activePage = 'Dashboard',
  navItems = [],
}) {
  const { user, logout } = useAuthStore();

  const handleNavItemClick = (item) => {
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
  };

  // Helper to render Lucide icons dynamically
  const renderIcon = (iconName, className) => {
    const Icon = Lucide[iconName] || Lucide.HelpCircle;
    return <Icon className={className} />;
  };

  // Get User Initials
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
    <>
      {/* Mobile Drawer Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden transition-all duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 bg-white border-r border-[#E5E7EB] z-50 flex flex-col justify-between transition-all duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${isCollapsed ? 'w-20' : 'w-66'}
        `}
      >
        {/* Collapse Button (Floating on Border) */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute top-6 -right-3.5 bg-white border border-[#E5E7EB] hover:bg-gray-50 text-[#475569] w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer shadow-sm z-50 transition-colors select-none"
        >
          {isCollapsed ? (
            <Lucide.ChevronRight className="w-4 h-4" />
          ) : (
            <Lucide.ChevronLeft className="w-4 h-4" />
          )}
        </button>

        {/* Top: Logo */}
        <div className={`p-6 flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
          <div className="text-[#7C3AED] flex-shrink-0">
            {/* Custom SVG AssetFlow Logo */}
            <svg viewBox="0 0 100 100" fill="none" className="w-8 h-8 stroke-current stroke-[8]">
              <path d="M50 5L90 28.1V74.4L50 97.5L10 74.4V28.1L50 5Z" strokeLinejoin="round" />
              <path d="M50 25L71.6 37.5V62.5L50 75L28.4 62.5V37.5L50 25Z" fill="currentColor" fillOpacity="0.2" strokeWidth="4" />
              <circle cx="50" cy="50" r="10" fill="currentColor" />
            </svg>
          </div>
          {!isCollapsed && (
            <span className="text-xl font-extrabold text-[#111827] tracking-tight">
              AssetFlow
            </span>
          )}
        </div>

        {/* Middle: Navigation Links */}
        <nav className="flex-grow px-3 mt-4 overflow-y-auto no-scrollbar flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = activePage === item.name;
            return (
              <button
                key={item.name}
                onClick={() => handleNavItemClick(item)}
                className={`w-full flex items-center rounded-xl p-3 text-sm font-semibold tracking-wide transition-all duration-200 cursor-pointer group select-none relative
                  ${isActive
                    ? 'bg-[#F5F3FF] text-[#7C3AED]'
                    : 'text-[#475569] hover:bg-[#F8FAFC] hover:text-[#111827]'
                  }
                  ${isCollapsed ? 'justify-center' : 'justify-between'}
                `}
              >
                {/* Active Indicator Line */}
                {isActive && !isCollapsed && (
                  <span className="absolute left-0 top-3 bottom-3 w-1 bg-[#7C3AED] rounded-r-full" />
                )}

                <div className="flex items-center gap-3">
                  {renderIcon(
                    item.icon,
                    `w-5 h-5 flex-shrink-0 transition-colors ${
                      isActive ? 'text-[#7C3AED]' : 'text-[#6B7280] group-hover:text-[#111827]'
                    }`
                  )}
                  {!isCollapsed && <span>{item.name}</span>}
                </div>

                {/* Submenu indicators & counts */}
                {!isCollapsed && (
                  <div className="flex items-center gap-1.5">
                    {item.count > 0 && (
                      <span className="bg-[#EDE9FE] text-[#7C3AED] text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">
                        {item.count}
                      </span>
                    )}
                    {item.hasChevron && (
                      <Lucide.ChevronRight className="w-3.5 h-3.5 text-[#9CA3AF] group-hover:text-[#475569]" />
                    )}
                  </div>
                )}

                {/* Tooltip on Collapsed Hover */}
                {isCollapsed && (
                  <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-[#111827] text-white text-xs font-bold rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none whitespace-nowrap z-50 shadow-md">
                    {item.name}
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="p-3 border-t border-[#F3F4F6] flex flex-col gap-3">
          {/* Help & Support */}
          <button
            className={`w-full flex items-center gap-3 rounded-xl p-3 text-sm font-semibold text-[#475569] hover:bg-[#F8FAFC] hover:text-[#111827] cursor-pointer group select-none relative ${
              isCollapsed ? 'justify-center' : ''
            }`}
          >
            <Lucide.HelpCircle className="w-5 h-5 text-[#6B7280] group-hover:text-[#111827] flex-shrink-0" />
            {!isCollapsed && <span>Help & Support</span>}
            {isCollapsed && (
              <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-[#111827] text-white text-xs font-bold rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none whitespace-nowrap z-50 shadow-md">
                Help & Support
              </div>
            )}
          </button>

          {/* User Card */}
          <div
            className={`flex items-center gap-3 p-2 bg-[#F8FAFC] border border-[#E5E7EB] rounded-2xl relative group/user ${
              isCollapsed ? 'justify-center cursor-pointer' : 'justify-between'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              {/* Avatar circle / JD */}
              <div className="w-9 h-9 rounded-full bg-[#EDE9FE] text-[#7C3AED] flex items-center justify-center text-xs font-black border border-[#EDE9FE] flex-shrink-0 shadow-sm">
                {getInitials(user?.name)}
              </div>
              {!isCollapsed && (
                <div className="min-w-0">
                  <h5 className="text-xs font-bold text-[#111827] truncate">
                    {user?.name || 'John Doe'}
                  </h5>
                  <p className="text-[10px] text-[#6B7280] font-medium truncate mt-0.5">
                    {user?.role || 'Asset Manager'}
                  </p>
                </div>
              )}
            </div>

            {!isCollapsed && (
              <button
                onClick={logout}
                title="Logout Session"
                className="p-1 hover:bg-white border border-transparent hover:border-[#E5E7EB] hover:text-red-650 rounded-lg text-[#6B7280] cursor-pointer transition-all duration-200"
              >
                <Lucide.LogOut className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Collapsed logout popover on hover */}
            {isCollapsed && (
              <div className="absolute left-full ml-3 bg-white border border-[#E5E7EB] rounded-xl shadow-xl p-2.5 opacity-0 invisible group-hover/user:opacity-100 group-hover/user:visible transition-all duration-200 z-50 min-w-[140px]">
                <h5 className="text-xs font-bold text-[#111827]">John Doe</h5>
                <p className="text-[9px] text-[#6B7280] mt-0.5">Asset Manager</p>
                <button
                  onClick={logout}
                  className="w-full text-left text-[10px] text-red-600 font-bold mt-2 pt-2 border-t border-[#F3F4F6] flex items-center gap-1.5 hover:text-red-750 cursor-pointer"
                >
                  <Lucide.LogOut className="w-3.5 h-3.5" />
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Footer branding */}
          {!isCollapsed && (
            <div className="text-[10px] text-[#9CA3AF] font-bold text-center mt-1 select-none">
              <p>AssetFlow v1.0</p>
              <p className="font-medium mt-0.5">© 2026 AssetFlow. All rights reserved.</p>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
