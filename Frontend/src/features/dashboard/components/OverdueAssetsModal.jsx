import { X, AlertTriangle, Calendar, User } from 'lucide-react';

const overdueAssets = [
  { id: 'AF-0147', name: 'Laptop Dell', assignedTo: 'Priya Shah', department: 'IT Department', dueDate: 'May 16, 2025', daysOverdue: 2 },
  { id: 'AF-0083', name: 'Office Chair', assignedTo: 'Rahul Verma', department: 'Operations', dueDate: 'May 13, 2025', daysOverdue: 5 },
  { id: 'AF-0061', name: 'Camera', assignedTo: 'Neha Kapoor', department: 'Marketing', dueDate: 'May 11, 2025', daysOverdue: 7 },
];

export default function OverdueAssetsModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#F3F4F6]">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-[#FEE2E2] rounded-lg">
              <AlertTriangle className="w-4 h-4 text-[#DC2626]" />
            </div>
            <div>
              <h2 className="text-sm font-black text-[#111827]">Overdue Assets</h2>
              <p className="text-[10px] text-[#6B7280] font-medium">{overdueAssets.length} assets past return date</p>
            </div>
          </div>
          <button onClick={onClose} className="text-[#9CA3AF] hover:text-[#111827] transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Asset List */}
        <div className="flex flex-col divide-y divide-[#F3F4F6] max-h-[360px] overflow-y-auto">
          {overdueAssets.map((asset) => (
            <div key={asset.id} className="px-6 py-4 flex items-center justify-between gap-4">
              <div className="flex flex-col gap-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-[#111827]">{asset.name}</span>
                  <span className="text-[10px] font-bold text-[#6B7280] bg-[#F3F4F6] px-2 py-0.5 rounded-full">{asset.id}</span>
                </div>
                <div className="flex items-center gap-3 text-[11px] text-[#6B7280] font-medium">
                  <span className="flex items-center gap-1"><User className="w-3 h-3" />{asset.assignedTo}</span>
                  <span className="text-[#D1D5DB]">·</span>
                  <span>{asset.department}</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-[#DC2626] font-semibold">
                  <Calendar className="w-3 h-3" />
                  Due {asset.dueDate}
                </div>
              </div>
              <span className="flex-shrink-0 text-[10px] font-black text-[#DC2626] bg-[#FEF2F2] border border-[#FEE2E2] px-2.5 py-1 rounded-full whitespace-nowrap">
                {asset.daysOverdue}d overdue
              </span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#F3F4F6] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-white bg-[#DC2626] hover:bg-[#B91C1C] rounded-xl transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
