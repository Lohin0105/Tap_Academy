import { createSlice } from '@reduxjs/toolkit';
import authService from '../services/authService';

const user = authService.getCurrentUser();
const token = authService.getToken();

const initialState = {
    user: user,
    token: token,
    isAuthenticated: !!token && !!user,
    loading: false,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        loginSuccess: (state, action) => {
            state.loading = false;
            state.isAuthenticated = true;
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.error = null;
        },
        loginFailure: (state, action) => {
            state.loading = false;
            state.isAuthenticated = false;
            state.user = null;
            state.token = null;
            state.error = action.payload;
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.user = null;
            state.token = null;
            state.error = null;
            authService.logout();
        },
        clearError: (state) => {
            state.error = null;
        },
        updateUser: (state, action) => {
            state.user = action.payload;
            localStorage.setItem('user', JSON.stringify(action.payload));
        },
    },
});

export const { loginStart, loginSuccess, loginFailure, logout, clearError, updateUser } = authSlice.actions;

export default authSlice.reducer;
