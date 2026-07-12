import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, Save, RefreshCw, Bell, Mail, Smartphone } from 'lucide-react';

export default function NotificationSettingsModal({
  isOpen,
  onClose,
  initialSettings,
  onSaveSettings,
}) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      assets: {
        newAsset: true,
        allocation: true,
        returns: true,
      },
      booking: {
        bookingConfirmed: true,
        bookingCancelled: true,
        bookingReminder: true,
      },
      maintenance: {
        newTicket: true,
        statusUpdated: true,
        maintenanceCompleted: true,
      },
      audit: {
        auditScheduled: true,
        auditCompleted: true,
        complianceAlerts: true,
      },
      reports: {
        weeklyReports: true,
        monthlyReports: true,
        analyticsSummary: false,
      },
      delivery: {
        inApp: true,
        email: true,
        sms: false,
      },
      quietHours: {
        enabled: false,
        startTime: '22:00',
        endTime: '07:00',
      },
    },
  });

  const quietHoursEnabled = watch('quietHours.enabled');

  // Sync initial configurations when loaded
  useEffect(() => {
    if (initialSettings && isOpen) {
      reset(initialSettings);
    }
  }, [initialSettings, isOpen, reset]);

  // Prevent background scroll when open
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

  if (!isOpen) return null;

  const handleFormSubmit = async (data) => {
    await onSaveSettings(data);
    alert('Success: Notification settings saved successfully! Check console logs for full details.');
    onClose();
  };

  const handleResetDefaults = () => {
    if (confirm('Are you sure you want to reset all notification preferences to defaults?')) {
      reset({
        assets: { newAsset: true, allocation: true, returns: true },
        booking: { bookingConfirmed: true, bookingCancelled: true, bookingReminder: true },
        maintenance: { newTicket: true, statusUpdated: true, maintenanceCompleted: true },
        audit: { auditScheduled: true, auditCompleted: true, complianceAlerts: true },
        reports: { weeklyReports: true, monthlyReports: true, analyticsSummary: false },
        delivery: { inApp: true, email: true, sms: false },
        quietHours: { enabled: false, startTime: '22:00', endTime: '07:00' },
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 select-none">
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-[2px] transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Box (width 720px) */}
      <div className="bg-white rounded-2xl shadow-2xl border border-[#E5E7EB] w-full max-w-[720px] max-h-[90vh] flex flex-col relative z-10 overflow-hidden transform transition-all scale-100 duration-300 animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#E5E7EB] px-6 py-4.5 bg-gray-50/50">
          <div className="flex flex-col gap-0.5 text-left">
            <h2 className="text-base font-black text-[#111827]">Notification Preferences</h2>
            <p className="text-xs font-semibold text-[#6B7280]">
              Customize which notifications you want to receive and how they are delivered.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 text-[#9CA3AF] hover:text-[#475569] rounded-xl transition-colors cursor-pointer"
            title="Close Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="flex-grow overflow-y-auto p-6 scrollbar-thin text-left">
          <form id="settings-preferences-form" onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-6">
            
            {/* Section 1: Modules Preferences Checkboxes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Asset Alerts */}
              <div className="flex flex-col gap-3 p-4.5 border border-[#E5E7EB] rounded-xl bg-gray-50/30">
                <span className="text-[10px] font-black text-[#7C3AED] uppercase tracking-wider">
                  Assets Module
                </span>
                <div className="flex flex-col gap-2.5">
                  <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-[#475569]">
                    <input
                      type="checkbox"
                      className="w-4.5 h-4.5 rounded border-gray-300 text-[#7C3AED] focus:ring-[#7C3AED]"
                      {...register('assets.newAsset')}
                    />
                    <span>New Asset Registered</span>
                  </label>
                  <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-[#475569]">
                    <input
                      type="checkbox"
                      className="w-4.5 h-4.5 rounded border-gray-300 text-[#7C3AED] focus:ring-[#7C3AED]"
                      {...register('assets.allocation')}
                    />
                    <span>Asset Allocations</span>
                  </label>
                  <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-[#475569]">
                    <input
                      type="checkbox"
                      className="w-4.5 h-4.5 rounded border-gray-300 text-[#7C3AED] focus:ring-[#7C3AED]"
                      {...register('assets.returns')}
                    />
                    <span>Returns & Overdue Alerts</span>
                  </label>
                </div>
              </div>

              {/* Booking Alerts */}
              <div className="flex flex-col gap-3 p-4.5 border border-[#E5E7EB] rounded-xl bg-gray-50/30">
                <span className="text-[10px] font-black text-[#16A34A] uppercase tracking-wider">
                  Resource Booking
                </span>
                <div className="flex flex-col gap-2.5">
                  <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-[#475569]">
                    <input
                      type="checkbox"
                      className="w-4.5 h-4.5 rounded border-gray-300 text-[#7C3AED] focus:ring-[#7C3AED]"
                      {...register('booking.bookingConfirmed')}
                    />
                    <span>Booking Confirmed</span>
                  </label>
                  <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-[#475569]">
                    <input
                      type="checkbox"
                      className="w-4.5 h-4.5 rounded border-gray-300 text-[#7C3AED] focus:ring-[#7C3AED]"
                      {...register('booking.bookingCancelled')}
                    />
                    <span>Booking Cancelled</span>
                  </label>
                  <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-[#475569]">
                    <input
                      type="checkbox"
                      className="w-4.5 h-4.5 rounded border-gray-300 text-[#7C3AED] focus:ring-[#7C3AED]"
                      {...register('booking.bookingReminder')}
                    />
                    <span>Booking Reminders</span>
                  </label>
                </div>
              </div>

              {/* Maintenance Alerts */}
              <div className="flex flex-col gap-3 p-4.5 border border-[#E5E7EB] rounded-xl bg-gray-50/30">
                <span className="text-[10px] font-black text-[#EA580C] uppercase tracking-wider">
                  Maintenance
                </span>
                <div className="flex flex-col gap-2.5">
                  <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-[#475569]">
                    <input
                      type="checkbox"
                      className="w-4.5 h-4.5 rounded border-gray-300 text-[#7C3AED] focus:ring-[#7C3AED]"
                      {...register('maintenance.newTicket')}
                    />
                    <span>New Ticket Created</span>
                  </label>
                  <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-[#475569]">
                    <input
                      type="checkbox"
                      className="w-4.5 h-4.5 rounded border-gray-300 text-[#7C3AED] focus:ring-[#7C3AED]"
                      {...register('maintenance.statusUpdated')}
                    />
                    <span>Status & Approval Updates</span>
                  </label>
                  <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-[#475569]">
                    <input
                      type="checkbox"
                      className="w-4.5 h-4.5 rounded border-gray-300 text-[#7C3AED] focus:ring-[#7C3AED]"
                      {...register('maintenance.maintenanceCompleted')}
                    />
                    <span>Maintenance Completed</span>
                  </label>
                </div>
              </div>

              {/* Audit Alerts */}
              <div className="flex flex-col gap-3 p-4.5 border border-[#E5E7EB] rounded-xl bg-gray-50/30">
                <span className="text-[10px] font-black text-[#2563EB] uppercase tracking-wider">
                  Audit & Compliance
                </span>
                <div className="flex flex-col gap-2.5">
                  <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-[#475569]">
                    <input
                      type="checkbox"
                      className="w-4.5 h-4.5 rounded border-gray-300 text-[#7C3AED] focus:ring-[#7C3AED]"
                      {...register('audit.auditScheduled')}
                    />
                    <span>Audit Scheduled</span>
                  </label>
                  <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-[#475569]">
                    <input
                      type="checkbox"
                      className="w-4.5 h-4.5 rounded border-gray-300 text-[#7C3AED] focus:ring-[#7C3AED]"
                      {...register('audit.auditCompleted')}
                    />
                    <span>Audit Completed</span>
                  </label>
                  <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-[#475569]">
                    <input
                      type="checkbox"
                      className="w-4.5 h-4.5 rounded border-gray-300 text-[#7C3AED] focus:ring-[#7C3AED]"
                      {...register('audit.complianceAlerts')}
                    />
                    <span>Compliance & Discrepancies</span>
                  </label>
                </div>
              </div>

              {/* Reports Alerts */}
              <div className="flex flex-col gap-3 p-4.5 border border-[#E5E7EB] rounded-xl bg-gray-50/30 sm:col-span-2">
                <span className="text-[10px] font-black text-[#4F46E5] uppercase tracking-wider">
                  Reports & Analytics
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-[#475569]">
                    <input
                      type="checkbox"
                      className="w-4.5 h-4.5 rounded border-gray-300 text-[#7C3AED] focus:ring-[#7C3AED]"
                      {...register('reports.weeklyReports')}
                    />
                    <span>Weekly Reports</span>
                  </label>
                  <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-[#475569]">
                    <input
                      type="checkbox"
                      className="w-4.5 h-4.5 rounded border-gray-300 text-[#7C3AED] focus:ring-[#7C3AED]"
                      {...register('reports.monthlyReports')}
                    />
                    <span>Monthly Reports</span>
                  </label>
                  <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-[#475569]">
                    <input
                      type="checkbox"
                      className="w-4.5 h-4.5 rounded border-gray-300 text-[#7C3AED] focus:ring-[#7C3AED]"
                      {...register('reports.analyticsSummary')}
                    />
                    <span>Analytics Summary</span>
                  </label>
                </div>
              </div>

            </div>

            <div className="border-t border-[#F3F4F6] w-full" />

            {/* Section 2: Delivery Channels & Quiet Hours */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Delivery Channels */}
              <div className="flex flex-col gap-4">
                <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider pl-0.5 select-none">
                  Delivery Methods
                </span>
                <div className="flex flex-col gap-3">
                  {/* In-App */}
                  <div className="flex items-center justify-between p-3 border border-[#E5E7EB] rounded-xl bg-white shadow-sm">
                    <div className="flex items-center gap-2.5">
                      <Bell className="w-4 h-4 text-[#7C3AED]" />
                      <span className="text-xs font-bold text-[#111827]">In-App notifications</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer select-none">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        {...register('delivery.inApp')}
                      />
                      <div className="w-9 h-5 bg-gray-250 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:height-4 after:w-4 after:transition-all peer-checked:bg-[#7C3AED]"></div>
                    </label>
                  </div>

                  {/* Email */}
                  <div className="flex items-center justify-between p-3 border border-[#E5E7EB] rounded-xl bg-white shadow-sm">
                    <div className="flex items-center gap-2.5">
                      <Mail className="w-4 h-4 text-[#7C3AED]" />
                      <span className="text-xs font-bold text-[#111827]">Email alerts</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer select-none">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        {...register('delivery.email')}
                      />
                      <div className="w-9 h-5 bg-gray-250 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:height-4 after:w-4 after:transition-all peer-checked:bg-[#7C3AED]"></div>
                    </label>
                  </div>

                  {/* SMS */}
                  <div className="flex items-center justify-between p-3 border border-[#E5E7EB] rounded-xl bg-white shadow-sm">
                    <div className="flex items-center gap-2.5">
                      <Smartphone className="w-4 h-4 text-[#7C3AED]" />
                      <span className="text-xs font-bold text-[#111827]">SMS warnings</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer select-none">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        {...register('delivery.sms')}
                      />
                      <div className="w-9 h-5 bg-gray-250 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:height-4 after:w-4 after:transition-all peer-checked:bg-[#7C3AED]"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Quiet Hours */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between pl-0.5">
                  <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider select-none">
                    Quiet Hours
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer select-none">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      {...register('quietHours.enabled')}
                    />
                    <div className="w-9 h-5 bg-gray-250 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:height-4 after:w-4 after:transition-all peer-checked:bg-[#7C3AED]"></div>
                  </label>
                </div>

                <div className={`p-4 border border-[#E5E7EB] rounded-xl bg-white shadow-sm flex flex-col gap-3 transition-opacity duration-300 ${quietHoursEnabled ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] font-bold text-[#9CA3AF] uppercase tracking-wider pl-0.5">
                        Start Time
                      </span>
                      <input
                        type="time"
                        className="w-full h-10 border border-[#E5E7EB] rounded-lg px-2 text-xs font-semibold text-[#475569] focus:outline-none focus:border-[#7C3AED]"
                        disabled={!quietHoursEnabled}
                        {...register('quietHours.startTime')}
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] font-bold text-[#9CA3AF] uppercase tracking-wider pl-0.5">
                        End Time
                      </span>
                      <input
                        type="time"
                        className="w-full h-10 border border-[#E5E7EB] rounded-lg px-2 text-xs font-semibold text-[#475569] focus:outline-none focus:border-[#7C3AED]"
                        disabled={!quietHoursEnabled}
                        {...register('quietHours.endTime')}
                      />
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold text-[#9CA3AF] leading-normal text-center">
                    Mute delivery channels during scheduled times.
                  </span>
                </div>
              </div>

            </div>

          </form>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-[#E5E7EB] px-6 py-4.5 bg-gray-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto h-11 px-5 border border-[#E5E7EB] hover:bg-gray-100 text-[#475569] font-bold text-xs rounded-xl transition-colors cursor-pointer text-center"
          >
            Cancel
          </button>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleResetDefaults}
              className="w-full sm:w-auto h-11 px-4.5 border border-[#7C3AED] hover:bg-[#F5F3FF] text-[#7C3AED] font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>

            <button
              type="submit"
              form="settings-preferences-form"
              disabled={isSubmitting}
              className="w-full sm:w-auto h-11 px-6 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer hover:scale-105 active:scale-95 disabled:opacity-40 disabled:hover:scale-100 shadow-md shadow-[#7C3AED]/15"
            >
              <Save className="w-4 h-4" />
              <span>Save Preferences</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
