import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/authSlice';
import attendanceReducer from './features/attendanceSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        attendance: attendanceReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export default store;
