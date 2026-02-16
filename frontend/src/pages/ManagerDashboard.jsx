import React, { useEffect, useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import { useSelector } from 'react-redux';
import StatCard from '../components/StatCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import attendanceService from '../services/attendanceService';
import toast from 'react-hot-toast';
import { FiUsers, FiCheckCircle, FiClock, FiAlertCircle, FiTrendingUp } from 'react-icons/fi';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const ManagerDashboard = () => {
    const { user } = useSelector((state) => state.auth);
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboard();
    }, []);

    const fetchDashboard = async () => {
        try {
            const response = await attendanceService.getManagerDashboard();
            setDashboardData(response.data || response); // Handle both structures for safety
        } catch (error) {
            console.error('Dashboard fetch error:', error);
            toast.error('Failed to load dashboard');
        } finally {
            setLoading(false);
        }
    };

    const COLORS = {
        present: '#10B981',
        late: '#F59E0B',
        absent: '#EF4444',
        halfDay: '#F97316',
    };

    const attendanceData = dashboardData?.summary ? [
        { name: 'Present', value: dashboardData.summary.present, color: COLORS.present },
        { name: 'Late', value: dashboardData.summary.late, color: COLORS.late },
        { name: 'Absent', value: dashboardData.summary.absent, color: COLORS.absent },
        { name: 'Half Day', value: dashboardData.summary.halfDay, color: COLORS.halfDay },
    ] : [];

    if (loading) {
        return (
            <MainLayout>
                <div className="space-y-6">
                    <LoadingSkeleton type="text" count={1} />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <LoadingSkeleton type="stat" count={4} />
                    </div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="space-y-6 animate-fade-in">
                {/* Welcome Section */}
                <div>
                    <h1 className="text-3xl font-bold text-white">Manager Dashboard</h1>
                    <p className="text-gray-400 mt-1">Team overview and analytics</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-6">
                    <StatCard
                        icon={FiUsers}
                        label="Total Employees"
                        value={dashboardData?.summary?.totalEmployees || dashboardData?.summary?.present + dashboardData?.summary?.absent || 0}
                        iconColor="primary"
                    />
                    <StatCard
                        icon={FiCheckCircle}
                        label="Present Today"
                        value={dashboardData?.summary?.present || 0}
                        iconColor="success"
                    />
                    <StatCard
                        icon={FiClock}
                        label="Late Arrivals"
                        value={dashboardData?.summary?.late || 0}
                        iconColor="warning"
                    />
                    <StatCard
                        icon={FiAlertCircle}
                        label="Absent Today"
                        value={dashboardData?.summary?.absent || 0}
                        iconColor="danger"
                    />
                    <StatCard
                        icon={FiTrendingUp}
                        label="Attendance Rate"
                        value={dashboardData?.summary?.attendanceRate || 0}
                        suffix="%"
                        iconColor="accent"
                    />
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Attendance Distribution */}
                    <div className="card">
                        <h3 className="text-lg font-semibold text-white mb-4">Attendance Distribution</h3>
                        {attendanceData.length > 0 && attendanceData.some(d => d.value > 0) ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={attendanceData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {attendanceData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F3F4F6' }}
                                        itemStyle={{ color: '#F3F4F6' }}
                                    />
                                    <Legend wrapperStyle={{ color: '#9CA3AF' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-64 text-gray-500">
                                No attendance data available
                            </div>
                        )}
                    </div>

                    {/* Department Breakdown */}
                    <div className="card">
                        <h3 className="text-lg font-semibold text-white mb-4">Department Breakdown</h3>
                        {dashboardData?.departmentStats?.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={dashboardData.departmentStats}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                                    <XAxis dataKey="department" stroke="#9CA3AF" tick={{ fill: '#9CA3AF' }} />
                                    <YAxis stroke="#9CA3AF" tick={{ fill: '#9CA3AF' }} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F3F4F6' }}
                                        cursor={{ fill: '#374151', opacity: 0.4 }}
                                    />
                                    <Bar dataKey="present" fill="#10B981" name="Present" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="absent" fill="#EF4444" name="Absent" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-64 text-gray-500">
                                No department data available
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="card">
                    <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
                    <div className="space-y-3">
                        {dashboardData?.recentActivity?.length > 0 ? (
                            dashboardData.recentActivity.slice(0, 5).map((activity, index) => (
                                <div key={index} className="flex items-center justify-between py-3 border-b border-gray-800 last:border-0">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-primary-500/10 flex items-center justify-center text-primary-400 font-semibold ring-1 ring-primary-500/20">
                                            {activity.employeeName?.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-medium text-white">{activity.employeeName}</p>
                                            <p className="text-sm text-gray-400">{activity.action}</p>
                                        </div>
                                    </div>
                                    <span className="text-sm text-gray-500">{activity.time}</span>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-500 py-8">No recent activity</p>
                        )}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default ManagerDashboard;
