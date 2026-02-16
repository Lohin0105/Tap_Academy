import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    todayStatus: null,
    history: [],
    summary: null,
    loading: false,
    error: null,

    // Manager data
    allAttendance: [],
    teamSummary: null,
    todayTeamStatus: [],

    pagination: {
        page: 1,
        limit: 20,
        total: 0,
        pages: 0,
    },
};

const attendanceSlice = createSlice({
    name: 'attendance',
    initialState,
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        clearError: (state) => {
            state.error = null;
        },

        // Employee
        setTodayStatus: (state, action) => {
            state.todayStatus = action.payload;
            state.loading = false;
        },
        setHistory: (state, action) => {
            state.history = action.payload;
            state.loading = false;
        },
        setSummary: (state, action) => {
            state.summary = action.payload;
            state.loading = false;
        },

        // Manager
        setAllAttendance: (state, action) => {
            state.allAttendance = action.payload.data;
            state.pagination = action.payload.pagination;
            state.loading = false;
        },
        setTeamSummary: (state, action) => {
            state.teamSummary = action.payload;
            state.loading = false;
        },
        setTodayTeamStatus: (state, action) => {
            state.todayTeamStatus = action.payload;
            state.loading = false;
        },

        resetAttendance: () => initialState,
    },
});

export const {
    setLoading,
    setError,
    clearError,
    setTodayStatus,
    setHistory,
    setSummary,
    setAllAttendance,
    setTeamSummary,
    setTodayTeamStatus,
    resetAttendance,
} = attendanceSlice.actions;

export default attendanceSlice.reducer;
