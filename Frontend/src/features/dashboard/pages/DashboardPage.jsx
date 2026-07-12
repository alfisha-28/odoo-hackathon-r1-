import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StatCard from '../components/StatCard';
import QuickActionCard from '../components/QuickActionCard';
import AlertBanner from '../components/AlertBanner';
import AssetStatusChart from '../components/AssetStatusChart';
import MonthlyAllocationChart from '../components/MonthlyAllocationChart';
import RecentActivity from '../components/RecentActivity';
import UpcomingReturns from '../components/UpcomingReturns';
import OverdueAssetsModal from '../components/OverdueAssetsModal';

import dashboardData from '../data/data.json';
import { useAuthStore } from '../../../store/useAuthStore';

export default function DashboardPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const greetingName = user?.name?.split(' ')[0] || "User";

  const [stats, setStats] = useState(dashboardData.stats);
  const [assetStatus, setAssetStatus] = useState(dashboardData.assetStatus);
  const [monthlyAllocation, setMonthlyAllocation] = useState(dashboardData.monthlyAllocation);
  const [recentActivities, setRecentActivities] = useState(dashboardData.recentActivities);
  const [upcomingReturnItems, setUpcomingReturns] = useState(dashboardData.upcomingReturns);
  const [overdueCount, setOverdueCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { reportsService } = await import('../../reports/services/reportsService');
        const [kpis, analytics] = await Promise.all([
          reportsService.getDashboardKPIs(),
          reportsService.getAnalyticsData(),
        ]);
        
        // Merge fetched KPI data into stats cards with real change deltas
        if (kpis) {
          const c = kpis.changes || {};
          setStats(prev => prev.map(s => {
            if (s.title === 'Available Assets' && kpis.assetsAvailable !== undefined)
              return { ...s, value: kpis.assetsAvailable.toString(), change: Math.abs(c.availableDelta ?? s.change), isPositive: (c.availableDelta ?? 1) >= 0 };
            if (s.title === 'Allocated Assets' && kpis.assetsAllocated !== undefined)
              return { ...s, value: kpis.assetsAllocated.toString(), change: Math.abs(c.allocatedDelta ?? s.change), isPositive: (c.allocatedDelta ?? 1) >= 0 };
            if (s.title === 'Under Maintenance' && kpis.maintenanceToday !== undefined)
              return { ...s, value: kpis.maintenanceToday.toString(), change: Math.abs(c.maintenanceDelta ?? s.change), isPositive: (c.maintenanceDelta ?? -1) <= 0 };
            if (s.title === 'Active Bookings' && kpis.activeBookings !== undefined)
              return { ...s, value: kpis.activeBookings.toString(), change: Math.abs(c.bookingsDelta ?? s.change), isPositive: (c.bookingsDelta ?? 1) >= 0 };
            if (s.title === 'Pending Transfers' && kpis.pendingTransfers !== undefined)
              return { ...s, value: kpis.pendingTransfers.toString(), change: Math.abs(c.transfersDelta ?? s.change), isPositive: (c.transfersDelta ?? -1) <= 0 };
            if (s.title === 'Upcoming Returns' && kpis.upcomingReturns !== undefined)
              return { ...s, value: kpis.upcomingReturns.toString() };
            return s;
          }));

          if (kpis.overdueReturns !== undefined) {
            setOverdueCount(kpis.overdueReturns);
          }

          if (kpis.upcomingReturnsList?.length > 0) {
            setUpcomingReturns(kpis.upcomingReturnsList);
          }

          if (kpis.recentActivity) {
            const mappedActivities = kpis.recentActivity.map((act, index) => {
              let status = 'info';
              let icon = 'Package';
              if (act.type === 'ALLOCATION') {
                status = 'success';
                icon = 'User';
              } else if (act.type === 'BOOKING') {
                status = 'purple';
                icon = 'Calendar';
              } else if (act.type === 'MAINTENANCE') {
                status = 'warning';
                icon = 'Tool';
              }

              const date = new Date(act.timestamp);
              const now = new Date();
              const isToday = date.toDateString() === now.toDateString();
              const timeString = isToday
                ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : `Yesterday, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

              return {
                id: `act-${index}`,
                title: act.description,
                subtitle: act.type,
                time: timeString,
                status,
                icon
              };
            });
            setRecentActivities(mappedActivities);
          }
        }

        if (analytics) {
          if (analytics.assetStatus) setAssetStatus(analytics.assetStatus);
          if (analytics.monthlyAllocation) setMonthlyAllocation(analytics.monthlyAllocation);
        }
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      }
    };
    fetchData();
  }, []);

  const handleQuickAction = (actionTitle) => {
    if (actionTitle === 'Register Asset') {
      navigate('/assets/register');
    } else if (actionTitle === 'Book Resource') {
      navigate('/bookings');
    } else if (actionTitle === 'Raise Request') {
      navigate('/maintenance');
    }
  };

  const [showOverdueModal, setShowOverdueModal] = useState(false);

  const handleOverdueAction = () => setShowOverdueModal(true);

  return (
    <>
      {showOverdueModal && <OverdueAssetsModal onClose={() => setShowOverdueModal(false)} />}
      {/* Greeting Header */}
      <div className="flex flex-col gap-1 select-none">
        <h1 className="text-2xl md:text-3xl font-black tracking-tight text-[#111827]">
          Good morning, {greetingName}! 👋
        </h1>
        <p className="text-sm font-semibold text-[#6B7280]">
          Here's what's happening with your assets today.
        </p>
      </div>

      {/* Statistics Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((stat) => (
          <StatCard
            key={stat.id}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            isPositive={stat.isPositive}
            icon={stat.icon}
            color={stat.color}
          />
        ))}
      </section>

      {/* Alert Banner */}
      {overdueCount > 0 && (
        <section>
          <AlertBanner count={overdueCount} onAction={handleOverdueAction} />
        </section>
      )}

      {/* Quick Actions */}
      <section className="flex flex-col gap-3">
        <h3 className="text-sm font-bold text-[#111827] uppercase tracking-wider select-none">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {dashboardData.quickActions.map((action) => (
            <QuickActionCard
              key={action.id}
              title={action.title}
              subtitle={action.subtitle}
              icon={action.icon}
              color={action.color}
              onClick={() => handleQuickAction(action.title)}
            />
          ))}
        </div>
      </section>

      {/* Charts & Activities Row */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Asset Status Donut Chart */}
        <div className="lg:col-span-1 min-h-[340px]">
          <AssetStatusChart data={assetStatus} />
        </div>

        {/* Monthly Allocation Bar Chart */}
        <div className="lg:col-span-1 min-h-[340px]">
          <MonthlyAllocationChart data={monthlyAllocation} />
        </div>

        {/* Recent Activity Timeline */}
        <div className="lg:col-span-1 min-h-[340px]">
          <RecentActivity activities={recentActivities} />
        </div>
      </section>

      {/* Upcoming Returns */}
      <section className="mt-2">
        <UpcomingReturns returns={upcomingReturnItems} />
      </section>
    </>
  );
}
