import React, { useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import { useSelector } from 'react-redux';
import Avatar from '../components/Avatar';
import Button from '../components/Button';
import Card from '../components/Card';
import { FiEdit2, FiSave, FiX, FiMail, FiHash, FiBriefcase, FiCalendar } from 'react-icons/fi';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const EmployeeProfile = () => {
    const { user } = useSelector((state) => state.auth);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        // API call would go here
        toast.success('Profile updated successfully!');
        setIsEditing(false);
    };

    const handleCancel = () => {
        setFormData({ name: user?.name || '' });
        setIsEditing(false);
    };

    return (
        <MainLayout>
            <div className="space-y-6 animate-fade-in">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-white">My Profile</h1>
                    <p className="text-gray-300 mt-1 font-medium">Manage your personal information</p>
                </div>

                {/* Profile Card */}
                <Card>
                    <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <Avatar name={user?.name} size="2xl" />
                            <div>
                                <h2 className="text-2xl font-bold text-white">{user?.name}</h2>
                                <p className="text-gray-300 font-medium">{user?.email}</p>
                                <span className="inline-block mt-2 px-3 py-1 rounded-full text-sm font-bold bg-primary-500/10 text-primary-400 border border-primary-500/20">
                                    {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
                                </span>
                            </div>
                        </div>

                        {!isEditing && (
                            <Button variant="secondary" onClick={() => setIsEditing(true)} icon={FiEdit2}>
                                Edit Profile
                            </Button>
                        )}
                    </div>

                    <div className="border-t border-gray-700 pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Name */}
                            <div>
                                <label className="input-label text-gray-300 font-bold">Full Name</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="input-field bg-gray-900 text-white border-gray-700"
                                    />
                                ) : (
                                    <p className="text-lg font-bold text-white">{user?.name}</p>
                                )}
                            </div>

                            {/* Email */}
                            <div>
                                <label className="input-label flex items-center gap-2 text-gray-300 font-bold">
                                    <FiMail className="w-4 h-4" />
                                    Email Address
                                </label>
                                <p className="text-lg font-bold text-white">{user?.email}</p>
                                <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
                            </div>

                            {/* Employee Code */}
                            <div>
                                <label className="input-label flex items-center gap-2 text-gray-300 font-bold">
                                    <FiHash className="w-4 h-4" />
                                    Employee ID
                                </label>
                                <p className="text-lg font-bold text-white">{user?.employeeCode}</p>
                            </div>

                            {/* Department */}
                            <div>
                                <label className="input-label flex items-center gap-2 text-gray-300 font-bold">
                                    <FiBriefcase className="w-4 h-4" />
                                    Department
                                </label>
                                <p className="text-lg font-bold text-white">{user?.department}</p>
                            </div>

                            {/* Member Since */}
                            <div>
                                <label className="input-label flex items-center gap-2 text-gray-300 font-bold">
                                    <FiCalendar className="w-4 h-4" />
                                    Member Since
                                </label>
                                <p className="text-lg font-bold text-white">
                                    {user?.createdAt ? format(new Date(user.createdAt), 'MMM d, yyyy') : 'N/A'}
                                </p>
                            </div>

                            {/* Account Status */}
                            <div>
                                <label className="input-label text-gray-300 font-bold">Account Status</label>
                                <span className="inline-block px-3 py-1 rounded-full text-sm font-bold bg-success-500/10 text-success-400 border border-success-500/20">
                                    Active
                                </span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        {isEditing && (
                            <div className="flex gap-3 mt-6 pt-6 border-t border-gray-700">
                                <Button variant="primary" onClick={handleSave} icon={FiSave}>
                                    Save Changes
                                </Button>
                                <Button variant="secondary" onClick={handleCancel} icon={FiX}>
                                    Cancel
                                </Button>
                            </div>
                        )}
                    </div>
                </Card>

                {/* Account Information */}
                <Card>
                    <h3 className="text-lg font-bold text-white mb-4">Account Information</h3>
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between py-2 border-b border-gray-700">
                            <span className="text-gray-300 font-medium">Account Type</span>
                            <span className="font-bold text-white">Employee</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-700">
                            <span className="text-gray-300 font-medium">Permissions</span>
                            <span className="font-bold text-white">Standard Access</span>
                        </div>
                        <div className="flex justify-between py-2">
                            <span className="text-gray-300 font-medium">Two-Factor Authentication</span>
                            <span className="font-bold text-gray-500">Not Enabled</span>
                        </div>
                    </div>
                </Card>
            </div>
        </MainLayout>
    );
};

export default EmployeeProfile;
