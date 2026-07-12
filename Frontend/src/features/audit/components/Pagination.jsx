import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({
  totalItems = 0,
  itemsPerPage = 5,
  currentPage = 1,
  onPageChange,
}) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getPageNumbers = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (currentPage <= 3) {
      return [1, 2, 3, '...', totalPages];
    }
    if (currentPage >= totalPages - 2) {
      return [1, '...', totalPages - 2, totalPages - 1, totalPages];
    }
    return [1, '...', currentPage, '...', totalPages];
  };

  const pages = getPageNumbers();

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-6 select-none bg-white border border-[#E5E7EB] rounded-2xl shadow-sm">
      <div className="text-xs font-bold text-[#6B7280]">
        Showing <span className="text-[#111827]">{startItem}</span> to{' '}
        <span className="text-[#111827]">{endItem}</span> of{' '}
        <span className="text-[#111827]">{totalItems}</span> results
      </div>

      {totalPages > 1 && (
        <div className="flex items-center gap-1.5">
          <button
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
            className="w-8 h-8 rounded-lg border border-[#E5E7EB] flex items-center justify-center text-[#475569] hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {pages.map((page, index) => {
            const isCurrent = page === currentPage;
            const isEllipsis = page === '...';

            if (isEllipsis) {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="w-8 h-8 flex items-center justify-center text-xs font-bold text-[#9CA3AF]"
                >
                  ...
                </span>
              );
            }

            return (
              <button
                key={`page-${page}`}
                onClick={() => onPageChange(page)}
                className={`w-8 h-8 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center justify-center
                  ${isCurrent
                    ? 'bg-[#7C3AED] text-white shadow-sm shadow-[#7C3AED]/20'
                    : 'border border-[#E5E7EB] text-[#475569] hover:bg-gray-50'
                  }
                `}
              >
                {page}
              </button>
            );
          })}

          <button
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            className="w-8 h-8 rounded-lg border border-[#E5E7EB] flex items-center justify-center text-[#475569] hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
