import React, { useEffect, useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import attendanceService from '../services/attendanceService';
import { useSelector } from 'react-redux';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import toast from 'react-hot-toast';
import LoadingSkeleton from '../components/LoadingSkeleton';
import StatusBadge from '../components/StatusBadge';
import { format } from 'date-fns';
import { FiCalendar, FiList, FiX } from 'react-icons/fi';

const EmployeeHistory = () => {
    const [attendanceData, setAttendanceData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('calendar'); // 'calendar' or 'table'
    const [selectedEvent, setSelectedEvent] = useState(null);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const response = await attendanceService.getMyHistory();
            setAttendanceData(response.data || []);
        } catch (error) {
            toast.error('Failed to load attendance history');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            present: '#10B981',
            late: '#F59E0B',
            absent: '#EF4444',
            'half-day': '#F59E0B',
        };
        return colors[status] || '#3B82F6';
    };

    const calendarEvents = attendanceData.map((record) => ({
        title: record.status.charAt(0).toUpperCase() + record.status.slice(1),
        date: record.date.split('T')[0],
        backgroundColor: getStatusColor(record.status),
        borderColor: getStatusColor(record.status),
        extendedProps: record,
    }));

    const handleEventClick = (info) => {
        setSelectedEvent(info.event.extendedProps);
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
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Attendance History</h1>
                        <p className="text-gray-300 mt-1 font-medium">View your attendance records</p>
                    </div>

                    {/* View Toggle */}
                    <div className="flex items-center gap-2 bg-gray-900 rounded-lg shadow-sm border border-gray-700 p-1">
                        <button
                            onClick={() => setViewMode('calendar')}
                            className={`
                flex items-center gap-2 px-4 py-2 rounded-md font-bold transition-all
                ${viewMode === 'calendar'
                                    ? 'bg-primary-600 text-white shadow-lg'
                                    : 'text-gray-400 hover:bg-gray-800'
                                }
              `}
                        >
                            <FiCalendar className="w-4 h-4" />
                            Calendar
                        </button>
                        <button
                            onClick={() => setViewMode('table')}
                            className={`
                flex items-center gap-2 px-4 py-2 rounded-md font-bold transition-all
                ${viewMode === 'table'
                                    ? 'bg-primary-600 text-white shadow-lg'
                                    : 'text-gray-400 hover:bg-gray-800'
                                }
              `}
                        >
                            <FiList className="w-4 h-4" />
                            Table
                        </button>
                    </div>
                </div>

                {/* Calendar View */}
                {viewMode === 'calendar' && (
                    <div className="card bg-gray-900 border border-gray-800 text-white">
                        <FullCalendar
                            plugins={[dayGridPlugin, interactionPlugin]}
                            initialView="dayGridMonth"
                            events={calendarEvents}
                            eventClick={handleEventClick}
                            headerToolbar={{
                                left: 'prev,next today',
                                center: 'title',
                                right: 'dayGridMonth,dayGridWeek',
                            }}
                            height="auto"
                            dayHeaderClassNames="text-gray-300 font-bold"
                            dayCellClassNames="hover:bg-gray-800 cursor-pointer"
                        />
                    </div>
                )}

                {/* Table View - Desktop */}
                {viewMode === 'table' && (
                    <>
                        <div className="hidden md:block table-container bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-gray-800 border-b border-gray-700">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">Check In</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">Check Out</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">Hours</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-800">
                                    {attendanceData.length > 0 ? (
                                        attendanceData.map((record) => (
                                            <tr key={record.id} className="hover:bg-gray-800/50 transition-colors">
                                                <td className="px-6 py-4 text-sm font-bold text-white">
                                                    {format(new Date(record.date), 'MMM d, yyyy')}
                                                </td>
                                                <td className="px-6 py-4 text-sm font-medium text-gray-300">
                                                    {record.checkInTime ? format(new Date(record.checkInTime), 'HH:mm') : '-'}
                                                </td>
                                                <td className="px-6 py-4 text-sm font-medium text-gray-300">
                                                    {record.checkOutTime ? format(new Date(record.checkOutTime), 'HH:mm') : '-'}
                                                </td>
                                                <td className="px-6 py-4 text-sm font-bold text-white">
                                                    {record.totalHours?.toFixed(2) || '0.00'}h
                                                </td>
                                                <td className="px-6 py-4">
                                                    <StatusBadge status={record.status} />
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-8 text-center text-gray-400 font-medium">
                                                No attendance records found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Cards */}
                        <div className="md:hidden space-y-3">
                            {attendanceData.length > 0 ? (
                                attendanceData.map((record) => (
                                    <div key={record.id} className="card bg-gray-900 border border-gray-800 p-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="font-bold text-white">
                                                {format(new Date(record.date), 'MMM d, yyyy')}
                                            </span>
                                            <StatusBadge status={record.status} />
                                        </div>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-gray-400 font-medium">Check In:</span>
                                                <span className="font-bold text-white">
                                                    {record.checkInTime ? format(new Date(record.checkInTime), 'HH:mm') : '-'}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-400 font-medium">Check Out:</span>
                                                <span className="font-bold text-white">
                                                    {record.checkOutTime ? format(new Date(record.checkOutTime), 'HH:mm') : '-'}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-400 font-medium">Hours:</span>
                                                <span className="font-bold text-white">
                                                    {record.totalHours?.toFixed(2) || '0.00'}h
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="card bg-gray-900 border border-gray-800 p-8 text-center text-gray-400 font-medium">
                                    No attendance records found
                                </div>
                            )}
                        </div>
                    </>
                )}
                {/* Event Detail Modal */}
                {selectedEvent && (
                    <div className="modal-overlay" onClick={() => setSelectedEvent(null)}>
                        <div className="modal-content bg-gray-800 border border-gray-700 text-white" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-bold text-white">Attendance Details</h3>
                                <button
                                    onClick={() => setSelectedEvent(null)}
                                    className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                                >
                                    <FiX className="w-5 h-5 text-gray-400" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-gray-400 font-medium">Date</p>
                                    <p className="text-lg font-bold text-white">
                                        {format(new Date(selectedEvent.date), 'EEEE, MMMM d, yyyy')}
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-400 font-medium">Check In</p>
                                        <p className="text-lg font-bold text-white">
                                            {selectedEvent.checkInTime
                                                ? format(new Date(selectedEvent.checkInTime), 'HH:mm:ss')
                                                : '-'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400 font-medium">Check Out</p>
                                        <p className="text-lg font-bold text-white">
                                            {selectedEvent.checkOutTime
                                                ? format(new Date(selectedEvent.checkOutTime), 'HH:mm:ss')
                                                : '-'}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-400 font-medium">Total Hours</p>
                                    <p className="text-lg font-bold text-white">
                                        {selectedEvent.totalHours?.toFixed(2) || '0.00'} hours
                                    </p>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-400 font-medium mb-2">Status</p>
                                    <StatusBadge status={selectedEvent.status} />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </MainLayout>
    );
};

export default EmployeeHistory;
