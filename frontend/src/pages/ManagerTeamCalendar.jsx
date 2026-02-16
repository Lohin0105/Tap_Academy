import React, { useEffect, useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import attendanceService from '../services/attendanceService';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import toast from 'react-hot-toast';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { FiX } from 'react-icons/fi';
import { format } from 'date-fns';
import StatusBadge from '../components/StatusBadge';

const ManagerTeamCalendar = () => {
    const [attendanceData, setAttendanceData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedEvents, setSelectedEvents] = useState(null);

    useEffect(() => {
        fetchAttendance();
    }, []);

    const fetchAttendance = async () => {
        try {
            const response = await attendanceService.getAllAttendance();
            setAttendanceData(response.data || []);
        } catch (error) {
            toast.error('Failed to load calendar data');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            present: '#10B981',
            late: '#F59E0B',
            absent: '#EF4444',
            'half-day': '#F97316',
        };
        return colors[status] || '#3B82F6';
    };

    const calendarEvents = attendanceData.map((record) => ({
        title: `${record.User?.name?.split(' ')[0] || 'User'} - ${record.status} `,
        date: record.date.split('T')[0],
        backgroundColor: getStatusColor(record.status),
        borderColor: getStatusColor(record.status),
        extendedProps: record,
    }));

    const handleEventClick = (info) => {
        const clickedDate = info.event.startStr;
        const eventsOnDate = attendanceData.filter(
            (record) => record.date.split('T')[0] === clickedDate
        );
        setSelectedEvents({ date: clickedDate, events: eventsOnDate });
    };

    if (loading) {
        return (
            <MainLayout>
                <LoadingSkeleton type="card" count={1} />
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="space-y-6 animate-fade-in">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-white">Team Calendar</h1>
                    <p className="text-gray-300 mt-1">Team attendance at a glance</p>
                </div>

                {/* Legend */}
                <div className="card bg-gray-900 border border-gray-800">
                    <div className="flex flex-wrap gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#10B981' }}></div>
                            <span className="text-sm text-gray-300">Present</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#F59E0B' }}></div>
                            <span className="text-sm text-gray-300">Late</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#EF4444' }}></div>
                            <span className="text-sm text-gray-300">Absent</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#F97316' }}></div>
                            <span className="text-sm text-gray-300">Half Day</span>
                        </div>
                    </div>
                </div>

                {/* Calendar */}
                <div className="card bg-gray-900 border border-gray-800">
                    <FullCalendar
                        plugins={[dayGridPlugin, interactionPlugin]}
                        initialView="dayGridMonth"
                        events={calendarEvents}
                        eventClick={handleEventClick}
                        headerToolbar={{
                            left: 'prev,next today',
                            center: 'title',
                            right: 'dayGridMonth,dayGridWeek,dayGridDay',
                        }}
                        height="auto"
                        eventDisplay="block"
                    />
                </div>

                {/* Event Details Modal */}
                {selectedEvents && (
                    <div className="modal-overlay" onClick={() => setSelectedEvents(null)}>
                        <div className="modal-content max-w-2xl bg-gray-800 text-gray-100" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-bold text-white">
                                    Attendance for {format(new Date(selectedEvents.date), 'MMMM d, yyyy')}
                                </h3>
                                <button
                                    onClick={() => setSelectedEvents(null)}
                                    className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                                >
                                    <FiX className="w-5 h-5 text-gray-400" />
                                </button>
                            </div>

                            <div className="max-h-96 overflow-y-auto">
                                <div className="space-y-3">
                                    {selectedEvents.events.map((event) => (
                                        <div
                                            key={event.id}
                                            className="flex items-center justify-between p-3 bg-gray-700 rounded-lg border border-gray-600"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-primary-900 flex items-center justify-center text-primary-300 font-semibold">
                                                    {event.User?.name?.charAt(0).toUpperCase() || '?'}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{event.User?.name || 'N/A'}</p>
                                                    <p className="text-sm text-gray-600">{event.User?.department || 'N/A'}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-4">
                                                <div className="text-right text-sm">
                                                    <p className="text-gray-600">
                                                        {event.checkInTime ? format(new Date(event.checkInTime), 'HH:mm') : '-'} →{' '}
                                                        {event.checkOutTime ? format(new Date(event.checkOutTime), 'HH:mm') : '-'}
                                                    </p>
                                                    <p className="text-gray-500">{event.totalHours?.toFixed(2) || '0.00'}h</p>
                                                </div>
                                                <StatusBadge status={event.status} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </MainLayout>
    );
};

export default ManagerTeamCalendar;
