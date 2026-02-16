import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../features/authSlice';
import authService from '../services/authService';
import toast from 'react-hot-toast';
import Button from '../components/Button';
import { FiUser, FiMail, FiLock, FiBriefcase, FiHash, FiArrowRight } from 'react-icons/fi';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'employee',
        employeeCode: '',
        department: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // Clear employeeCode when role changes
        if (name === 'role') {
            setFormData(prev => ({ ...prev, employeeCode: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await authService.register(formData);
            dispatch(loginSuccess({ user: response.data, token: response.token }));
            toast.success('Account created successfully!');

            if (response.user.role === 'manager') {
                navigate('/manager/dashboard');
            } else {
                navigate('/dashboard');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Brand */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 via-primary-700 to-accent-600 p-12 flex-col justify-between text-white">
                <div>
                    <h1 className="text-4xl font-bold mb-2">Employee Logistics</h1>
                    <p className="text-primary-100">Modern Workforce Management Platform</p>
                </div>

                <div className="space-y-6">
                    <div>
                        <h2 className="text-3xl font-bold mb-4">Join our platform!</h2>
                        <p className="text-lg text-primary-100">
                            Create your account and start managing your workforce efficiently.
                        </p>
                    </div>

                    <div className="space-y-3 text-primary-100">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center">✓</div>
                            <span>Easy attendance tracking</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center">✓</div>
                            <span>Real-time analytics dashboard</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center">✓</div>
                            <span>Comprehensive reporting tools</span>
                        </div>
                    </div>
                </div>

                <p className="text-sm text-primary-200">© 2026 Employee Logistics. All rights reserved.</p>
            </div>

            {/* Right Side - Form */}
            <div className="flex-1 flex items-center justify-center p-8 bg-gray-50 overflow-y-auto">
                <div className="w-full max-w-md py-8">
                    {/* Mobile Logo */}
                    <div className="lg:hidden mb-8 text-center">
                        <h1 className="text-2xl font-bold text-primary-700">Employee Logistics</h1>
                        <p className="text-sm text-gray-600">Workforce Management</p>
                    </div>

                    {/* Form Card */}
                    <div className="bg-white rounded-2xl shadow-xl p-8 animate-scale-in">
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
                            <p className="text-gray-600 mt-2">Fill in the details to get started</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Name */}
                            <div>
                                <label className="input-label-auth">Full Name</label>
                                <div className="relative">
                                    <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="input-field-auth pl-10"
                                        placeholder="John Doe"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label className="input-label-auth">Email Address</label>
                                <div className="relative">
                                    <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="input-field-auth pl-10"
                                        placeholder="you@example.com"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label className="input-label-auth">Password</label>
                                <div className="relative">
                                    <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="input-field-auth pl-10"
                                        placeholder="••••••••"
                                        required
                                        minLength={6}
                                    />
                                </div>
                            </div>

                            {/* Role Selection - Tabs Style */}
                            <div>
                                <label className="input-label-auth">Role</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, role: 'employee', employeeCode: '' })}
                                        className={`
                      px-4 py-3 rounded-lg font-medium transition-all border
                      ${formData.role === 'employee'
                                                ? 'bg-primary-50 border-primary-500 text-primary-700'
                                                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                                            }
                    `}
                                    >
                                        Employee
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, role: 'manager', employeeCode: '' })}
                                        className={`
                      px-4 py-3 rounded-lg font-medium transition-all border
                      ${formData.role === 'manager'
                                                ? 'bg-accent-50 border-accent-500 text-accent-700'
                                                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                                            }
                    `}
                                    >
                                        Manager
                                    </button>
                                </div>
                            </div>

                            {/* Conditional Employee/Manager ID Field */}
                            <div>
                                <label className="input-label-auth">
                                    {formData.role === 'employee' ? 'Employee ID' : 'Manager ID'}
                                </label>
                                <div className="relative">
                                    <FiHash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        name="employeeCode"
                                        value={formData.employeeCode}
                                        onChange={handleChange}
                                        className="input-field-auth pl-10"
                                        placeholder={formData.role === 'employee' ? 'EMP001' : 'MGR001'}
                                        required
                                    />
                                </div>
                                <p className="mt-1 text-xs text-gray-500">
                                    {formData.role === 'employee'
                                        ? 'Your unique employee identification number'
                                        : 'Your unique manager identification number'
                                    }
                                </p>
                            </div>

                            {/* Department */}
                            <div>
                                <label className="input-label-auth">Department</label>
                                <div className="relative">
                                    <FiBriefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <select
                                        name="department"
                                        value={formData.department}
                                        onChange={handleChange}
                                        className="input-field-auth pl-10 appearance-none"
                                        required
                                    >
                                        <option value="">Select Department</option>
                                        <option value="Engineering">Engineering</option>
                                        <option value="Sales">Sales</option>
                                        <option value="Marketing">Marketing</option>
                                        <option value="HR">Human Resources</option>
                                        <option value="Finance">Finance</option>
                                        <option value="Operations">Operations</option>
                                    </select>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                variant="primary"
                                size="lg"
                                fullWidth
                                disabled={isLoading}
                                icon={FiArrowRight}
                            >
                                {isLoading ? 'Creating account...' : 'Create Account'}
                            </Button>
                        </form>

                        {/* Login Link */}
                        <p className="mt-6 text-center text-sm text-gray-600">
                            Already have an account?{' '}
                            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-semibold">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
