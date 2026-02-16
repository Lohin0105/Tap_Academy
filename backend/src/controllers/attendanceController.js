import Attendance from '../models/Attendance.js';
import User from '../models/User.js';
import { Parser } from 'json2csv';
import { Op } from 'sequelize';

// Helper: Get start of day
const getStartOfDay = (date = new Date()) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
};

// Helper: Get end of day
const getEndOfDay = (date = new Date()) => {
    const d = new Date(date);
    d.setHours(23, 59, 59, 999);
    return d;
};

// Helper: Calculate total hours
const calculateHours = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return 0;
    const diff = new Date(checkOut) - new Date(checkIn);
    return Math.max(0, diff / (1000 * 60 * 60)); // Convert to hours
};

// Helper: Determine status
const determineStatus = (checkInTime, totalHours) => {
    if (!checkInTime) return 'absent';

    const checkIn = new Date(checkInTime);
    const hour = checkIn.getHours();
    const minute = checkIn.getMinutes();

    // Late if after 9:30 AM
    const isLate = hour > 9 || (hour === 9 && minute > 30);

    // Half-day if less than 4 hours
    if (totalHours > 0 && totalHours < 4) return 'half-day';

    return isLate ? 'late' : 'present';
};

// @desc    Check-in
// @route   POST /api/attendance/checkin
// @access  Private (Employee)
export const checkIn = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

        // Check if already checked in today
        const existing = await Attendance.findOne({
            where: {
                userId,
                date: today,
            },
        });

        if (existing && existing.checkInTime) {
            return res.status(400).json({
                success: false,
                message: 'You have already checked in today',
            });
        }

        const checkInTime = new Date();
        const status = determineStatus(checkInTime, 0);

        let attendance;
        if (existing) {
            // Update existing record
            existing.checkInTime = checkInTime;
            existing.status = status;
            attendance = await existing.save();
        } else {
            // Create new record
            attendance = await Attendance.create({
                userId,
                date: today,
                checkInTime,
                status,
            });
        }

        res.status(200).json({
            success: true,
            message: 'Checked in successfully',
            data: attendance,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Check-out
// @route   POST /api/attendance/checkout
// @access  Private (Employee)
export const checkOut = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const today = new Date().toISOString().split('T')[0];

        const attendance = await Attendance.findOne({
            where: {
                userId,
                date: today,
            },
        });

        if (!attendance || !attendance.checkInTime) {
            return res.status(400).json({
                success: false,
                message: 'You must check in first',
            });
        }

        if (attendance.checkOutTime) {
            return res.status(400).json({
                success: false,
                message: 'You have already checked out today',
            });
        }

        const checkOutTime = new Date();
        attendance.checkOutTime = checkOutTime;
        attendance.totalHours = calculateHours(attendance.checkInTime, checkOutTime);
        attendance.status = determineStatus(attendance.checkInTime, attendance.totalHours);

        await attendance.save();

        res.status(200).json({
            success: true,
            message: 'Checked out successfully',
            data: attendance,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get my attendance history (with pagination)
// @route   GET /api/attendance/my-history?page=1&limit=20
// @access  Private (Employee)
export const getMyHistory = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const offset = (page - 1) * limit;

        const { count, rows } = await Attendance.findAndCountAll({
            where: { userId },
            order: [['date', 'DESC']],
            limit,
            offset,
        });

        res.status(200).json({
            success: true,
            data: rows,
            pagination: {
                page,
                limit,
                total: count,
                pages: Math.ceil(count / limit),
            },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get my monthly summary
// @route   GET /api/attendance/my-summary?month=2024-01
// @access  Private (Employee)
export const getMySummary = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { month } = req.query; // Format: YYYY-MM

        let startDate, endDate;
        if (month) {
            const [year, monthNum] = month.split('-');
            startDate = `${year}-${monthNum}-01`;
            // Get last day of month
            const lastDay = new Date(year, monthNum, 0).getDate();
            endDate = `${year}-${monthNum}-${lastDay}`;
        } else {
            // Default to current month
            const now = new Date();
            const year = now.getFullYear();
            const monthNum = String(now.getMonth() + 1).padStart(2, '0');
            startDate = `${year}-${monthNum}-01`;
            const lastDay = new Date(year, monthNum, 0).getDate();
            endDate = `${year}-${monthNum}-${lastDay}`;
        }

        const records = await Attendance.findAll({
            where: {
                userId,
                date: {
                    [Op.between]: [startDate, endDate],
                },
            },
        });

        const summary = {
            present: records.filter((r) => r.status === 'present').length,
            absent: records.filter((r) => r.status === 'absent').length,
            late: records.filter((r) => r.status === 'late').length,
            halfDay: records.filter((r) => r.status === 'half-day').length,
            totalHours: records.reduce((sum, r) => sum + r.totalHours, 0),
            totalDays: records.length,
        };

        res.status(200).json({
            success: true,
            data: summary,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get today's attendance status
// @route   GET /api/attendance/today
// @access  Private (Employee)
export const getTodayStatus = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const today = new Date().toISOString().split('T')[0];

        const attendance = await Attendance.findOne({
            where: {
                userId,
                date: today,
            },
        });

        res.status(200).json({
            success: true,
            data: attendance || null,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all attendance records (Manager)
// @route   GET /api/attendance/all
// @access  Private (Manager)
export const getAllAttendance = async (req, res, next) => {
    try {
        const { employeeId, startDate, endDate, status, department, page = 1, limit = 20 } = req.query;

        let where = {};

        if (employeeId) where.userId = employeeId;
        if (status) where.status = status;

        if (startDate || endDate) {
            where.date = {};
            if (startDate) where.date[Op.gte] = startDate;
            if (endDate) where.date[Op.lte] = endDate;
        }

        // Include User model for filtering by department
        let include = [{
            model: User,
            attributes: ['id', 'name', 'email', 'employeeCode', 'department'],
        }];

        if (department) {
            include[0].where = { department };
        }

        const offset = (parseInt(page) - 1) * parseInt(limit);

        const { count, rows } = await Attendance.findAndCountAll({
            where,
            include,
            order: [['date', 'DESC']],
            limit: parseInt(limit),
            offset,
        });

        res.status(200).json({
            success: true,
            data: rows,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: count,
                pages: Math.ceil(count / parseInt(limit)),
            },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get employee attendance by ID
// @route   GET /api/attendance/employee/:id
// @access  Private (Manager)
export const getEmployeeAttendance = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const { startDate, endDate, page = 1, limit = 20 } = req.query;

        let where = { userId };

        if (startDate || endDate) {
            where.date = {};
            if (startDate) where.date[Op.gte] = startDate;
            if (endDate) where.date[Op.lte] = endDate;
        }

        const offset = (parseInt(page) - 1) * parseInt(limit);

        const { count, rows } = await Attendance.findAndCountAll({
            where,
            include: [{
                model: User,
                attributes: ['id', 'name', 'email', 'employeeCode', 'department'],
            }],
            order: [['date', 'DESC']],
            limit: parseInt(limit),
            offset,
        });

        res.status(200).json({
            success: true,
            data: rows,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: count,
                pages: Math.ceil(count / parseInt(limit)),
            },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get team summary
// @route   GET /api/attendance/summary
// @access  Private (Manager)
export const getTeamSummary = async (req, res, next) => {
    try {
        const totalEmployees = await User.count({ where: { role: 'employee' } });
        const today = new Date().toISOString().split('T')[0];

        const todayRecords = await Attendance.findAll({
            where: {
                date: today,
            },
        });

        const summary = {
            totalEmployees,
            present: todayRecords.filter((r) => r.status === 'present').length,
            absent: totalEmployees - todayRecords.length,
            late: todayRecords.filter((r) => r.status === 'late').length,
            halfDay: todayRecords.filter((r) => r.status === 'half-day').length,
        };

        res.status(200).json({
            success: true,
            data: summary,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get attendance report
// @route   GET /api/attendance/report
// @access  Private (Manager)
export const getAttendanceReport = async (req, res, next) => {
    try {
        console.log('Generating Ticket Report:', req.query);
        const { employeeId, startDate, endDate, department, reportType } = req.query;

        let where = {};
        if (employeeId) where.userId = employeeId;

        if (startDate || endDate) {
            where.date = {};
            if (startDate) where.date[Op.gte] = startDate;
            if (endDate) where.date[Op.lte] = endDate;
        }

        let include = [{
            model: User,
            attributes: ['id', 'name', 'email', 'employeeCode', 'department'],
        }];

        if (department && department !== 'all') {
            include[0].where = { department };
        }

        console.log('Query options:', { where, include });

        const attendance = await Attendance.findAll({
            where,
            include,
            order: [['date', 'DESC']],
        });

        console.log(`Found ${attendance.length} records`);

        // Calculate Summary Stats
        const totalRecords = attendance.length;
        const totalPresent = attendance.filter(r => r.status === 'present').length;
        const totalLate = attendance.filter(r => r.status === 'late').length;
        const totalAbsent = attendance.filter(r => r.status === 'absent').length;
        const totalHalfDay = attendance.filter(r => r.status === 'half-day').length;

        const attendanceRate = totalRecords > 0
            ? (((totalPresent + totalLate + totalHalfDay) / totalRecords) * 100).toFixed(1)
            : 0;

        // Format Detailed Data
        const detailedData = attendance.map(r => ({
            id: r.id,
            date: r.date,
            employeeId: r.User?.id,
            name: r.User?.name || 'Unknown',
            department: r.User?.department || 'Unknown',
            checkIn: r.checkInTime ? new Date(r.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-',
            checkOut: r.checkOutTime ? new Date(r.checkOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-',
            status: r.status,
            totalHours: r.totalHours ? r.totalHours.toFixed(1) : '0',
            present: r.status === 'present' ? 1 : 0,
            late: r.status === 'late' ? 1 : 0,
            absent: r.status === 'absent' ? 1 : 0,
            rate: r.status !== 'absent' ? 100 : 0 // Simplified per-record rate
        }));

        res.status(200).json({
            success: true,
            summary: {
                totalPresent,
                totalLate,
                totalAbsent,
                totalHalfDay,
                attendanceRate
            },
            data: detailedData
        });

    } catch (error) {
        console.error('Error in getAttendanceReport:', error);
        next(error);
    }
};

// @desc    Export attendance to CSV
// @route   GET /api/attendance/export
// @access  Private (Manager)
export const exportAttendance = async (req, res, next) => {
    try {
        const { employeeId, startDate, endDate, status, department } = req.query;

        let where = {};

        if (employeeId) where.userId = employeeId;
        if (status) where.status = status;

        if (startDate || endDate) {
            where.date = {};
            if (startDate) where.date[Op.gte] = startDate;
            if (endDate) where.date[Op.lte] = endDate;
        }

        let include = [{
            model: User,
            attributes: ['id', 'name', 'email', 'employeeCode', 'department'],
        }];

        if (department && department !== 'all') {
            include[0].where = { department };
        }

        const attendance = await Attendance.findAll({
            where,
            include,
            order: [['date', 'DESC']],
        });

        // Format data for CSV
        const data = attendance.map((a) => ({
            Date: a.date,
            EmployeeCode: a.User?.employeeCode || 'N/A',
            Name: a.User?.name || 'N/A',
            Department: a.User?.department || 'N/A',
            CheckIn: a.checkInTime ? new Date(a.checkInTime).toLocaleTimeString() : 'N/A',
            CheckOut: a.checkOutTime ? new Date(a.checkOutTime).toLocaleTimeString() : 'N/A',
            TotalHours: a.totalHours.toFixed(2),
            Status: a.status,
        }));

        const parser = new Parser();
        const csv = parser.parse(data);

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=attendance.csv');
        res.status(200).send(csv);
    } catch (error) {
        next(error);
    }
};

// @desc    Get today's status (who's present)
// @route   GET /api/attendance/today-status
// @access  Private (Manager)
export const getTodayTeamStatus = async (req, res, next) => {
    try {
        const today = new Date().toISOString().split('T')[0];

        const attendance = await Attendance.findAll({
            where: {
                date: today,
                checkInTime: { [Op.ne]: null },
            },
            include: [{
                model: User,
                attributes: ['id', 'name', 'email', 'employeeCode', 'department'],
            }],
        });

        res.status(200).json({
            success: true,
            data: attendance,
        });
    } catch (error) {
        next(error);
    }
};
