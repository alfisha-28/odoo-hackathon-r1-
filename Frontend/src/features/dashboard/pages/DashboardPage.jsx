import React, { useState } from 'react';
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

export default function DashboardPage() {
  const navigate = useNavigate();
  const greetingName = "John"; // Default fallback

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
        {dashboardData.stats.map((stat) => (
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
      <section>
        <AlertBanner count={3} onAction={handleOverdueAction} />
      </section>

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
          <AssetStatusChart data={dashboardData.assetStatus} />
        </div>

        {/* Monthly Allocation Bar Chart */}
        <div className="lg:col-span-1 min-h-[340px]">
          <MonthlyAllocationChart data={dashboardData.monthlyAllocation} />
        </div>

        {/* Recent Activity Timeline */}
        <div className="lg:col-span-1 min-h-[340px]">
          <RecentActivity activities={dashboardData.recentActivities} />
        </div>
      </section>

      {/* Upcoming Returns */}
      <section className="mt-2">
        <UpcomingReturns returns={dashboardData.upcomingReturns} />
      </section>
    </>
  );
}
