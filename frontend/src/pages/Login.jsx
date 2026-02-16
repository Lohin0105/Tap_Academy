import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../features/authSlice';
import authService from '../services/authService';
import toast from 'react-hot-toast';
import Button from '../components/Button';
import { FiMail, FiLock, FiArrowRight } from 'react-icons/fi';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await authService.login(formData);
            dispatch(loginSuccess({ user: response.data, token: response.token }));
            if (response.data?.role === 'manager') {
                navigate('/manager/dashboard');
            } else {
                navigate('/dashboard');
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Login failed');
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
                        <h2 className="text-3xl font-bold mb-4">Welcome back!</h2>
                        <p className="text-lg text-primary-100">
                            Sign in to access your dashboard and manage your attendance seamlessly.
                        </p>
                    </div>

                    <div className="space-y-3 text-primary-100">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center">✓</div>
                            <span>Track attendance in real-time</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center">✓</div>
                            <span>View comprehensive analytics</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center">✓</div>
                            <span>Generate detailed reports</span>
                        </div>
                    </div>
                </div>

                <p className="text-sm text-primary-200">© 2026 Employee Logistics. All rights reserved.</p>
            </div>

            {/* Right Side - Form */}
            <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="lg:hidden mb-8 text-center">
                        <h1 className="text-2xl font-bold text-primary-700">Employee Logistics</h1>
                        <p className="text-sm text-gray-600">Workforce Management</p>
                    </div>

                    {/* Form Card */}
                    <div className="bg-white rounded-2xl shadow-xl p-8 animate-scale-in">
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold text-gray-900">Sign In</h2>
                            <p className="text-gray-600 mt-2">Enter your credentials to access your account</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Email Field */}
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

                            {/* Password Field */}
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
                                    />
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
                                {isLoading ? 'Signing in...' : 'Sign In'}
                            </Button>
                        </form>

                        {/* Demo Credentials */}
                        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <p className="text-xs font-semibold text-gray-700 mb-2">Demo Credentials:</p>
                            <div className="text-xs text-gray-600 space-y-1">
                                <p><strong>Manager:</strong> john.manager@company.com / password123</p>
                                <p><strong>Employee:</strong> alice.johnson@company.com / password123</p>
                            </div>
                        </div>

                        {/* Register Link */}
                        <p className="mt-6 text-center text-sm text-gray-600">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-primary-600 hover:text-primary-700 font-semibold">
                                Create Account
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
