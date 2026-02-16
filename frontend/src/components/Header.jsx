import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/authSlice';
import { useNavigate } from 'react-router-dom';
import { FiLogOut } from 'react-icons/fi';

const Header = () => {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    const getInitials = (name) => {
        return name
            ?.split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2) || '??';
    };

    const getRoleBadgeColor = (role) => {
        return role === 'manager'
            ? 'bg-accent-500/10 text-accent-400 border-accent-500/20'
            : 'bg-primary-500/10 text-primary-400 border-primary-500/20';
    };

    return (
        <header className="sticky top-0 z-20 bg-gray-950 border-b border-gray-800 px-6 py-4 flex items-center justify-end">
            {/* Right Section */}
            <div className="flex items-center gap-4 ml-auto">
                {/* User Info */}
                <div className="flex items-center gap-3 pl-4">
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-600 to-accent-600 flex items-center justify-center text-white font-bold text-sm ring-2 ring-gray-900">
                        {getInitials(user?.name)}
                    </div>

                    {/* Name & Role */}
                    <div className="hidden md:block">
                        <p className="text-sm font-bold text-white">{user?.name}</p>
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold border ${getRoleBadgeColor(user?.role)}`}>
                            {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
                        </span>
                    </div>

                    {/* Logout Button */}
                    <button
                        onClick={handleLogout}
                        className="p-2 text-gray-300 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Logout"
                    >
                        <FiLogOut className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
