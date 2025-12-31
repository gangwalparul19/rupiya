'use client';

import { useState, useMemo } from 'react';
import { useAppStore } from '@/lib/store';
import { useToast } from '@/lib/toastContext';
import ConfirmDialog from '@/components/ConfirmDialog';
import FormModal from '@/components/FormModal';
import SkeletonLoader from '@/components/SkeletonLoader';
import { validateTitle, validateAmount, validateDate, validateReminderDays, validateFrequency } from '@/lib/validation';

export default function CalendarPage() {
  const { calendarEvents, addCalendarEvent, removeCalendarEvent, billReminders, addBillReminder, removeBillReminder } = useAppStore();
  const { success } = useToast();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isBillModalOpen, setIsBillModalOpen] = useState(false);
  const [isPageLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [eventFormData, setEventFormData] = useState({
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    type: 'custom' as 'bill_reminder' | 'recurring_transaction' | 'goal_milestone' | 'custom',
    amount: '',
    category: '',
    reminderDays: '1',
    color: 'bg-blue-600',
  });
  const [billFormData, setBillFormData] = useState({
    name: '',
    amount: '',
    dueDate: new Date().toISOString().split('T')[0],
    frequency: 'monthly' as 'monthly' | 'quarterly' | 'yearly' | 'one-time',
    category: '',
    reminderDays: '3',
  });
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    type: 'event' as 'event' | 'bill',
    id: '',
    title: '',
  });
  const [eventErrors, setEventErrors] = useState<Record<string, string>>({});
  const [billErrors, setBillErrors] = useState<Record<string, string>>({});

  const daysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const monthEvents = useMemo(() => {
    return calendarEvents.filter((event) => {
      const eventDate = event.date instanceof Date ? event.date : new Date(event.date);
      return (
        eventDate.getMonth() === currentMonth.getMonth() &&
        eventDate.getFullYear() === currentMonth.getFullYear()
      );
    });
  }, [calendarEvents, currentMonth]);

  const monthBills = useMemo(() => {
    return billReminders.filter((bill) => {
      const billDate = bill.dueDate instanceof Date ? bill.dueDate : new Date(bill.dueDate);
      return (
        billDate.getMonth() === currentMonth.getMonth() &&
        billDate.getFullYear() === currentMonth.getFullYear()
      );
    });
  }, [billReminders, currentMonth]);

  const getEventsForDay = (day: number) => {
    return monthEvents.filter((event) => {
      const eventDate = event.date instanceof Date ? event.date : new Date(event.date);
      return eventDate.getDate() === day;
    });
  };

  const getBillsForDay = (day: number) => {
    return monthBills.filter((bill) => {
      const billDate = bill.dueDate instanceof Date ? bill.dueDate : new Date(bill.dueDate);
      return billDate.getDate() === day;
    });
  };

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate
    const titleError = validateTitle(eventFormData.title);
    const dateError = validateDate(eventFormData.date);
    const reminderError = validateReminderDays(eventFormData.reminderDays);
    
    if (titleError || dateError || reminderError) {
      setEventErrors({
        title: titleError || '',
        date: dateError || '',
        reminderDays: reminderError || '',
      });
      return;
    }

    addCalendarEvent({
      id: `event_${Date.now()}`,
      title: eventFormData.title,
      description: eventFormData.description || undefined,
      date: new Date(eventFormData.date),
      type: eventFormData.type,
      amount: eventFormData.amount ? parseFloat(eventFormData.amount) : undefined,
      category: eventFormData.category || undefined,
      reminderDays: parseInt(eventFormData.reminderDays),
      notificationEnabled: true,
      color: eventFormData.color,
      createdAt: new Date(),
    });

    success('Event added successfully');
    setEventFormData({
      title: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      type: 'custom',
      amount: '',
      category: '',
      reminderDays: '1',
      color: 'bg-blue-600',
    });
    setEventErrors({});
    setIsEventModalOpen(false);
  };

  const handleAddBill = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate
    const nameError = validateTitle(billFormData.name);
    const amountError = validateAmount(billFormData.amount);
    const dateError = validateDate(billFormData.dueDate);
    const frequencyError = validateFrequency(billFormData.frequency);
    const reminderError = validateReminderDays(billFormData.reminderDays);
    
    if (nameError || amountError || dateError || frequencyError || reminderError) {
      setBillErrors({
        name: nameError || '',
        amount: amountError || '',
        dueDate: dateError || '',
        frequency: frequencyError || '',
        reminderDays: reminderError || '',
      });
      return;
    }

    addBillReminder({
      id: `bill_${Date.now()}`,
      name: billFormData.name,
      amount: parseFloat(billFormData.amount),
      dueDate: new Date(billFormData.dueDate),
      frequency: billFormData.frequency,
      category: billFormData.category,
      isPaid: false,
      reminderDays: parseInt(billFormData.reminderDays),
      createdAt: new Date(),
    });

    success('Bill reminder added successfully');
    setBillFormData({
      name: '',
      amount: '',
      dueDate: new Date().toISOString().split('T')[0],
      frequency: 'monthly',
      category: '',
      reminderDays: '3',
    });
    setBillErrors({});
    setIsBillModalOpen(false);
  };

  const handleDeleteEventClick = (id: string, title: string) => {
    setConfirmDialog({
      isOpen: true,
      type: 'event',
      id,
      title,
    });
  };

  const handleDeleteBillClick = (id: string, name: string) => {
    setConfirmDialog({
      isOpen: true,
      type: 'bill',
      id,
      title: name,
    });
  };

  const handleConfirmDelete = () => {
    if (confirmDialog.type === 'event') {
      removeCalendarEvent(confirmDialog.id);
      success('Event deleted');
    } else {
      removeBillReminder(confirmDialog.id);
      success('Bill reminder deleted');
    }
    setConfirmDialog({ isOpen: false, type: 'event', id: '', title: '' });
  };

  const calendarDays = [];
  const totalDays = daysInMonth(currentMonth);
  const firstDay = firstDayOfMonth(currentMonth);

  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }
  for (let i = 1; i <= totalDays; i++) {
    calendarDays.push(i);
  }

  const monthName = currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="max-w-full mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        <div className="mb-6 md:mb-8">
          <h1 className="heading-page">Calendar & Reminders</h1>
          <p className="text-secondary">Track bills, events, and financial milestones</p>
        </div>

        {/* Action Buttons - Always visible */}
        <div className="flex gap-2 md:gap-3 mb-6 sticky bottom-0 md:static bg-slate-900 p-3 md:p-0 -mx-3 md:mx-0 z-40">
          <button
            onClick={() => setIsEventModalOpen(true)}
            className="flex-1 btn btn-primary"
            aria-label="Add new calendar event"
          >
            + Event
          </button>
          <button
            onClick={() => setIsBillModalOpen(true)}
            className="flex-1 btn btn-secondary"
            aria-label="Add new bill reminder"
          >
            + Bill
          </button>
          <button
            onClick={() => setViewMode(viewMode === 'calendar' ? 'list' : 'calendar')}
            className="flex-1 btn btn-secondary"
            aria-label={`Switch to ${viewMode === 'calendar' ? 'list' : 'calendar'} view`}
          >
            {viewMode === 'calendar' ? '📋' : '📅'}
          </button>
        </div>

        {/* Event Modal */}
        <FormModal
          isOpen={isEventModalOpen}
          title="Add Event"
          onClose={() => {
            setIsEventModalOpen(false);
            setEventErrors({});
          }}
          onSubmit={handleAddEvent}
          submitText="Add Event"
          isLoading={false}
        >
          <div>
            <label className="block text-xs md:text-sm font-medium text-gray-300 mb-1">Title</label>
            <input
              type="text"
              value={eventFormData.title}
              onChange={(e) => {
                setEventFormData((prev) => ({ ...prev, title: e.target.value }));
                const error = validateTitle(e.target.value);
                setEventErrors((prev) => ({ ...prev, title: error || '' }));
              }}
              placeholder="Event title"
              className={`w-full px-3 py-2 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 text-sm ${
                eventErrors.title ? 'border-red-500' : 'border-gray-600'
              }`}
              required
            />
            {eventErrors.title && <p className="text-red-400 text-xs mt-1">{eventErrors.title}</p>}
          </div>

          <div>
            <label className="block text-xs md:text-sm font-medium text-gray-300 mb-1">Date</label>
            <input
              type="date"
              value={eventFormData.date}
              onChange={(e) => {
                setEventFormData((prev) => ({ ...prev, date: e.target.value }));
                const error = validateDate(e.target.value);
                setEventErrors((prev) => ({ ...prev, date: error || '' }));
              }}
              className={`w-full px-3 py-2 bg-gray-700 border rounded-lg text-white focus:outline-none focus:border-blue-500 text-sm ${
                eventErrors.date ? 'border-red-500' : 'border-gray-600'
              }`}
              required
            />
            {eventErrors.date && <p className="text-red-400 text-xs mt-1">{eventErrors.date}</p>}
          </div>

          <div>
            <label className="block text-xs md:text-sm font-medium text-gray-300 mb-1">Type</label>
            <select
              value={eventFormData.type}
              onChange={(e) => setEventFormData((prev) => ({ ...prev, type: e.target.value as any }))}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 text-sm"
            >
              <option value="custom">Custom Event</option>
              <option value="bill_reminder">Bill Reminder</option>
              <option value="goal_milestone">Goal Milestone</option>
            </select>
          </div>

          <div>
            <label className="block text-xs md:text-sm font-medium text-gray-300 mb-1">Reminder (days)</label>
            <input
              type="number"
              value={eventFormData.reminderDays}
              onChange={(e) => {
                setEventFormData((prev) => ({ ...prev, reminderDays: e.target.value }));
                const error = validateReminderDays(e.target.value);
                setEventErrors((prev) => ({ ...prev, reminderDays: error || '' }));
              }}
              min="0"
              className={`w-full px-3 py-2 bg-gray-700 border rounded-lg text-white focus:outline-none focus:border-blue-500 text-sm ${
                eventErrors.reminderDays ? 'border-red-500' : 'border-gray-600'
              }`}
            />
            {eventErrors.reminderDays && <p className="text-red-400 text-xs mt-1">{eventErrors.reminderDays}</p>}
          </div>
        </FormModal>

        {/* Bill Modal */}
        <FormModal
          isOpen={isBillModalOpen}
          title="Add Bill Reminder"
          onClose={() => {
            setIsBillModalOpen(false);
            setBillErrors({});
          }}
          onSubmit={handleAddBill}
          submitText="Add Bill"
          isLoading={false}
        >
          <div>
            <label className="block text-xs md:text-sm font-medium text-gray-300 mb-1">Bill Name</label>
            <input
              type="text"
              value={billFormData.name}
              onChange={(e) => {
                setBillFormData((prev) => ({ ...prev, name: e.target.value }));
                const error = validateTitle(e.target.value);
                setBillErrors((prev) => ({ ...prev, name: error || '' }));
              }}
              placeholder="e.g., Electricity Bill"
              className={`w-full px-3 py-2 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 text-sm ${
                billErrors.name ? 'border-red-500' : 'border-gray-600'
              }`}
              required
            />
            {billErrors.name && <p className="text-red-400 text-xs mt-1">{billErrors.name}</p>}
          </div>

          <div>
            <label className="block text-xs md:text-sm font-medium text-gray-300 mb-1">Amount</label>
            <input
              type="number"
              value={billFormData.amount}
              onChange={(e) => {
                setBillFormData((prev) => ({ ...prev, amount: e.target.value }));
                const error = validateAmount(e.target.value);
                setBillErrors((prev) => ({ ...prev, amount: error || '' }));
              }}
              placeholder="0.00"
              step="0.01"
              className={`w-full px-3 py-2 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 text-sm ${
                billErrors.amount ? 'border-red-500' : 'border-gray-600'
              }`}
              required
            />
            {billErrors.amount && <p className="text-red-400 text-xs mt-1">{billErrors.amount}</p>}
          </div>

          <div>
            <label className="block text-xs md:text-sm font-medium text-gray-300 mb-1">Due Date</label>
            <input
              type="date"
              value={billFormData.dueDate}
              onChange={(e) => {
                setBillFormData((prev) => ({ ...prev, dueDate: e.target.value }));
                const error = validateDate(e.target.value);
                setBillErrors((prev) => ({ ...prev, dueDate: error || '' }));
              }}
              className={`w-full px-3 py-2 bg-gray-700 border rounded-lg text-white focus:outline-none focus:border-blue-500 text-sm ${
                billErrors.dueDate ? 'border-red-500' : 'border-gray-600'
              }`}
              required
            />
            {billErrors.dueDate && <p className="text-red-400 text-xs mt-1">{billErrors.dueDate}</p>}
          </div>

          <div>
            <label className="block text-xs md:text-sm font-medium text-gray-300 mb-1">Frequency</label>
            <select
              value={billFormData.frequency}
              onChange={(e) => {
                setBillFormData((prev) => ({ ...prev, frequency: e.target.value as any }));
                const error = validateFrequency(e.target.value);
                setBillErrors((prev) => ({ ...prev, frequency: error || '' }));
              }}
              className={`w-full px-3 py-2 bg-gray-700 border rounded-lg text-white focus:outline-none focus:border-blue-500 text-sm ${
                billErrors.frequency ? 'border-red-500' : 'border-gray-600'
              }`}
            >
              <option value="one-time">One-time</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
            </select>
            {billErrors.frequency && <p className="text-red-400 text-xs mt-1">{billErrors.frequency}</p>}
          </div>

          <div>
            <label className="block text-xs md:text-sm font-medium text-gray-300 mb-1">Reminder (days)</label>
            <input
              type="number"
              value={billFormData.reminderDays}
              onChange={(e) => {
                setBillFormData((prev) => ({ ...prev, reminderDays: e.target.value }));
                const error = validateReminderDays(e.target.value);
                setBillErrors((prev) => ({ ...prev, reminderDays: error || '' }));
              }}
              min="0"
              className={`w-full px-3 py-2 bg-gray-700 border rounded-lg text-white focus:outline-none focus:border-blue-500 text-sm ${
                billErrors.reminderDays ? 'border-red-500' : 'border-gray-600'
              }`}
            />
            {billErrors.reminderDays && <p className="text-red-400 text-xs mt-1">{billErrors.reminderDays}</p>}
          </div>
        </FormModal>

        {/* Calendar View */}
        {isPageLoading ? (
          <SkeletonLoader type="table" count={1} className="mb-6" />
        ) : viewMode === 'calendar' && (
          <div className="card mb-6">
            <div className="flex items-center justify-between mb-4 md:mb-6 gap-2">
              <button
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                className="btn btn-secondary"
                aria-label="Go to previous month"
              >
                ← Prev
              </button>
              <h2 className="text-lg md:text-2xl font-bold text-white text-center flex-1">{monthName}</h2>
              <button
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                className="btn btn-secondary"
                aria-label="Go to next month"
              >
                Next →
              </button>
            </div>

            {/* Calendar Grid - Mobile optimized with larger cells */}
            <div className="grid grid-cols-7 gap-1 md:gap-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="text-center font-bold text-gray-400 py-1 md:py-2 text-xs md:text-sm">
                  {day}
                </div>
              ))}

              {calendarDays.map((day, index) => (
                <div
                  key={index}
                  className={`min-h-16 md:min-h-24 p-1 md:p-2 rounded border text-xs md:text-sm ${
                    day
                      ? 'bg-gray-700 border-gray-600 hover:bg-gray-600 transition-colors'
                      : 'bg-gray-900 border-gray-800'
                  }`}
                >
                  {day && (
                    <div>
                      <p className="font-bold text-white mb-0.5 md:mb-1">{day}</p>
                      <div className="space-y-0.5">
                        {getEventsForDay(day).slice(0, 2).map((event) => (
                          <div
                            key={event.id}
                            className="bg-blue-600 text-white px-1 py-0.5 rounded truncate cursor-pointer hover:bg-blue-700 text-xs"
                            title={event.title}
                          >
                            {event.title}
                          </div>
                        ))}
                        {getBillsForDay(day).slice(0, 2).map((bill) => (
                          <div
                            key={bill.id}
                            className="bg-orange-600 text-white px-1 py-0.5 rounded truncate cursor-pointer hover:bg-orange-700 text-xs"
                            title={bill.name}
                          >
                            {bill.name}
                          </div>
                        ))}
                        {(getEventsForDay(day).length + getBillsForDay(day).length > 4) && (
                          <p className="text-gray-300 text-xs">+more</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* List View */}
        {viewMode === 'list' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6 mb-6">
            <div className="card">
              <h3 className="heading-section">Upcoming Events</h3>
              {monthEvents.length > 0 ? (
                <div className="space-y-2">
                  {monthEvents.slice(0, 8).map((event) => {
                    const eventDate = event.date instanceof Date ? event.date : new Date(event.date);
                    return (
                      <div key={event.id} className="bg-slate-700 rounded p-2 md:p-3 flex justify-between items-start gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-white text-xs md:text-sm truncate">{event.title}</p>
                          <p className="text-xs text-slate-400">{eventDate.toLocaleDateString()}</p>
                        </div>
                        <button
                          onClick={() => handleDeleteEventClick(event.id, event.title)}
                          className="text-red-400 hover:text-red-300 text-xs flex-shrink-0"
                          aria-label={`Delete event ${event.title}`}
                        >
                          ✕
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-slate-400 text-xs md:text-sm">No events this month</p>
              )}
            </div>

            <div className="card">
              <h3 className="heading-section">Upcoming Bills</h3>
              {monthBills.length > 0 ? (
                <div className="space-y-2">
                  {monthBills.slice(0, 8).map((bill) => {
                    const billDate = bill.dueDate instanceof Date ? bill.dueDate : new Date(bill.dueDate);
                    return (
                      <div key={bill.id} className="bg-slate-700 rounded p-2 md:p-3 flex justify-between items-start gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-white text-xs md:text-sm truncate">{bill.name}</p>
                          <p className="text-xs text-orange-400">₹{bill.amount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</p>
                          <p className="text-xs text-slate-400">{billDate.toLocaleDateString()}</p>
                        </div>
                        <button
                          onClick={() => handleDeleteBillClick(bill.id, bill.name)}
                          className="text-red-400 hover:text-red-300 text-xs flex-shrink-0"
                          aria-label={`Delete bill reminder ${bill.name}`}
                        >
                          ✕
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-slate-400 text-xs md:text-sm">No bills this month</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.type === 'event' ? 'Delete Event?' : 'Delete Bill Reminder?'}
        message={`Are you sure you want to delete "${confirmDialog.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        isDangerous={true}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmDialog({ isOpen: false, type: 'event', id: '', title: '' })}
      />
    </div>
  );
}
