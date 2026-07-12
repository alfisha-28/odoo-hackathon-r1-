import { useState, useMemo, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { format } from 'date-fns';

import BookingStats from '../components/BookingStats';
import BookingFilters from '../components/BookingFilters';
import BookingTabs from '../components/BookingTabs';
import BookingTable from '../components/BookingTable';
import Pagination from '../components/Pagination';
import InfoBanner from '../components/InfoBanner';
import QuickBookingCard from '../components/QuickBookingCard';
import CalendarCard from '../components/CalendarCard';
import BookingModal from '../components/BookingModal';
import BookingForm from '../components/BookingForm';
import BookingDetailsModal from '../components/BookingDetailsModal';

import bookingData from '../data/data.json';

export default function ResourceBookingPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  // Modal controls
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [quickBookPrefilledType, setQuickBookPrefilledType] = useState('');

  // Filtering states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [calendarSelectedDate, setCalendarSelectedDate] = useState(null);
  const [activeTab, setActiveTab] = useState('All Bookings');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const { bookingService } = await import('../services/bookingService');
      const data = await bookingService.getBookings(); // Fetch all bookings initially
      setBookings(data || []);
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Compute dynamic stats based on current bookings state
  const computedStats = useMemo(() => {
    const upcoming = bookings.filter((b) => b.status === 'Approved').length;
    const active = bookings.filter((b) => b.status === 'Approved' && b.date === '2025-05-15').length || 12;
    const pending = bookings.filter((b) => b.status === 'Pending').length;
    const overdue = bookings.filter((b) => b.status === 'Overdue').length;

    return [
      {
        id: 'stat-upcoming',
        title: 'Upcoming Bookings',
        value: upcoming, 
        subtitle: 'Next 7 Days',
        icon: 'CalendarDays',
        color: 'indigo',
      },
      {
        id: 'stat-active',
        title: 'Active Bookings',
        value: active,
        subtitle: 'Currently ongoing',
        icon: 'CalendarCheck',
        color: 'emerald',
      },
      {
        id: 'stat-pending',
        title: 'Pending Requests',
        value: pending,
        subtitle: 'Awaiting approval',
        icon: 'Clock3',
        color: 'orange',
      },
      {
        id: 'stat-overdue',
        title: 'Overdue Bookings',
        value: overdue,
        subtitle: 'Past due date',
        icon: 'AlertCircle',
        color: 'red',
      },
    ];
  }, [bookings]);

  // Unique options for filters dropdowns loaded dynamically
  const filterOptions = useMemo(() => {
    const locations = Array.from(new Set(bookingData.resources.map((r) => r.location)));
    const statuses = ['Approved', 'Pending', 'Cancelled', 'Completed', 'Rejected', 'Overdue'];
    return {
      resourceTypes: bookingData.resourceTypes,
      locations,
      statuses,
    };
  }, []);

  // Filter logic
  const filteredBookings = useMemo(() => {
    return bookings.filter((item) => {
      // 1. Tabs filter
      if (activeTab === 'My Bookings' && item.employee?.name !== 'John Doe') return false;
      if (activeTab === 'Pending Approval' && item.status !== 'Pending') return false;
      if (activeTab === 'Approved' && item.status !== 'Approved') return false;
      if (activeTab === 'Cancelled' && item.status !== 'Cancelled') return false;
      if (activeTab === 'Completed' && item.status !== 'Completed') return false;

      // 2. Calendar day selection filter
      if (calendarSelectedDate) {
        const formattedCalDate = format(calendarSelectedDate, 'yyyy-MM-dd');
        if (item.date !== formattedCalDate) return false;
      }

      // 3. Search query (ID, Resource Name, Employee Name)
      if (searchQuery) {
        const q = searchQuery.toLowerCase().trim();
        const matchesId = item.id?.toLowerCase().includes(q);
        const matchesResource = item.resource?.name?.toLowerCase().includes(q);
        const matchesEmployee = item.employee?.name?.toLowerCase().includes(q);
        if (!matchesId && !matchesResource && !matchesEmployee) return false;
      }

      // 4. Dropdowns type, location, status
      if (selectedType && item.resource?.type !== selectedType) return false;
      if (selectedLocation && item.resource?.location !== selectedLocation) return false;
      if (selectedStatus && item.status !== selectedStatus) return false;

      // 5. Date ranges
      if (startDate) {
        const start = new Date(startDate);
        const itemDate = new Date(item.date);
        if (itemDate < start) return false;
      }
      if (endDate) {
        const end = new Date(endDate);
        const itemDate = new Date(item.date);
        if (itemDate > end) return false;
      }

      return true;
    });
  }, [
    bookings,
    activeTab,
    calendarSelectedDate,
    searchQuery,
    selectedType,
    selectedLocation,
    selectedStatus,
    startDate,
    endDate,
  ]);

  // Paginated listings
  const paginatedBookings = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return filteredBookings.slice(startIdx, startIdx + itemsPerPage);
  }, [filteredBookings, currentPage]);

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedType('');
    setSelectedLocation('');
    setSelectedStatus('');
    setStartDate('');
    setEndDate('');
    setCalendarSelectedDate(null);
    setCurrentPage(1);
  };

  // Open details modal
  const handleViewDetails = (id) => {
    const booking = bookings.find((b) => b.id === id);
    if (booking) {
      setSelectedBooking(booking);
      setIsDetailsModalOpen(true);
    }
  };

  // Action trigger from Quick Booking widget
  const handleQuickBookingClick = (type) => {
    setQuickBookPrefilledType(type);
    setIsNewModalOpen(true);
  };

  // New Booking submission
  const handleNewBookingSubmit = async (formData) => {
    try {
      const { bookingService } = await import('../services/bookingService');
      const payload = {
        assetId: formData.resourceId,
        startTime: `${formData.bookingDate}T${formData.startTime}:00`,
        endTime: `${formData.bookingDate}T${formData.endTime}:00`,
        purpose: formData.purpose,
      };

      await bookingService.createBooking(payload);
      
      setIsNewModalOpen(false);
      setQuickBookPrefilledType('');
      alert(`Resource booked successfully!`);
      fetchBookings(); // Refresh bookings grid
    } catch (err) {
      if (err.response?.status === 409) {
        alert("Error: The selected time slot overlaps with an existing booking.");
      } else {
        alert(err.response?.data?.message || "Failed to create booking.");
      }
    }
  };

  const handleSaveDraft = (draftData) => {
    console.log('Save Draft Booking Form Values:', draftData);
    setIsNewModalOpen(false);
    setQuickBookPrefilledType('');
    alert('Resource booking saved as draft successfully!');
  };

  // Cancel Booking action inside Details modal
  const handleCancelBookingAction = async (id) => {
    try {
      const { bookingService } = await import('../services/bookingService');
      await bookingService.updateBooking(id, { status: 'CANCELLED' });
      alert(`Booking ${id} has been cancelled.`);
      setIsDetailsModalOpen(false);
      setSelectedBooking(null);
      fetchBookings();
    } catch (err) {
      alert("Failed to cancel booking.");
    }
  };

  // Edit Booking action inside Details modal
  const handleEditBookingAction = (id) => {
    alert(`Edit Booking workflow triggered for ID: ${id}`);
  };

  const handleMoreAction = (id) => {
    alert(`More Actions list triggered for ID: ${id}`);
  };

  return (
    <>
      {/* Title & Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 select-none">
        <div className="flex flex-col gap-1 text-left">
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-[#111827]">
            Resource Booking
          </h1>
          <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-[#9CA3AF]">
            <span>Dashboard</span>
            <span className="text-gray-300">/</span>
            <span className="text-[#7C3AED]">Resource Booking</span>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => {
            setQuickBookPrefilledType('');
            setIsNewModalOpen(true);
          }}
          className="flex items-center justify-center gap-1.5 px-5 py-3 bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-black rounded-xl shadow-md shadow-[#7C3AED]/15 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer self-start sm:self-auto select-none"
        >
          <Plus className="w-4 h-4" />
          <span>New Booking</span>
        </button>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start w-full">
        {/* Left Column (Main content table & actions) */}
        <div className="lg:col-span-2 flex flex-col gap-6 w-full">
          {/* Stats Cards */}
          <BookingStats stats={computedStats} />

          {/* Filters Card */}
          <BookingFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedType={selectedType}
            onTypeChange={setSelectedType}
            selectedLocation={selectedLocation}
            onLocationChange={setSelectedLocation}
            selectedStatus={selectedStatus}
            onStatusChange={setSelectedStatus}
            startDate={startDate}
            onStartDateChange={setStartDate}
            endDate={endDate}
            onEndDateChange={setEndDate}
            onReset={handleResetFilters}
            resourceTypes={filterOptions.resourceTypes}
            locations={filterOptions.locations}
            statuses={filterOptions.statuses}
          />

          {/* Table list area */}
          <div className="flex flex-col gap-5">
            {/* Tabs */}
            <BookingTabs
              tabs={bookingData.tabs}
              activeTab={activeTab}
              onChange={handleTabChange}
            />

            {/* Table */}
            <BookingTable
              bookings={paginatedBookings}
              onView={handleViewDetails}
              onMore={handleMoreAction}
            />

            {/* Pagination */}
            {filteredBookings.length > 0 && (
              <Pagination
                totalItems={filteredBookings.length}
                itemsPerPage={itemsPerPage}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
              />
            )}
          </div>

          {/* Bottom Info message */}
          <InfoBanner />
        </div>

        {/* Right Column (Sidebar widgets) */}
        <div className="flex flex-col gap-6 w-full">
          {/* Quick Booking card */}
          <QuickBookingCard
            resourceTypes={filterOptions.resourceTypes}
            onQuickBook={handleQuickBookingClick}
          />

          {/* Calendar card */}
          <CalendarCard
            bookings={bookings}
            selectedDate={calendarSelectedDate}
            onDateSelect={(date) => {
              setCalendarSelectedDate(date);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      {/* Creation Modal */}
      <BookingModal isOpen={isNewModalOpen} onClose={() => setIsNewModalOpen(false)}>
        <BookingForm
          prefilledType={quickBookPrefilledType}
          onCancel={() => setIsNewModalOpen(false)}
          onSaveDraft={handleSaveDraft}
          onSubmitSuccess={handleNewBookingSubmit}
        />
      </BookingModal>

      {/* Details Modal */}
      <BookingDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedBooking(null);
        }}
        booking={selectedBooking}
        onCancelBooking={handleCancelBookingAction}
        onEditBooking={handleEditBookingAction}
      />
    </>
  );
}
