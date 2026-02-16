import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import StatCard from '../components/StatCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import attendanceService from '../services/attendanceService';
import Button from '../components/Button';
import { setTodayStatus } from '../features/attendanceSlice';
import toast from 'react-hot-toast';
import { FiCheckCircle, FiClock, FiCalendar, FiTrendingUp, FiLogIn, FiLogOut } from 'react-icons/fi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

const EmployeeDashboard = () => {
    const { user } = useSelector((state) => state.auth);
    const { todayStatus } = useSelector((state) => state.attendance);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        fetchDashboard();
        // Update current time every second
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const fetchDashboard = async () => {
        try {
            const [statusRes, dashRes] = await Promise.all([
                attendanceService.getTodayStatus(),
                attendanceService.getEmployeeDashboard(),
            ]);
            dispatch(setTodayStatus(statusRes.data));
            setDashboardData(dashRes.data);
        } catch (error) {
            toast.error('Failed to load dashboard');
        } finally {
            setLoading(false);
        }
    };

    const handleCheckIn = async () => {
        try {
            await attendanceService.checkIn();
            toast.success('Checked in successfully!');
            fetchDashboard();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Check-in failed');
        }
    };

    const handleCheckOut = async () => {
        try {
            await attendanceService.checkOut();
            toast.success('Checked out successfully!');
            fetchDashboard();
        } catch (error) {
            console.error('Check-out error:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Check-out failed';
            toast.error(errorMessage);
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            present: 'success',
            late: 'warning',
            absent: 'danger',
            'half-day': 'warning',
        };
        return colors[status] || 'primary';
    };

    const getStatusLabel = () => {
        if (!todayStatus) return 'Not Checked In';
        if (!todayStatus.checkOutTime) return 'Checked In';
        return 'Checked Out';
    };

    const attendancePercentage = dashboardData?.summary
        ? Math.round((dashboardData.summary.present / (dashboardData.summary.present + dashboardData.summary.absent + dashboardData.summary.late + dashboardData.summary.halfDay)) * 100)
        : 0;

    if (loading) {
        return (
            <MainLayout>
                <div className="space-y-6">
                    <LoadingSkeleton type="text" count={1} />
                    {/* Stats */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
                        <LoadingSkeleton type="stat" count={4} />
                    </div>
                    <LoadingSkeleton type="card" count={2} />
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="space-y-6 animate-fade-in">
                {/* Welcome Section */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Welcome back, {user?.name}!</h1>
                        <p className="text-gray-300 mt-1 font-medium">Here's your attendance overview</p>
                    </div>
                    <div className={`px-4 py-2 rounded-full text-sm font-bold border ${todayStatus?.checkInTime && !todayStatus?.checkOutTime
                        ? 'bg-success-500/10 text-success-400 border-success-500/20'
                        : 'bg-gray-800 text-gray-300 border-gray-700'
                        }`}>
                        {getStatusLabel()}
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        icon={FiCheckCircle}
                        label="Present Days"
                        value={dashboardData?.summary?.present || 0}
                        iconColor="success"
                    />
                    <StatCard
                        icon={FiClock}
                        label="Late Days"
                        value={dashboardData?.summary?.late || 0}
                        iconColor="warning"
                    />
                    <StatCard
                        icon={FiCalendar}
                        label="Total Hours"
                        value={dashboardData?.summary?.totalHours || 0}
                        suffix="h"
                        iconColor="primary"
                    />
                    <StatCard
                        icon={FiTrendingUp}
                        label="Attendance Rate"
                        value={attendancePercentage}
                        suffix="%"
                        iconColor={attendancePercentage >= 90 ? 'success' : attendancePercentage >= 75 ? 'warning' : 'danger'}
                    />
                </div>

                {/* Quick Action Panel & Activity Chart */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Check In/Out Panel */}
                    <div className="lg:col-span-1">
                        <div className="card h-full bg-gray-900 border border-gray-800">
                            <h3 className="text-lg font-bold text-white mb-4">Quick Action</h3>

                            <div className="space-y-4">
                                {/* Current Time */}
                                <div className="text-center p-4 bg-gray-800 rounded-lg border border-gray-700">
                                    <p className="text-sm text-gray-300 mb-1 font-medium">Current Time</p>
                                    <p className="text-2xl font-bold text-white">{format(currentTime, 'HH:mm:ss')}</p>
                                    <p className="text-sm text-gray-300 mt-1 font-medium">{format(currentTime, 'EEEE, MMM d, yyyy')}</p>
                                </div>

                                {/* Action Buttons */}
                                {!todayStatus?.checkInTime ? (
                                    <Button
                                        variant="success"
                                        size="lg"
                                        fullWidth
                                        onClick={handleCheckIn}
                                        icon={FiLogIn}
                                    >
                                        Check In
                                    </Button>
                                ) : !todayStatus?.checkOutTime ? (
                                    <div className="space-y-3">
                                        <div className="p-3 bg-success-500/10 rounded-lg border border-success-500/20">
                                            <p className="text-xs text-success-400 mb-1 font-bold">Checked in at</p>
                                            <p className="text-lg font-bold text-success-300">
                                                {format(new Date(todayStatus.checkInTime), 'HH:mm')}
                                            </p>
                                        </div>
                                        <Button
                                            variant="danger"
                                            size="lg"
                                            fullWidth
                                            onClick={handleCheckOut}
                                            icon={FiLogOut}
                                        >
                                            Check Out
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <div className="p-3 bg-gray-800 rounded-lg border border-gray-700">
                                            <p className="text-xs text-gray-400 mb-1 font-bold">Today's Hours</p>
                                            <p className="text-lg font-bold text-white">
                                                {todayStatus.totalHours?.toFixed(2) || 0}h
                                            </p>
                                        </div>
                                        <div className="text-center text-sm text-gray-400 font-medium">
                                            You've completed today's attendance
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Weekly Trend Chart */}
                    <div className="lg:col-span-2">
                        <div className="card h-full bg-gray-900 border border-gray-800">
                            <h3 className="text-lg font-bold text-white mb-4">Last 7 Days Activity</h3>

                            {dashboardData?.last7Days?.length > 0 ? (
                                <ResponsiveContainer width="100%" height={250}>
                                    <LineChart data={dashboardData.last7Days}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                        <XAxis
                                            dataKey="date"
                                            stroke="#9CA3AF"
                                            tick={{ fill: '#D1D5DB', fontSize: 12, fontWeight: 500 }}
                                        />
                                        <YAxis
                                            stroke="#9CA3AF"
                                            tick={{ fill: '#D1D5DB', fontSize: 12, fontWeight: 500 }}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: '#111827',
                                                border: '1px solid #374151',
                                                borderRadius: '0.5rem',
                                                color: '#F3F4F6',
                                            }}
                                            itemStyle={{ color: '#F3F4F6' }}
                                            labelStyle={{ color: '#9CA3AF' }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="hours"
                                            stroke="#6366F1"
                                            strokeWidth={3}
                                            dot={{ fill: '#6366F1', r: 4 }}
                                            activeDot={{ r: 6 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="flex items-center justify-center h-64 text-gray-400 font-medium">
                                    No activity data available
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default EmployeeDashboard;
