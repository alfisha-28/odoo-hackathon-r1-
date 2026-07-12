export default function UpcomingAudits({ upcoming = [], onView }) {
  const formatScheduledDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr + 'T00:00:00');
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-sm flex flex-col gap-4 w-full select-none text-left">
      <div className="flex items-center justify-between w-full">
        <h3 className="text-xs font-black text-[#111827] uppercase tracking-wider">
          Upcoming Audits
        </h3>
        <button
          onClick={() => alert('Redirect to Audits Calendar')}
          className="text-[10px] font-black text-[#7C3AED] hover:text-[#6D28D9] transition-colors cursor-pointer"
        >
          View Calendar →
        </button>
      </div>

      {/* Upcoming Audits Rows */}
      <div className="flex flex-col">
        {upcoming.length === 0 ? (
          <span className="text-xs font-bold text-[#6B7280] py-2">
            No upcoming audits scheduled.
          </span>
        ) : (
          upcoming.map((item, index) => (
            <div
              key={item.id}
              className={`flex items-center justify-between py-3 text-xs w-full
                ${index !== upcoming.length - 1 ? 'border-b border-[#F3F4F6]' : ''}
              `}
            >
              <div className="flex flex-col text-left gap-0.5 min-w-0">
                <button
                  onClick={() => onView && onView(item.id)}
                  className="font-black text-[#7C3AED] hover:text-[#6D28D9] hover:underline self-start cursor-pointer transition-colors"
                >
                  {item.id}
                </button>
                <span className="font-bold text-[#111827] truncate max-w-[140px]">
                  {item.name}
                </span>
              </div>
              <span className="font-bold text-[#6B7280] whitespace-nowrap">
                {formatScheduledDate(item.scheduledOn)}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
