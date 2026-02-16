import express from 'express';
import {
    checkIn,
    checkOut,
    getMyHistory,
    getMySummary,
    getTodayStatus,
    getAllAttendance,
    getEmployeeAttendance,
    getTeamSummary,
    exportAttendance,
    getTodayTeamStatus,
    getAttendanceReport,
} from '../controllers/attendanceController.js';
import { authenticate, authorize } from '../middlewares/auth.js';

const router = express.Router();

// Employee routes
router.post('/checkin', authenticate, checkIn);
router.post('/checkout', authenticate, checkOut);
router.get('/my-history', authenticate, getMyHistory);
router.get('/my-summary', authenticate, getMySummary);
router.get('/today', authenticate, getTodayStatus);

// Manager routes
router.get('/all', authenticate, authorize('manager'), getAllAttendance);
router.get('/employee/:id', authenticate, authorize('manager'), getEmployeeAttendance);
router.get('/summary', authenticate, authorize('manager'), getTeamSummary);
router.get('/report', authenticate, authorize('manager'), getAttendanceReport);
router.get('/export', authenticate, authorize('manager'), exportAttendance);
router.get('/today-status', authenticate, authorize('manager'), getTodayTeamStatus);

export default router;
