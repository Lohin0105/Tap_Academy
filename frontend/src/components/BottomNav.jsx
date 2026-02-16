import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FiHome, FiCalendar, FiUser, FiBarChart2, FiUsers } from 'react-icons/fi';

const BottomNav = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useSelector((state) => state.auth);

    const employeeNavItems = [
        { path: '/employee/dashboard', icon: FiHome, label: 'Home' },
        { path: '/employee/history', icon: FiCalendar, label: 'History' },
        { path: '/employee/profile', icon: FiUser, label: 'Profile' },
    ];

    const managerNavItems = [
        { path: '/manager/dashboard', icon: FiHome, label: 'Home' },
        { path: '/manager/attendance', icon: FiUsers, label: 'Team' },
        { path: '/manager/calendar', icon: FiCalendar, label: 'Calendar' },
        { path: '/manager/reports', icon: FiBarChart2, label: 'Reports' },
    ];

    const navItems = user?.role === 'manager' ? managerNavItems : employeeNavItems;

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-40">
            <div className="flex justify-around items-center h-16">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;

                    return (
                        <button
                            key={item.path}
                            onClick={() => navigate(item.path)}
                            className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${isActive
                                    ? 'text-primary-600'
                                    : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <Icon className={`w-6 h-6 mb-1 ${isActive ? 'text-primary-600' : ''}`} />
                            <span className={`text-xs font-medium ${isActive ? 'text-primary-600' : ''}`}>
                                {item.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default BottomNav;
