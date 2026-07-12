import { useEffect } from 'react';
import { X, Calendar, Clock, User, Info, FileText, CheckCircle2, AlertCircle, XCircle, Trash2, Edit } from 'lucide-react';
import BookingStatusBadge from './BookingStatusBadge';
import Avatar from './Avatar';

export default function BookingDetailsModal({ isOpen, onClose, booking, onCancelBooking, onEditBooking }) {
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

  if (!isOpen || !booking) return null;

  const { id, resource, employee, date, startTime, endTime, purpose, status, priority, notes, attachment } = booking;

  // Format date: e.g. "2025-05-15" -> "15 May 2025"
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  };

  // Format time: e.g. "10:00" -> "10:00 AM"
  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    const [hourStr, minStr] = timeStr.split(':');
    const hour = parseInt(hourStr, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 === 0 ? 12 : hour % 12;
    return `${displayHour}:${minStr} ${ampm}`;
  };

  // Build timeline nodes based on booking status
  const getTimelineNodes = () => {
    const nodes = [
      {
        title: 'Booking Requested',
        time: '12 May 2025, 09:30 AM',
        desc: `Submitted by ${employee.name}`,
        status: 'done',
        icon: CheckCircle2,
        color: 'text-[#16A34A] bg-[#EEFDF3]',
      },
      {
        title: 'Policy Validation',
        time: '12 May 2025, 09:32 AM',
        desc: 'Automated allocation rules verified',
        status: 'done',
        icon: CheckCircle2,
        color: 'text-[#16A34A] bg-[#EEFDF3]',
      },
    ];

    if (status === 'Approved') {
      nodes.push({
        title: 'Manager Approved',
        time: '13 May 2025, 02:00 PM',
        desc: 'Approved by John Doe (Asset Manager)',
        status: 'done',
        icon: CheckCircle2,
        color: 'text-[#16A34A] bg-[#EEFDF3]',
      });
    } else if (status === 'Pending') {
      nodes.push({
        title: 'Awaiting Approval',
        time: 'Pending review',
        desc: 'Assigned to John Doe (Operations & IT)',
        status: 'pending',
        icon: Clock,
        color: 'text-[#F97316] bg-[#FFF7ED]',
      });
    } else if (status === 'Completed') {
      nodes.push(
        {
          title: 'Manager Approved',
          time: '13 May 2025, 02:00 PM',
          desc: 'Approved by John Doe (Asset Manager)',
          status: 'done',
          icon: CheckCircle2,
          color: 'text-[#16A34A] bg-[#EEFDF3]',
        },
        {
          title: 'Booking Completed',
          time: '17 May 2025, 05:00 PM',
          desc: 'Resource released and returned in good condition',
          status: 'done',
          icon: CheckCircle2,
          color: 'text-[#3B82F6] bg-[#EFF6FF]',
        }
      );
    } else if (status === 'Cancelled') {
      nodes.push({
        title: 'Booking Cancelled',
        time: '14 May 2025, 11:10 AM',
        desc: `Cancelled by ${employee.name}`,
        status: 'error',
        icon: XCircle,
        color: 'text-gray-400 bg-gray-100',
      });
    } else if (status === 'Rejected') {
      nodes.push({
        title: 'Booking Rejected',
        time: '13 May 2025, 04:15 PM',
        desc: 'Rejected by John Doe (Reason: Duplicate schedule overlap)',
        status: 'error',
        icon: XCircle,
        color: 'text-[#EF4444] bg-[#FEF2F2]',
      });
    } else if (status === 'Overdue') {
      nodes.push(
        {
          title: 'Manager Approved',
          time: '13 May 2025, 02:00 PM',
          desc: 'Approved by John Doe (Asset Manager)',
          status: 'done',
          icon: CheckCircle2,
          color: 'text-[#16A34A] bg-[#EEFDF3]',
        },
        {
          title: 'Booking Overdue',
          time: 'Awaiting Return',
          desc: 'Expected return time exceeded. Auto-alert sent.',
          status: 'error',
          icon: AlertCircle,
          color: 'text-[#E11D48] bg-[#FFF1F2]',
        }
      );
    }

    return nodes;
  };

  const timelineNodes = getTimelineNodes();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 select-none">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-[2px] transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="bg-white rounded-2xl shadow-2xl border border-[#E5E7EB] w-full max-w-[640px] max-h-[90vh] flex flex-col relative z-10 overflow-hidden transform transition-all scale-100 duration-300 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E5E7EB] px-6 py-4.5 bg-gray-50/50">
          <div className="flex items-center gap-3 text-left">
            <span className="text-sm font-black text-[#111827]">Booking Details</span>
            <BookingStatusBadge status={status} />
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 text-[#9CA3AF] hover:text-[#475569] rounded-xl transition-colors cursor-pointer"
            title="Close Details"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable details */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 text-left">
          {/* Main Info Row (Resource & Employee) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Resource details */}
            <div className="border border-[#E5E7EB] rounded-xl p-4 flex flex-col gap-2">
              <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">
                Booked Resource
              </span>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gray-50 border border-[#E5E7EB] flex items-center justify-center text-[#6B7280] flex-shrink-0">
                  <span className="text-xs font-black text-[#7C3AED]">{resource.type[0]}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-[#111827]">{resource.name}</span>
                  <span className="text-[10px] font-semibold text-[#9CA3AF]">{resource.type}</span>
                </div>
              </div>
              <span className="text-[10px] font-semibold text-[#6B7280] mt-1 flex items-center gap-1">
                <Info className="w-3.5 h-3.5" />
                <span>Location: {resource.location || 'N/A'}</span>
              </span>
            </div>

            {/* Assignee details */}
            <div className="border border-[#E5E7EB] rounded-xl p-4 flex flex-col gap-2">
              <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">
                Booked By
              </span>
              <div className="flex items-center gap-3">
                <Avatar name={employee.name} avatarUrl={employee.avatar} size="md" />
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-[#111827]">{employee.name}</span>
                  <span className="text-[10px] font-semibold text-[#9CA3AF]">{employee.department}</span>
                </div>
              </div>
              <span className="text-[10px] font-semibold text-[#6B7280] mt-1 flex items-center gap-1">
                <User className="w-3.5 h-3.5" />
                <span>Booking ID: {id}</span>
              </span>
            </div>
          </div>

          {/* Schedule Info */}
          <div className="bg-gray-50/50 border border-[#E5E7EB] rounded-xl p-4 flex flex-col gap-3">
            <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">
              Schedule & Purpose
            </span>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#7C3AED]" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-semibold text-[#6B7280]">Date</span>
                  <span className="text-xs font-bold text-[#111827]">{formatDate(date)}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#7C3AED]" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-semibold text-[#6B7280]">Time Frame</span>
                  <span className="text-xs font-bold text-[#111827]">
                    {formatTime(startTime)} – {formatTime(endTime)}
                  </span>
                </div>
              </div>
            </div>

            <div className="border-t border-[#E5E7EB] pt-3 flex flex-col gap-1">
              <span className="text-[10px] font-semibold text-[#6B7280]">Purpose / Description</span>
              <p className="text-xs font-semibold text-[#475569] leading-relaxed">{purpose}</p>
            </div>

            {priority && (
              <div className="flex items-center gap-1.5 mt-1 select-none">
                <span className="text-[10px] font-semibold text-[#6B7280]">Priority:</span>
                <span
                  className={`text-[9px] font-black uppercase px-2 py-0.5 rounded border
                    ${priority === 'Urgent' ? 'bg-red-50 border-red-200 text-red-600' :
                      priority === 'High' ? 'bg-orange-50 border-orange-200 text-orange-600' :
                      priority === 'Medium' ? 'bg-blue-50 border-blue-200 text-blue-600' :
                      'bg-gray-50 border-gray-200 text-gray-600'}
                  `}
                >
                  {priority}
                </span>
              </div>
            )}
          </div>

          {/* Internal Notes / Attachments */}
          {(notes || attachment) && (
            <div className="flex flex-col gap-3">
              {notes && (
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">
                    Additional Notes
                  </span>
                  <div className="bg-amber-50/40 border border-[#FEF3C7] rounded-xl p-3.5 text-xs font-semibold text-[#B45309] leading-relaxed">
                    {notes}
                  </div>
                </div>
              )}

              {attachment && (
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">
                    Documentation
                  </span>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 border border-[#E5E7EB] rounded-xl w-fit">
                    <FileText className="w-5 h-5 text-[#7C3AED] flex-shrink-0" />
                    <div className="flex flex-col max-w-[240px]">
                      <span className="text-xs font-bold text-[#111827] truncate">
                        {attachment.name || 'booking_receipt.pdf'}
                      </span>
                      <span className="text-[9px] font-bold text-[#9CA3AF]">
                        {attachment.size ? `${(attachment.size / 1024 / 1024).toFixed(2)} MB` : 'PDF Document'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Approval Timeline */}
          <div className="flex flex-col gap-3">
            <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">
              Approval Progress
            </span>
            <div className="relative border-l border-gray-100 ml-4.5 flex flex-col gap-5 pt-1.5 pb-2">
              {timelineNodes.map((node, index) => {
                const NodeIcon = node.icon;
                return (
                  <div key={index} className="relative pl-7 flex flex-col items-start gap-0.5">
                    {/* Circle Node */}
                    <div className={`absolute left-0 top-0.5 w-9 h-9 -translate-x-1/2 rounded-full border border-white flex items-center justify-center flex-shrink-0 ${node.color} shadow-sm z-10`}>
                      <NodeIcon className="w-4 h-4" />
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#111827]">{node.title}</span>
                      <span className="text-[9px] font-semibold text-[#9CA3AF]">{node.time}</span>
                    </div>
                    <span className="text-[10px] font-semibold text-[#6B7280]">{node.desc}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-[#E5E7EB] p-4.5 bg-gray-50/50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="w-full sm:w-auto h-10 px-5 border border-[#E5E7EB] hover:bg-gray-100 text-[#475569] font-bold text-xs rounded-xl transition-all cursor-pointer text-center"
          >
            Close
          </button>

          <div className="flex items-center gap-3.5 w-full sm:w-auto">
            {status !== 'Cancelled' && status !== 'Completed' && status !== 'Rejected' && (
              <button
                onClick={() => onCancelBooking(id)}
                className="w-full sm:w-auto h-10 px-4.5 border border-red-200 hover:bg-red-50 text-[#EF4444] font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm shadow-red-100"
              >
                <Trash2 className="w-4 h-4" />
                <span>Cancel Booking</span>
              </button>
            )}

            <button
              onClick={() => onEditBooking(id)}
              className="w-full sm:w-auto h-10 px-5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-md shadow-[#7C3AED]/15"
            >
              <Edit className="w-4 h-4" />
              <span>Edit Booking</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
