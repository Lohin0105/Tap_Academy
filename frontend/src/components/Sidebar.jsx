import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/authSlice';
import {
    FiHome,
    FiCalendar,
    FiUsers,
    FiClock,
    FiFileText,
    FiMenu,
    FiX,
    FiChevronLeft,
} from 'react-icons/fi';
import Avatar from './Avatar';

const Sidebar = () => {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const employeeMenuItems = [
        { name: 'Dashboard', path: '/dashboard', icon: FiHome },
        { name: 'Attendance History', path: '/history', icon: FiCalendar },
        { name: 'Profile', path: '/profile', icon: FiUsers },
    ];

    const managerMenuItems = [
        { name: 'Dashboard', path: '/manager/dashboard', icon: FiHome },
        { name: 'All Attendance', path: '/manager/attendance', icon: FiClock },
        { name: 'Team Calendar', path: '/manager/calendar', icon: FiCalendar },
        { name: 'Reports', path: '/manager/reports', icon: FiFileText },
    ];

    const menuItems = user?.role === 'manager' ? managerMenuItems : employeeMenuItems;

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md text-gray-700"
                onClick={() => setIsMobileOpen(!isMobileOpen)}
            >
                {isMobileOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>

            {/* Sidebar */}
            <aside
                className={`
          sidebar
          bg-gray-950 border-r border-gray-800
          ${isCollapsed ? 'w-20' : 'w-64'}
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
            >
                <div className="flex flex-col h-full">
                    {/* Logo & Brand */}
                    <div className="px-6 py-6 border-b border-gray-800">
                        <div className="flex items-center justify-between">
                            {!isCollapsed && (
                                <div>
                                    <h1 className="text-xl font-bold text-white">Employee Logistics</h1>
                                    <p className="text-xs text-gray-300 mt-0.5 font-bold">Workforce Management</p>
                                </div>
                            )}
                            <button
                                className="hidden lg:block p-1.5 hover:bg-gray-800 rounded-lg transition-colors text-gray-400 hover:text-white"
                                onClick={() => setIsCollapsed(!isCollapsed)}
                            >
                                <FiChevronLeft className={`w-5 h-5 transition-transform ${isCollapsed ? 'rotate-180' : ''}`} />
                            </button>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
                        {menuItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    `sidebar-item font-bold ${isActive ? 'sidebar-item-active' : ''}`
                                }
                                onClick={() => setIsMobileOpen(false)}
                            >
                                <item.icon className={`w-5 h-5 ${isCollapsed ? 'mx-auto' : ''}`} />
                                {!isCollapsed && <span>{item.name}</span>}
                            </NavLink>
                        ))}
                    </nav>

                    {/* User Profile */}
                    <div className="px-4 py-4 border-t border-gray-800">
                        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
                            <Avatar name={user?.name} size="md" />
                            {!isCollapsed && (
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-white truncate">{user?.name}</p>
                                    <p className="text-xs text-gray-300 font-medium truncate">{user?.email}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </aside>

            {/* Mobile Overlay */}
            {
                isMobileOpen && (
                    <div
                        className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-20"
                        onClick={() => setIsMobileOpen(false)}
                    />
                )
            }
        </>
    );
};

export default Sidebar;
