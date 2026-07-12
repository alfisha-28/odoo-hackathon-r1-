import React, { useState, useEffect, useMemo } from 'react';
import { reportsService } from '../services/reportsService';

// Import UI layout components
import DateRangeFilter from '../components/DateRangeFilter';
import ExportButton from '../components/ExportButton';
import ReportStats from '../components/ReportStats';
import UtilizationChart from '../components/UtilizationChart';
import AssetDistributionChart from '../components/AssetDistributionChart';
import DepartmentAllocationCard from '../components/DepartmentAllocationCard';
import MaintenanceTrendChart from '../components/MaintenanceTrendChart';
import CategoryUtilizationCard from '../components/CategoryUtilizationCard';
import InfoBanner from '../components/InfoBanner';

// Import Modals
import ScheduleReportModal from '../components/ScheduleReportModal';
import ExportReportModal from '../components/ExportReportModal';

export default function ReportsPage() {
  // Page Data States
  const [stats, setStats] = useState([]);
  const [assetUtilization, setAssetUtilization] = useState([]);
  const [assetStatus, setAssetStatus] = useState([]);
  const [departmentAllocation, setDepartmentAllocation] = useState([]);
  const [maintenanceTrend, setMaintenanceTrend] = useState([]);
  const [categoryUtilization, setCategoryUtilization] = useState([]);
  
  // Options for Modals
  const [reportTypes, setReportTypes] = useState([]);
  const [frequencies, setFrequencies] = useState([]);
  const [recipientsList, setRecipientsList] = useState([]);

  // Filter & Loading States
  const [dateRange, setDateRange] = useState({ startDate: '2025-05-12', endDate: '2025-05-18' });
  const [isLoading, setIsLoading] = useState(true);

  // Modal Open States
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  // Fetch report data on mount or whenever dateRange changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const { startDate, endDate } = dateRange;

        // Fetch all datasets in parallel
        const [
          allStats,
          allUtilization,
          allStatus,
          allDepartment,
          allMaintenance,
          allCategory,
          allTypes,
          allFreqs,
          allRecipients,
          analytics
        ] = await Promise.all([
          reportsService.getStats(startDate, endDate),
          reportsService.getAssetUtilization(startDate, endDate),
          reportsService.getAssetStatus(startDate, endDate),
          reportsService.getDepartmentAllocation(startDate, endDate),
          reportsService.getMaintenanceTrend(startDate, endDate),
          reportsService.getCategoryUtilization(startDate, endDate),
          reportsService.getReportTypes(),
          reportsService.getFrequencies(),
          reportsService.getRecipients(),
          reportsService.getAnalyticsData()
        ]);

        setStats(allStats);
        
        // Use the analytics telemetry if returned, fallback to mock
        setAssetUtilization(analytics?.assetUtilization || allUtilization);
        setAssetStatus(analytics?.assetStatus || allStatus);
        setDepartmentAllocation(analytics?.departmentAllocation || allDepartment);
        setMaintenanceTrend(analytics?.maintenanceTrend || allMaintenance);
        setCategoryUtilization(analytics?.categoryUtilization || allCategory);
        
        setReportTypes(allTypes);
        setFrequencies(allFreqs);
        setRecipientsList(allRecipients);
      } catch (error) {
        console.error('Failed to fetch reports and analytics data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [dateRange]);

  const handleDateRangeChange = (newRange) => {
    setDateRange(newRange);
  };

  // Compute total assets value dynamically from stats or status
  const totalAssetsValue = useMemo(() => {
    const assetStat = stats.find((s) => s.id === 'total-assets');
    return assetStat ? assetStat.value : '1,248';
  }, [stats]);

  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in duration-300">
      
      {/* Top Header & Filters Actions Section */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none">
        <div className="flex flex-col text-left gap-1">
          <h1 className="text-xl font-black text-[#111827]">Reports & Analytics</h1>
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#9CA3AF]">
            <span className="hover:text-[#6B7280] cursor-pointer">Dashboard</span>
            <span>&gt;</span>
            <span className="text-[#7C3AED]">Reports & Analytics</span>
          </div>
        </div>

        {/* Right side controls: Date Filter & Export Button */}
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <DateRangeFilter onChange={handleDateRangeChange} />
          <ExportButton onOpenExportModal={() => setIsExportOpen(true)} />
        </div>
      </header>

      {/* Grid of 5 Metric Cards */}
      <ReportStats stats={stats} />

      {/* Main Analytics: Two-Column Layout (Utilization Bar Chart & Distribution Donut) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
        <UtilizationChart data={assetUtilization} isLoading={isLoading} />
        <AssetDistributionChart
          data={assetStatus}
          totalAssets={totalAssetsValue}
          isLoading={isLoading}
          onViewBreakdown={() => alert('Opening Detailed Asset Status breakdown...')}
        />
      </div>

      {/* Secondary Analytics: Three-Column Layout (Department table, Maintenance trend, Top categories) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 w-full">
        <DepartmentAllocationCard
          data={departmentAllocation}
          isLoading={isLoading}
          onViewReport={() => alert('Opening Full Department Allocation Report...')}
        />
        <MaintenanceTrendChart
          data={maintenanceTrend}
          isLoading={isLoading}
          onViewReport={() => alert('Opening Full Maintenance Trend Report...')}
        />
        <CategoryUtilizationCard
          data={categoryUtilization}
          isLoading={isLoading}
          onViewAll={() => alert('Opening Category Utilization Leaderboard...')}
        />
      </div>

      {/* Bottom purple guidelines & Schedule automated report CTA banner */}
      <InfoBanner onScheduleClick={() => setIsScheduleOpen(true)} />

      {/* Modals */}
      <ScheduleReportModal
        isOpen={isScheduleOpen}
        onClose={() => setIsScheduleOpen(false)}
        reportTypes={reportTypes}
        frequencies={frequencies}
        recipientsList={recipientsList}
      />

      <ExportReportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
      />

    </div>
  );
}
