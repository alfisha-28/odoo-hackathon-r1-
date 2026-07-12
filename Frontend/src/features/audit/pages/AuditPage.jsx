import { useState, useEffect, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { auditService } from '../services/auditService';

import AuditStats from '../components/AuditStats';
import AuditFilters from '../components/AuditFilters';
import AuditTabs from '../components/AuditTabs';
import AuditTable from '../components/AuditTable';
import ComplianceOverview from '../components/ComplianceOverview';
import AuditTypeChart from '../components/AuditTypeChart';
import UpcomingAudits from '../components/UpcomingAudits';
import NewAuditModal from '../components/NewAuditModal';
import AuditDetailsModal from '../components/AuditDetailsModal';
import Pagination from '../components/Pagination';
import InfoBanner from '../components/InfoBanner';

export default function AuditPage() {
  // Page Data States
  const [audits, setAudits] = useState([]);
  const [types, setTypes] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [locations, setLocations] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [tabs, setTabs] = useState([]);

  // Loading States
  const [isLoading, setIsLoading] = useState(true);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [activeTab, setActiveTab] = useState('All Audits');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Modal States
  const [newAuditOpen, setNewAuditOpen] = useState(false);
  const [detailsAuditId, setDetailsAuditId] = useState(null);

  // Load Initial Mock Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [
          allAudits,
          allTypes,
          allStatuses,
          allLocations,
          allUpcoming,
          allTabs,
        ] = await Promise.all([
          auditService.getAudits(),
          auditService.getAuditTypes(),
          auditService.getStatuses(),
          auditService.getLocations(),
          auditService.getUpcomingAudits(),
          auditService.getTabs(),
        ]);

        setAudits(allAudits);
        setTypes(allTypes);
        setStatuses(allStatuses);
        setLocations(allLocations);
        setUpcoming(allUpcoming);
        setTabs(allTabs);
      } catch (err) {
        console.error('Failed to load audit data', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedType('');
    setSelectedStatus('');
    setSelectedLocation('');
    setStartDate('');
    setEndDate('');
    setActiveTab('All Audits');
    setCurrentPage(1);
  };

  // Find selected audit for details viewer
  const selectedAudit = useMemo(() => {
    if (!detailsAuditId) return null;
    return audits.find((aud) => aud.id === detailsAuditId) || null;
  }, [detailsAuditId, audits]);

  // Handle checking/unchecking checklist items in details modal
  const handleToggleChecklistItem = async (itemId) => {
    // Determine the result based on UI or some standard logic - toggling between Verified / Missing
    const result = window.prompt("Verify Asset - Enter result (VERIFIED, MISSING, DAMAGED):", "VERIFIED");
    if (!result) return;

    try {
      await auditService.verifyAsset(detailsAuditId, { assetId: itemId, result: result.toUpperCase(), notes: 'Verified via dashboard' });
      
      // Update local state to reflect UI change
      setAudits((prevAudits) =>
        prevAudits.map((aud) => {
          if (aud.id !== detailsAuditId) return aud;
          
          const updatedChecklist = aud.checklist.map((item) => {
            if (item.id !== itemId) return item;
            return { ...item, completed: result.toUpperCase() === 'VERIFIED' };
          });

          // Recompute findings count
          const passed = updatedChecklist.filter((item) => item.completed).length;
          const failed = updatedChecklist.length - passed;

          return {
            ...aud,
            checklist: updatedChecklist,
            findings: {
              ...aud.findings,
              passed,
              failed: aud.status === 'Completed' ? failed : 0,
            },
          };
        })
      );
    } catch (err) {
      alert("Failed to verify asset.");
    }
  };

  // Handle completing an audit from details modal
  const handleCompleteAudit = async (auditId) => {
    try {
      await auditService.closeAuditCycle(auditId);
      
      setAudits((prevAudits) =>
        prevAudits.map((aud) => {
          if (aud.id !== auditId) return aud;
          
          const totalItems = aud.checklist?.length || 0;
          const passed = aud.checklist?.filter((item) => item.completed).length || 0;
          const failed = totalItems - passed;

          return {
            ...aud,
            status: 'Completed',
            findings: {
              passed,
              failed,
              warnings: aud.findings?.warnings || 0,
            },
          };
        })
      );
      alert(`Audit ${auditId} has been successfully closed.`);
    } catch (err) {
      alert("Failed to close audit.");
    }
  };

  // Handle creating a new audit scheduler submission
  const handleNewAuditSubmit = async (newAuditData) => {
    try {
      const createdCycle = await auditService.startAuditCycle({
        name: newAuditData.name,
        scopeDepartmentId: newAuditData.department || 'ALL',
        scopeLocation: newAuditData.location || 'ALL',
        startDate: newAuditData.scheduledOn,
        endDate: newAuditData.deadline,
        auditorIds: ['USR-001'] // Simulated
      });

      const newAudit = {
        id: createdCycle?.id || `AU-2025-00${audits.length + 30}`,
        status: 'Scheduled',
        findings: { passed: 0, failed: 0, warnings: 0 },
        timeline: [{ title: 'Audit Scheduled', time: '15 May 2025' }],
        ...newAuditData,
      };

      setAudits((prev) => [newAudit, ...prev]);
      setNewAuditOpen(false);
      alert(`Successfully scheduled new audit: ${newAudit.name} (${newAudit.id})`);
    } catch (err) {
      alert("Failed to schedule audit.");
    }
  };

  // Handle saving as draft
  const handleSaveDraft = (draftData) => {
    const nextIdNumber = audits.length > 0 
      ? Math.max(...audits.map((a) => parseInt(a.id.split('-')[2]))) + 1 
      : 29;
    
    const formattedId = `AU-2025-00${nextIdNumber}`;
    const draftAudit = {
      id: formattedId,
      status: 'Scheduled',
      findings: { passed: 0, failed: 0, warnings: 0 },
      timeline: [{ title: 'Audit Draft Saved', time: '15 May 2025' }],
      ...draftData,
    };

    setAudits((prev) => [draftAudit, ...prev]);
    setNewAuditOpen(false);
    console.log('Successfully saved audit draft:', draftAudit);
    alert(`Audit Draft saved successfully: ${draftAudit.name}`);
  };

  // Filter Logic
  const filteredAudits = useMemo(() => {
    return audits.filter((aud) => {
      // 1. Tab filter
      if (activeTab !== 'All Audits') {
        if (aud.status.toLowerCase() !== activeTab.toLowerCase()) {
          return false;
        }
      }

      // 2. Search query filter (matches ID, name, location, or auditor name)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesId = aud.id?.toLowerCase().includes(query);
        const matchesName = aud.name?.toLowerCase().includes(query);
        const matchesLocation = aud.location?.toLowerCase().includes(query);
        const matchesAuditor = aud.auditor?.name?.toLowerCase().includes(query);
        if (!matchesId && !matchesName && !matchesLocation && !matchesAuditor) {
          return false;
        }
      }

      // 3. Dropdowns
      if (selectedType && aud.type !== selectedType) return false;
      if (selectedStatus && aud.status !== selectedStatus) return false;
      if (selectedLocation && aud.location !== selectedLocation) return false;

      // 4. Date Range
      if (startDate) {
        const auditTime = new Date(aud.scheduledOn + 'T00:00:00').getTime();
        const startTime = new Date(startDate + 'T00:00:00').getTime();
        if (auditTime < startTime) return false;
      }
      if (endDate) {
        const auditTime = new Date(aud.scheduledOn + 'T00:00:00').getTime();
        const endTime = new Date(endDate + 'T00:00:00').getTime();
        if (auditTime > endTime) return false;
      }

      return true;
    });
  }, [audits, searchQuery, selectedType, selectedStatus, selectedLocation, startDate, endDate, activeTab]);

  // Paginated listings
  const paginatedAudits = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAudits.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAudits, currentPage]);

  // Recalculate stats dynamically based on full audits database
  const dynamicStats = useMemo(() => {
    const total = audits.length;
    const completed = audits.filter((a) => a.status === 'Completed').length;
    const progress = audits.filter((a) => a.status === 'In Progress').length;
    const overdue = audits.filter((a) => a.status === 'Overdue').length;

    // Compliance Rate: completed audits that have no failures
    const completedAudits = audits.filter((a) => a.status === 'Completed');
    const compliantCount = completedAudits.filter(
      (a) => (a.findings?.failed || 0) === 0
    ).length;

    const rate = completedAudits.length > 0 
      ? Math.round((compliantCount / completedAudits.length) * 100) 
      : 98; // Fallback default

    return [
      {
        id: 'stat-total',
        title: 'Total Audits',
        value: total.toString(),
        subtitle: 'All time',
        icon: 'ClipboardCheck',
        color: 'indigo',
      },
      {
        id: 'stat-completed',
        title: 'Completed',
        value: completed.toString(),
        subtitle: 'This month',
        icon: 'BadgeCheck',
        color: 'green',
      },
      {
        id: 'stat-progress',
        title: 'In Progress',
        value: progress.toString(),
        subtitle: 'Currently running',
        icon: 'Clock',
        color: 'blue',
      },
      {
        id: 'stat-overdue',
        title: 'Overdue',
        value: overdue.toString(),
        subtitle: 'Past due date',
        icon: 'AlertCircle',
        color: 'red',
      },
      {
        id: 'stat-compliance',
        title: 'Compliance Rate',
        value: `${rate}%`,
        subtitle: 'This month',
        icon: 'ShieldCheck',
        color: 'green',
      },
    ];
  }, [audits]);

  // Recalculate Compliance Overview details dynamically
  const dynamicComplianceData = useMemo(() => {
    const completedAudits = audits.filter((a) => a.status === 'Completed');
    const compliant = completedAudits.filter((a) => (a.findings?.failed || 0) === 0).length;
    const nonCompliant = completedAudits.length - compliant;

    // Set base mock values if no completed audits exist yet
    const compliantValue = completedAudits.length > 0 ? compliant : 96;
    const nonCompliantValue = completedAudits.length > 0 ? nonCompliant : 2;
    const total = compliantValue + nonCompliantValue;

    const compliantPercent = total > 0 ? Math.round((compliantValue / total) * 100) : 98;
    const nonCompliantPercent = 100 - compliantPercent;

    return [
      { name: 'Compliant', value: compliantValue, percentage: compliantPercent, color: '#22C55E' },
      { name: 'Non-Compliant', value: nonCompliantValue, percentage: nonCompliantPercent, color: '#EF4444' },
    ];
  }, [audits]);

  // Recalculate types breakdown dynamically
  const dynamicBreakdownData = useMemo(() => {
    const counts = {
      'IT Assets': 0,
      Equipment: 0,
      Furniture: 0,
      Electrical: 0,
      Others: 0,
    };

    audits.forEach((aud) => {
      if (counts[aud.type] !== undefined) {
        counts[aud.type] += 1;
      } else {
        counts['Others'] += 1;
      }
    });

    return [
      { name: 'IT Assets', value: counts['IT Assets'] },
      { name: 'Equipment', value: counts['Equipment'] },
      { name: 'Furniture', value: counts['Furniture'] },
      { name: 'Electrical', value: counts['Electrical'] },
      { name: 'Others', value: counts['Others'] },
    ];
  }, [audits]);

  const dynamicComplianceRateText = useMemo(() => {
    const statItem = dynamicStats.find((s) => s.id === 'stat-compliance');
    return statItem ? statItem.value : '98%';
  }, [dynamicStats]);

  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in duration-300">
      {/* Top Breadcrumb & Header Action */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none">
        <div className="flex flex-col text-left gap-1">
          <h1 className="text-xl font-black text-[#111827]">Audit</h1>
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#9CA3AF]">
            <span className="hover:text-[#6B7280] cursor-pointer">Dashboard</span>
            <span>&gt;</span>
            <span className="text-[#7C3AED]">Audit</span>
          </div>
        </div>

        <button
          onClick={() => setNewAuditOpen(true)}
          className="h-11 px-5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-md shadow-[#7C3AED]/20 self-start sm:self-auto"
        >
          <Plus className="w-4.5 h-4.5" />
          <span>New Audit</span>
        </button>
      </header>

      {/* Grid of stats */}
      <AuditStats stats={dynamicStats} />

      {/* Main Panel Content & Sidebar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* Table & Filters: 3/4 Width */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          <AuditFilters
            searchQuery={searchQuery}
            onSearchChange={(val) => {
              setSearchQuery(val);
              setCurrentPage(1);
            }}
            selectedType={selectedType}
            onTypeChange={(val) => {
              setSelectedType(val);
              setCurrentPage(1);
            }}
            selectedStatus={selectedStatus}
            onStatusChange={(val) => {
              setSelectedStatus(val);
              setCurrentPage(1);
            }}
            selectedLocation={selectedLocation}
            onLocationChange={(val) => {
              setSelectedLocation(val);
              setCurrentPage(1);
            }}
            startDate={startDate}
            onStartDateChange={(val) => {
              setStartDate(val);
              setCurrentPage(1);
            }}
            endDate={endDate}
            onEndDateChange={(val) => {
              setEndDate(val);
              setCurrentPage(1);
            }}
            onReset={handleResetFilters}
            types={types}
            statuses={statuses}
            locations={locations}
          />

          {/* Underlined tabs */}
          <AuditTabs
            tabs={tabs}
            activeTab={activeTab}
            onChange={(tab) => {
              setActiveTab(tab);
              setCurrentPage(1);
            }}
          />

          {/* Main Table view */}
          <AuditTable
            audits={paginatedAudits}
            isLoading={isLoading}
            onView={(id) => setDetailsAuditId(id)}
            onMore={(id) => alert(`Actions Menu for Audit: ${id}`)}
          />

          {/* Table pagination */}
          {!isLoading && filteredAudits.length > 0 && (
            <Pagination
              totalItems={filteredAudits.length}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          )}

          {/* Guidelines Footer Banner */}
          <InfoBanner />
        </div>

        {/* Analytics Widgets: 1/4 Width */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <ComplianceOverview
            complianceRate={dynamicComplianceRateText}
            data={dynamicComplianceData}
          />

          <AuditTypeChart data={dynamicBreakdownData} />

          <UpcomingAudits
            upcoming={upcoming}
            onView={(id) => setDetailsAuditId(id)}
          />
        </div>

      </div>

      {/* Scheduler Modal */}
      <NewAuditModal
        isOpen={newAuditOpen}
        onClose={() => setNewAuditOpen(false)}
        onSubmitSuccess={handleNewAuditSubmit}
        onSaveDraft={handleSaveDraft}
      />

      {/* Audit details viewer */}
      <AuditDetailsModal
        isOpen={!!detailsAuditId}
        onClose={() => setDetailsAuditId(null)}
        audit={selectedAudit}
        onToggleChecklistItem={handleToggleChecklistItem}
        onCompleteAudit={handleCompleteAudit}
      />
    </div>
  );
}
