import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../../features/dashboard/components/Sidebar';
import Topbar from '../../features/dashboard/components/Topbar';
import dashboardData from '../../features/dashboard/data/data.json';

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();
  const [activePage, setActivePage] = useState('Dashboard');

  // Sync active page from current pathname
  useEffect(() => {
    const currentPath = location.pathname;
    
    // Find item or sub-item in navigation
    let foundPage = 'Dashboard';
    dashboardData.navigation.forEach((item) => {
      if (item.path === currentPath) {
        foundPage = item.name;
      }
      if (item.subItems) {
        item.subItems.forEach((sub) => {
          if (sub.path === currentPath) {
            foundPage = sub.name;
          }
        });
      }
    });
    
    setActivePage(foundPage);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-[#111827] flex transition-colors duration-300">
      {/* Sidebar navigation */}
      <Sidebar
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        isCollapsed={sidebarCollapsed}
        setIsCollapsed={setSidebarCollapsed}
        activePage={activePage}
        navItems={dashboardData.navigation}
      />

      {/* Main Container */}
      <div
        className={`flex-grow flex flex-col min-w-0 transition-all duration-300
          ${sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-66'}
        `}
      >
        {/* Top Navbar */}
        <Topbar
          onToggleMenu={() => setSidebarOpen(!sidebarOpen)}
          notificationCount={8}
        />

        {/* Dynamic Route Pages */}
        <main className="flex-grow p-6 md:p-8 flex flex-col gap-6 max-w-[1600px] w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
