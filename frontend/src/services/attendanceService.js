import api from './api';

export const attendanceService = {
    // Employee endpoints
    checkIn: async () => {
        const response = await api.post('/attendance/checkin');
        return response.data;
    },

    checkOut: async () => {
        const response = await api.post('/attendance/checkout');
        return response.data;
    },

    getMyHistory: async (page = 1, limit = 20) => {
        const response = await api.get(`/attendance/my-history?page=${page}&limit=${limit}`);
        return response.data;
    },

    getMySummary: async (month) => {
        const url = month ? `/attendance/my-summary?month=${month}` : '/attendance/my-summary';
        const response = await api.get(url);
        return response.data;
    },

    getTodayStatus: async () => {
        const response = await api.get('/attendance/today');
        return response.data;
    },

    // Manager endpoints
    getAllAttendance: async (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        const response = await api.get(`/attendance/all?${queryString}`);
        return response.data;
    },

    getEmployeeAttendance: async (employeeId, params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        const response = await api.get(`/attendance/employee/${employeeId}?${queryString}`);
        return response.data;
    },

    getTeamSummary: async () => {
        const response = await api.get('/attendance/summary');
        return response.data;
    },

    getTodayTeamStatus: async () => {
        const response = await api.get('/attendance/today-status');
        return response.data;
    },

    generateReport: async (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        const response = await api.get(`/attendance/report?${queryString}`);
        return response.data;
    },

    exportAttendance: async (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        const response = await api.get(`/attendance/export?${queryString}`, {
            responseType: 'blob',
        });

        // Create download link
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'attendance.csv');
        document.body.appendChild(link);
        link.click();
        link.remove();

        return { success: true };
    },

    // Dashboard endpoints
    getEmployeeDashboard: async () => {
        const response = await api.get('/dashboard/employee');
        return response.data;
    },

    getManagerDashboard: async () => {
        const response = await api.get('/dashboard/manager');
        return response.data;
    },
};

export default attendanceService;
