import { useEffect } from 'react';
import { X, Calendar, MapPin, CheckCircle2, AlertTriangle, AlertCircle, FileText, Shield } from 'lucide-react';
import AuditStatusBadge from './AuditStatusBadge';
import Avatar from './Avatar';
import AuditChecklist from './AuditChecklist';

export default function AuditDetailsModal({
  isOpen,
  onClose,
  audit,
  onToggleChecklistItem,
  onCompleteAudit,
}) {
  // Prevent background scrolling when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !audit) return null;

  const getTimelineSteps = () => {
    const status = audit.status.toLowerCase();
    
    const steps = [
      { key: 'scheduled', label: 'Audit Scheduled', completed: true },
      { key: 'started', label: 'Audit Started', completed: status === 'in progress' || status === 'completed' },
      { key: 'checklist', label: 'Checklist Completed', completed: status === 'completed' },
      { key: 'submitted', label: 'Audit Submitted', completed: status === 'completed' },
    ];

    return steps;
  };

  const timelineSteps = getTimelineSteps();

  // Dynamic calculations for checklist findings
  const passedItems = audit.checklist?.filter((item) => item.completed).length || 0;
  const totalItems = audit.checklist?.length || 0;
  const failedItems = audit.status === 'Completed' ? totalItems - passedItems : 0;
  // If not completed, any unchecked item is pending, let's say warnings is 0 unless defined
  const warningsCount = audit.findings?.warnings || 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 select-none">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-[2px] transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="bg-white rounded-2xl shadow-2xl border border-[#E5E7EB] w-full max-w-[800px] max-h-[90vh] flex flex-col relative z-10 overflow-hidden transform transition-all scale-100 duration-300 animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E5E7EB] px-6 py-4 bg-gray-50/50">
          <div className="flex items-center gap-3">
            <span className="text-xs font-black text-[#6B7280]">{audit.id}</span>
            <AuditStatusBadge status={audit.status} />
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 text-[#9CA3AF] hover:text-[#475569] rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-grow overflow-y-auto p-6 scrollbar-thin flex flex-col gap-6 text-left">
          
          {/* Section 1: Title and Basic metadata */}
          <div className="flex flex-col gap-2">
            <h2 className="text-lg font-black text-[#111827]">{audit.name}</h2>
            <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-[#6B7280]">
              <div className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-[#7C3AED]" />
                <span>{audit.type}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#7C3AED]" />
                <span>{audit.location}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#7C3AED]" />
                <span>{audit.scheduledOn}</span>
              </div>
            </div>
          </div>

          <div className="border-t border-[#F3F4F6] w-full" />

          {/* Section 2: Auditor assigned */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-black text-[#111827] uppercase tracking-wider">
              Assigned Auditor
            </h3>
            <div className="flex items-center gap-3 p-4 border border-[#E5E7EB] rounded-2xl bg-gray-50/10">
              <Avatar name={audit.auditor?.name} avatarUrl={audit.auditor?.avatar} size="md" />
              <div className="flex flex-col">
                <span className="text-xs font-black text-[#111827]">
                  {audit.auditor?.name}
                </span>
                <span className="text-[10px] font-bold text-[#9CA3AF]">
                  {audit.auditor?.department}
                </span>
              </div>
            </div>
          </div>

          {/* Section 3: Checklist Items & Stepper Grid */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            
            {/* Checklist: 3 columns */}
            <div className="md:col-span-3 flex flex-col gap-3">
              <h3 className="text-xs font-black text-[#111827] uppercase tracking-wider flex items-center justify-between">
                <span>Checklist Tasks</span>
                <span className="text-[10px] text-[#6B7280] font-bold">
                  {passedItems} of {totalItems} completed
                </span>
              </h3>
              <AuditChecklist
                items={audit.checklist}
                onToggle={audit.status === 'Cancelled' || audit.status === 'Completed' ? null : onToggleChecklistItem}
              />
            </div>

            {/* Stepper Timeline & Findings: 2 columns */}
            <div className="md:col-span-2 flex flex-col gap-5">
              
              {/* Stepper timeline */}
              <div className="flex flex-col gap-3.5">
                <h3 className="text-xs font-black text-[#111827] uppercase tracking-wider">
                  Milestone Progress
                </h3>
                <div className="flex flex-col pl-2.5 relative border-l border-gray-100 gap-6 mt-1 ml-2">
                  {timelineSteps.map((step, idx) => (
                    <div key={idx} className="relative flex items-start gap-4">
                      {/* Timeline dot */}
                      <span
                        className={`absolute -left-[19px] top-0 w-3 h-3 rounded-full border-2 bg-white transition-all
                          ${step.completed
                            ? 'border-[#7C3AED] ring-4 ring-[#7C3AED]/10'
                            : 'border-gray-200'
                          }
                        `}
                      />
                      <div className="flex flex-col -mt-0.5 text-left">
                        <span
                          className={`text-xs font-bold
                            ${step.completed ? 'text-[#7C3AED] font-black' : 'text-[#9CA3AF]'}
                          `}
                        >
                          {step.label}
                        </span>
                        {step.completed && (
                          <span className="text-[9px] font-bold text-[#9CA3AF] mt-0.5">
                            {idx === 0
                              ? audit.timeline?.[0]?.time || 'Scheduled'
                              : idx === 1
                                ? audit.timeline?.[1]?.time || 'Started'
                                : idx === 3
                                  ? audit.timeline?.[3]?.time || 'Submitted'
                                  : 'Completed'}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Findings count indicators */}
              <div className="flex flex-col gap-3">
                <h3 className="text-xs font-black text-[#111827] uppercase tracking-wider">
                  Audit Findings
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {/* Passed */}
                  <div className="flex flex-col items-center justify-center p-3 border border-[#DCFCE7] bg-[#EEFDF3] rounded-xl text-center">
                    <CheckCircle2 className="w-5 h-5 text-[#16A34A] mb-1" />
                    <span className="text-sm font-black text-[#16A34A]">{passedItems}</span>
                    <span className="text-[9px] font-bold text-[#16A34A] uppercase tracking-wider mt-0.5">Passed</span>
                  </div>

                  {/* Failed */}
                  <div className="flex flex-col items-center justify-center p-3 border border-[#FEE2E2] bg-[#FEF2F2] rounded-xl text-center">
                    <AlertCircle className="w-5 h-5 text-[#EF4444] mb-1" />
                    <span className="text-sm font-black text-[#EF4444]">{failedItems}</span>
                    <span className="text-[9px] font-bold text-[#EF4444] uppercase tracking-wider mt-0.5">Failed</span>
                  </div>

                  {/* Warnings */}
                  <div className="flex flex-col items-center justify-center p-3 border border-[#FFEDD5] bg-[#FFF7ED] rounded-xl text-center">
                    <AlertTriangle className="w-5 h-5 text-[#F97316] mb-1" />
                    <span className="text-sm font-black text-[#F97316]">{warningsCount}</span>
                    <span className="text-[9px] font-bold text-[#F97316] uppercase tracking-wider mt-0.5">Alerts</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Section 4: Notes and Instructions */}
          {audit.notes && (
            <div className="flex flex-col gap-2">
              <h3 className="text-xs font-black text-[#111827] uppercase tracking-wider">
                Audit Notes / Scope Instructions
              </h3>
              <p className="text-xs font-semibold text-[#475569] leading-relaxed p-4 border border-[#E5E7EB] bg-gray-50/20 rounded-2xl">
                {audit.notes}
              </p>
            </div>
          )}

          {/* Section 5: Attachments preview list */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-black text-[#111827] uppercase tracking-wider">
              Attachments / Verification Documents
            </h3>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3 p-3 border border-[#E5E7EB] bg-white rounded-xl hover:border-[#7C3AED] transition-colors max-w-sm">
                <FileText className="w-5 h-5 text-[#7C3AED] flex-shrink-0" />
                <div className="flex flex-col overflow-hidden text-left">
                  <span className="text-xs font-black text-[#111827] truncate">
                    {audit.id}_scope_checklist.pdf
                  </span>
                  <span className="text-[9px] font-bold text-[#9CA3AF]">
                    PDF Document • 1.2 MB
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => alert('Download document')}
                  className="text-[10px] font-black text-[#7C3AED] hover:underline cursor-pointer ml-auto flex-shrink-0"
                >
                  Download
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="border-t border-[#E5E7EB] px-6 py-4.5 bg-gray-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto h-11 px-6 border border-[#E5E7EB] hover:bg-gray-100 text-[#475569] font-bold text-xs rounded-xl transition-colors cursor-pointer text-center"
          >
            Close
          </button>

          {(audit.status !== 'Completed' && audit.status !== 'Cancelled') && (
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => alert('Edit audit details mode (Mocked)')}
                className="w-full sm:w-auto h-11 px-5 border border-[#7C3AED] hover:bg-[#F5F3FF] text-[#7C3AED] font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                Edit Audit
              </button>

              <button
                type="button"
                onClick={() => onCompleteAudit(audit.id)}
                className="w-full sm:w-auto h-11 px-6 bg-[#22C55E] hover:bg-[#16A34A] text-white font-bold text-xs rounded-xl flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-md shadow-[#22C55E]/15"
              >
                Complete Audit
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
