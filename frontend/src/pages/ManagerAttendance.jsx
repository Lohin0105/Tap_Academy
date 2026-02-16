import React, { useEffect, useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import attendanceService from '../services/attendanceService';
import toast from 'react-hot-toast';
import LoadingSkeleton from '../components/LoadingSkeleton';
import StatusBadge from '../components/StatusBadge';
import { format } from 'date-fns';
import { FiSearch, FiFilter, FiDownload } from 'react-icons/fi';

const ManagerAttendance = () => {
    const [attendanceData, setAttendanceData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [dateFilter, setDateFilter] = useState('');

    useEffect(() => {
        fetchAttendance();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [searchTerm, statusFilter, dateFilter, attendanceData]);

    const fetchAttendance = async () => {
        try {
            const response = await attendanceService.getAllAttendance();
            const data = response?.data || [];
            setAttendanceData(data);
            setFilteredData(data);
        } catch (error) {
            toast.error('Failed to load attendance records');
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        let filtered = [...attendanceData];

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter((record) =>
                record.User?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                record.User?.employeeCode?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Status filter
        if (statusFilter !== 'all') {
            filtered = filtered.filter((record) => record.status === statusFilter);
        }

        // Date filter
        if (dateFilter) {
            filtered = filtered.filter((record) =>
                record.date.startsWith(dateFilter)
            );
        }

        setFilteredData(filtered);
    };

    const handleExport = () => {
        toast.success('Export feature coming soon!');
    };

    if (loading) {
        return (
            <MainLayout>
                <div className="space-y-6">
                    <LoadingSkeleton type="text" count={1} />
                    <LoadingSkeleton type="card" count={1} />
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="space-y-6 animate-fade-in">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-white">All Attendance</h1>
                        <p className="text-gray-300 mt-1">Monitor team attendance records</p>
                    </div>
                </div>

                {/* Filters Card */}
                <div className="card bg-gray-800 border border-gray-700">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Search */}
                        <div className="md:col-span-2">
                            <label className="input-label text-gray-300">Search Employee</label>
                            <div className="relative">
                                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Name or Employee ID..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="input-field pl-10 bg-gray-900 text-white border-gray-700 placeholder-gray-500"
                                />
                            </div>
                        </div>

                        {/* Status Filter */}
                        <div>
                            <label className="input-label text-gray-300">Status</label>
                            <div className="relative">
                                <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="input-field pl-10 appearance-none bg-gray-900 text-white border-gray-700"
                                >
                                    <option value="all">All Status</option>
                                    <option value="present">Present</option>
                                    <option value="late">Late</option>
                                    <option value="absent">Absent</option>
                                    <option value="half-day">Half Day</option>
                                </select>
                            </div>
                        </div>

                        {/* Date Filter */}
                        <div>
                            <label className="input-label text-gray-300">Date</label>
                            <input
                                type="date"
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                                className="input-field bg-gray-900 text-white border-gray-700"
                            />
                        </div>
                    </div>

                    {/* Results Summary */}
                    <div className="mt-4 flex items-center justify-between">
                        <p className="text-sm text-gray-400">
                            Showing <span className="font-semibold text-white">{filteredData.length}</span> of{' '}
                            <span className="font-semibold text-white">{attendanceData.length}</span> records
                        </p>
                        <button
                            onClick={handleExport}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-400 hover:text-primary-300 hover:bg-gray-700 rounded-lg transition-colors"
                        >
                            <FiDownload className="w-4 h-4" />
                            Export CSV
                        </button>
                    </div>
                </div>

                {/* Table - Desktop */}
                <div className="hidden md:block table-container bg-gray-800 border border-gray-700 rounded-lg">
                    <table className="w-full">
                        <thead className="table-header bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-300 uppercase">Employee</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-300 uppercase">Department</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-300 uppercase">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-300 uppercase">Check In</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-300 uppercase">Check Out</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-300 uppercase">Hours</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-300 uppercase">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {filteredData.length > 0 ? (
                                filteredData.map((record) => (
                                    <tr key={record.id} className="table-row hover:bg-gray-700/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-medium text-white">{record.User?.name || 'N/A'}</p>
                                                <p className="text-sm text-gray-400">{record.User?.employeeCode || 'N/A'}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-300">{record.User?.department || 'N/A'}</td>
                                        <td className="px-6 py-4 text-sm text-white">
                                            {format(new Date(record.date), 'MMM d, yyyy')}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-300">
                                            {record.checkInTime ? format(new Date(record.checkInTime), 'HH:mm') : '-'}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-300">
                                            {record.checkOutTime ? format(new Date(record.checkOutTime), 'HH:mm') : '-'}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-300">
                                            {record.totalHours?.toFixed(2) || '0.00'}h
                                        </td>
                                        <td className="px-6 py-4">
                                            <StatusBadge status={record.status} />
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="px-6 py-8 text-center text-gray-400">
                                        No attendance records found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden space-y-3">
                    {filteredData.length > 0 ? (
                        filteredData.map((record) => (
                            <div key={record.id} className="card p-4 bg-gray-800 border border-gray-700">
                                <div className="flex items-center justify-between mb-3">
                                    <div>
                                        <p className="font-semibold text-white">{record.User?.name || 'N/A'}</p>
                                        <p className="text-sm text-gray-400">{record.User?.employeeCode || 'N/A'}</p>
                                    </div>
                                    <StatusBadge status={record.status} />
                                </div>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Department:</span>
                                        <span className="font-medium text-gray-900">{record.User?.department || 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Date:</span>
                                        <span className="font-medium text-gray-900">
                                            {format(new Date(record.date), 'MMM d, yyyy')}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Check In:</span>
                                        <span className="font-medium text-gray-900">
                                            {record.checkInTime ? format(new Date(record.checkInTime), 'HH:mm') : '-'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Check Out:</span>
                                        <span className="font-medium text-gray-900">
                                            {record.checkOutTime ? format(new Date(record.checkOutTime), 'HH:mm') : '-'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Hours:</span>
                                        <span className="font-medium text-gray-900">{record.totalHours?.toFixed(2) || '0.00'}h</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="card p-8 text-center text-gray-500">
                            No attendance records found
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
};

export default ManagerAttendance;
