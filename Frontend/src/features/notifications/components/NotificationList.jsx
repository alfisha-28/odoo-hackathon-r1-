import React, { useState } from 'react';
import { Search, Inbox } from 'lucide-react';
import NotificationCard from './NotificationCard';
import Pagination from './Pagination';
import EmptyState from './EmptyState';

export default function NotificationList({
  notifications = [],
  isLoading = false,
  onViewDetails,
  onMarkRead,
  onArchive,
  onDelete,
  searchQuery = '',
  onSearchChange,
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Filter archived notifications out of primary list
  const activeNotifications = notifications.filter((n) => !n.isArchived);

  // Apply search query
  const filteredNotifications = activeNotifications.filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  // Calculate pagination slice
  const totalItems = filteredNotifications.length;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredNotifications.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl shadow-sm overflow-hidden flex flex-col w-full text-left">
      {/* List Header & Search bar */}
      <div className="p-4.5 bg-gray-50/50 border-b border-[#E5E7EB] flex flex-col sm:flex-row items-center justify-between gap-4">
        <h3 className="text-xs font-black text-[#111827] uppercase tracking-wider select-none whitespace-nowrap">
          Notifications Listing
        </h3>

        {/* Search input field */}
        <div className="relative w-full sm:max-w-xs select-none">
          <Search className="w-4 h-4 text-[#9CA3AF] absolute top-1/2 left-3.5 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              onSearchChange(e.target.value);
              setCurrentPage(1); // Reset page on filter/search
            }}
            placeholder="Search title, description..."
            className="w-full h-10 bg-white border border-[#E5E7EB] rounded-xl pl-10 pr-4 text-xs font-semibold text-[#475569] placeholder-[#9CA3AF] focus:outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/15 transition-all"
          />
        </div>
      </div>

      {/* Loading state indicator */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 border-3 border-[#7C3AED]/20 border-t-[#7C3AED] rounded-full animate-spin" />
          <span className="text-xs font-bold text-[#6B7280]">Loading notifications...</span>
        </div>
      ) : currentItems.length === 0 ? (
        <EmptyState
          title="No notification alerts"
          description="Your inbox is empty. We couldn't find any notifications matching your filters."
          icon={Inbox}
        />
      ) : (
        <div className="flex flex-col">
          {/* Card list rows */}
          <div className="divide-y divide-[#F3F4F6]">
            {currentItems.map((notif) => (
              <NotificationCard
                key={notif.id}
                notification={notif}
                onViewDetails={onViewDetails}
                onMarkRead={onMarkRead}
                onArchive={onArchive}
                onDelete={onDelete}
              />
            ))}
          </div>

          {/* Pagination component at bottom */}
          <div className="p-4 border-t border-[#F3F4F6]">
            <Pagination
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      )}
    </div>
  );
}
