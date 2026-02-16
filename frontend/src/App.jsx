import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Toaster } from 'react-hot-toast';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import EmployeeDashboard from './pages/EmployeeDashboard';
import EmployeeHistory from './pages/EmployeeHistory';
import EmployeeProfile from './pages/EmployeeProfile';
import ManagerDashboard from './pages/ManagerDashboard';
import ManagerAttendance from './pages/ManagerAttendance';
import ManagerTeamCalendar from './pages/ManagerTeamCalendar';
import ManagerReports from './pages/ManagerReports';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const { isAuthenticated, user } = useSelector((state) => state.auth);

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

// Error Boundary Component
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ error, errorInfo });
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
                    <div className="bg-white p-8 rounded-lg shadow-xl max-w-2xl w-full">
                        <h1 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h1>
                        <details className="whitespace-pre-wrap bg-gray-50 p-4 rounded border border-gray-200 text-sm text-gray-700 overflow-auto max-h-96">
                            <summary className="cursor-pointer font-semibold mb-2">Error Details</summary>
                            {this.state.error && this.state.error.toString()}
                            <br />
                            {this.state.errorInfo && this.state.errorInfo.componentStack}
                        </details>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-6 px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors"
                        >
                            Reload Page
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

// Redirect if already logged in
const PublicRoute = ({ children }) => {
    const { isAuthenticated, user } = useSelector((state) => state.auth);

    if (isAuthenticated) {
        if (user?.role === 'manager') {
            return <Navigate to="/manager/dashboard" replace />;
        }
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

function App() {
    return (
        <ErrorBoundary>
            <Router>
                <Toaster
                    position="top-right"
                    toastOptions={{
                        duration: 3000,
                        style: {
                            background: '#0F2744',
                            color: '#fff',
                            border: '1px solid rgba(255,255,255,0.1)',
                        },
                        success: {
                            iconTheme: {
                                primary: '#10B981',
                                secondary: '#fff',
                            },
                        },
                        error: {
                            iconTheme: {
                                primary: '#EF4444',
                                secondary: '#fff',
                            },
                        },
                    }}
                />

                <Routes>
                    {/* Public Routes */}
                    <Route
                        path="/login"
                        element={
                            <PublicRoute>
                                <Login />
                            </PublicRoute>
                        }
                    />
                    <Route
                        path="/register"
                        element={
                            <PublicRoute>
                                <Register />
                            </PublicRoute>
                        }
                    />

                    {/* Employee Routes */}
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute allowedRoles={['employee']}>
                                <EmployeeDashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/history"
                        element={
                            <ProtectedRoute allowedRoles={['employee']}>
                                <EmployeeHistory />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/profile"
                        element={
                            <ProtectedRoute allowedRoles={['employee']}>
                                <EmployeeProfile />
                            </ProtectedRoute>
                        }
                    />

                    {/* Manager Routes */}
                    <Route
                        path="/manager/dashboard"
                        element={
                            <ProtectedRoute allowedRoles={['manager']}>
                                <ManagerDashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/manager/attendance"
                        element={
                            <ProtectedRoute allowedRoles={['manager']}>
                                <ManagerAttendance />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/manager/reports"
                        element={
                            <ProtectedRoute allowedRoles={['manager']}>
                                <ManagerReports />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/manager/calendar"
                        element={
                            <ProtectedRoute allowedRoles={['manager']}>
                                <ManagerTeamCalendar />
                            </ProtectedRoute>
                        }
                    />

                    {/* Redirect root to login */}
                    <Route path="/" element={<Navigate to="/login" replace />} />

                    {/* 404 - Redirect to dashboard */}
                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
            </Router>
        </ErrorBoundary>
    );
}

export default App;
