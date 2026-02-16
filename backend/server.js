import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import connectDB from './src/config/db.js';
import { errorHandler } from './src/middlewares/errorHandler.js';
import { autoMarkAbsent } from './src/utils/cronJobs.js';

// Routes
import authRoutes from './src/routes/authRoutes.js';
import attendanceRoutes from './src/routes/attendanceRoutes.js';
import dashboardRoutes from './src/routes/dashboardRoutes.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(helmet()); // Security headers
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
}));
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(morgan('dev')); // Logging

// Routes
app.get('/', (req, res) => {
    res.json({
        message: 'Employee Attendance System API',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            attendance: '/api/attendance',
            dashboard: '/api/dashboard',
        },
    });
});

app.use('/api/auth', authRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Error handling middleware (must be last)
app.use(errorHandler);

const startServer = async () => {
    // Connect to PostgreSQL first. Exit if connection fails.
    await connectDB();

    // Start cron jobs only after DB connection is ready.
    autoMarkAbsent();

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
    });
};

startServer();

export default app;
