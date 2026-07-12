import { useEffect } from 'react';
import { X, Calendar, Clock, User, FileText, CheckCircle2, Edit } from 'lucide-react';
import MaintenanceStatusBadge from './MaintenanceStatusBadge';
import Avatar from './Avatar';

export default function MaintenanceDetailsModal({
  isOpen,
  onClose,
  ticket,
  onResolve,
  onEditTicket,
}) {
  // Prevent background scrolling when modal is open
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

  if (!isOpen || !ticket) return null;

  const isResolvedOrClosed =
    ticket.status === 'Resolved' || ticket.status === 'Closed' || ticket.status === 'Cancelled';

  const formatLongDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  // Generate timeline milestones based on ticket state
  const getTimelineMilestones = () => {
    const milestones = [
      {
        title: 'Ticket Submitted',
        desc: `Reported by ${ticket.reportedBy?.name || 'User'}`,
        time: ticket.reportedDate ? formatLongDate(ticket.reportedDate) : '',
        status: 'completed',
      },
    ];

    if (ticket.assignedTechnician) {
      milestones.push({
        title: 'Technician Assigned',
        desc: `Assigned to ${ticket.assignedTechnician}`,
        time: ticket.reportedDate ? formatLongDate(ticket.reportedDate) : '',
        status: 'completed',
      });
    } else {
      milestones.push({
        title: 'Awaiting Assignment',
        desc: 'IT administrator reviewing assignment',
        time: '',
        status: 'pending',
      });
    }

    if (ticket.status === 'In Progress' || ticket.status === 'Resolved' || ticket.status === 'Closed') {
      milestones.push({
        title: 'Investigation In Progress',
        desc: 'Technician actively troubleshooting the issue',
        time: '',
        status: 'completed',
      });
    } else {
      milestones.push({
        title: 'Start Investigation',
        desc: 'Diagnose issue hardware/software',
        time: '',
        status: ticket.status === 'Open' ? 'active' : 'pending',
      });
    }

    if (ticket.status === 'Resolved' || ticket.status === 'Closed') {
      milestones.push({
        title: 'Issue Resolved',
        desc: 'Issue resolved. Testing verified.',
        time: ticket.dueDate ? formatLongDate(ticket.dueDate) : '',
        status: 'completed',
      });
    } else {
      milestones.push({
        title: 'Resolution Verification',
        desc: 'Waiting for resolution and verification steps',
        time: '',
        status: 'pending',
      });
    }

    return milestones;
  };

  const milestones = getTimelineMilestones();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 select-none">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-[2px] transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="bg-white rounded-2xl shadow-2xl border border-[#E5E7EB] w-full max-w-[760px] max-h-[90vh] flex flex-col relative z-10 overflow-hidden transform transition-all scale-100 duration-300 animate-in fade-in zoom-in-95">
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-[#E5E7EB] px-6 py-4.5 bg-gray-50/50">
          <div className="flex flex-col gap-1 select-none text-left">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-black text-[#111827]">
                Ticket Details - {ticket.id}
              </h2>
              <MaintenanceStatusBadge status={ticket.status} />
            </div>
            <p className="text-xs font-semibold text-[#6B7280]">
              View full logs, timeline history, and technician updates.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 text-[#9CA3AF] hover:text-[#475569] rounded-xl transition-colors cursor-pointer"
            title="Close Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scroll Content */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin flex flex-col gap-6 text-left">
          {/* Top Panel: Asset and Reporter information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Left: Asset details card */}
            <div className="border border-[#E5E7EB] rounded-2xl p-4.5 bg-gray-50/20 flex flex-col gap-3">
              <h4 className="text-[10px] font-black text-[#6B7280] uppercase tracking-wider">
                Asset Information
              </h4>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white border border-[#E5E7EB] flex items-center justify-center flex-shrink-0">
                  <FileText className="w-6 h-6 text-[#9CA3AF]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-black text-[#111827]">
                    {ticket.asset?.name || 'Unnamed Asset'}
                  </span>
                  <span className="text-[10px] font-bold text-[#6B7280]">
                    Code: {ticket.asset?.code || 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Reported By card */}
            <div className="border border-[#E5E7EB] rounded-2xl p-4.5 bg-gray-50/20 flex flex-col gap-3">
              <h4 className="text-[10px] font-black text-[#6B7280] uppercase tracking-wider">
                Reported By
              </h4>
              <div className="flex items-center gap-3">
                <Avatar name={ticket.reportedBy?.name} avatarUrl={ticket.reportedBy?.avatar} size="md" />
                <div className="flex flex-col">
                  <span className="text-xs font-black text-[#111827]">
                    {ticket.reportedBy?.name || 'N/A'}
                  </span>
                  <span className="text-[10px] font-bold text-[#6B7280]">
                    Dept: {ticket.reportedBy?.department || 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="flex flex-col gap-4">
            {/* Description */}
            <div className="flex flex-col gap-2">
              <h4 className="text-[10px] font-black text-[#6B7280] uppercase tracking-wider">
                Issue Description
              </h4>
              <p className="text-xs font-semibold text-[#475569] leading-relaxed bg-[#F8FAFC] p-4 rounded-2xl border border-[#E5E7EB]">
                {ticket.issue || 'No details specified.'}
              </p>
            </div>

            {/* General Metadata list */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50/30 border border-[#E5E7EB] p-4 rounded-2xl">
              <div className="flex flex-col gap-1">
                <span className="text-[9px] font-bold text-[#9CA3AF] uppercase tracking-wider">
                  Reported Date
                </span>
                <span className="text-xs font-black text-[#475569] flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#6B7280]" />
                  {ticket.reportedDate ? formatLongDate(ticket.reportedDate) : 'N/A'}
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[9px] font-bold text-[#9CA3AF] uppercase tracking-wider">
                  Expected Resolution
                </span>
                <span className="text-xs font-black text-[#475569] flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#6B7280]" />
                  {ticket.dueDate ? formatLongDate(ticket.dueDate) : 'N/A'}
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[9px] font-bold text-[#9CA3AF] uppercase tracking-wider">
                  Priority
                </span>
                <span className="text-xs font-black text-[#475569]">
                  {ticket.priority || 'Low'}
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[9px] font-bold text-[#9CA3AF] uppercase tracking-wider">
                  Technician
                </span>
                <span className="text-xs font-black text-[#475569] flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#6B7280]" />
                  {ticket.assignedTechnician || 'Unassigned'}
                </span>
              </div>
            </div>
          </div>

          <div className="border-t border-[#F3F4F6] w-full" />

          {/* Timeline and Updates logs */}
          <div className="flex flex-col gap-4">
            <h4 className="text-[10px] font-black text-[#6B7280] uppercase tracking-wider">
              Maintenance Timeline History
            </h4>

            {/* Vertical timeline stepper */}
            <div className="flex flex-col pl-4.5 gap-6 relative border-l-2 border-[#E5E7EB] ml-2">
              {milestones.map((ms, index) => {
                const isCompleted = ms.status === 'completed';
                const isActive = ms.status === 'active';

                return (
                  <div key={index} className="flex items-start gap-4 relative">
                    {/* Circle Node */}
                    <div
                      className={`absolute -left-[27px] w-4.5 h-4.5 rounded-full border-2 bg-white flex items-center justify-center
                        ${isCompleted
                          ? 'border-[#22C55E] text-[#22C55E]'
                          : isActive
                            ? 'border-[#7C3AED] text-[#7C3AED]'
                            : 'border-[#9CA3AF] text-[#9CA3AF]'
                        }
                      `}
                    >
                      {isCompleted && <CheckCircle2 className="w-3.5 h-3.5 fill-[#22C55E] text-white" />}
                      {isActive && <div className="w-2 h-2 rounded-full bg-[#7C3AED]" />}
                    </div>

                    {/* Node text content */}
                    <div className="flex flex-col text-left gap-0.5 min-w-0">
                      <span
                        className={`text-xs font-black
                          ${isCompleted
                            ? 'text-[#111827]'
                            : isActive
                              ? 'text-[#7C3AED]'
                              : 'text-[#6B7280]'
                          }
                        `}
                      >
                        {ms.title}
                      </span>
                      <p className="text-[10px] font-semibold text-[#6B7280]">
                        {ms.desc}
                      </p>
                      {ms.time && (
                        <span className="text-[9px] font-bold text-[#9CA3AF] mt-0.5">
                          {ms.time}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer actions */}
        <div className="border-t border-[#E5E7EB] px-6 py-4.5 bg-gray-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            onClick={onClose}
            className="w-full sm:w-auto h-10 px-5 border border-[#E5E7EB] hover:bg-gray-100 text-[#475569] font-bold text-xs rounded-xl transition-colors cursor-pointer text-center"
          >
            Close
          </button>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => onEditTicket(ticket.id)}
              className="w-full sm:w-auto h-10 px-4.5 border border-[#7C3AED] hover:bg-[#F5F3FF] text-[#7C3AED] font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Edit className="w-4 h-4" />
              <span>Edit Ticket</span>
            </button>

            <button
              onClick={() => onResolve(ticket.id)}
              disabled={isResolvedOrClosed}
              className="w-full sm:w-auto h-10 px-5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer hover:scale-105 active:scale-95 disabled:opacity-40 disabled:hover:scale-100 disabled:cursor-not-allowed shadow-md shadow-[#7C3AED]/15"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Mark Resolved</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
