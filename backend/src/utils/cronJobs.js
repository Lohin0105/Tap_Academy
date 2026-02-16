import cron from 'node-cron';
import User from '../models/User.js';
import Attendance from '../models/Attendance.js';
import { Op } from 'sequelize';

// Helper: Get start of day
const getStartOfDay = (date = new Date()) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
};

// Auto-mark absent for employees who didn't check in
export const autoMarkAbsent = () => {
    // Run every day at 00:05 AM
    cron.schedule('5 0 * * *', async () => {
        try {
            console.log('🕐 Running auto-mark absent cron job...');

            const yesterday = getStartOfDay();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toISOString().split('T')[0];

            // Get all employees
            const employees = await User.findAll({ where: { role: 'employee' } });

            // Get yesterday's attendance records
            const yesterdayRecords = await Attendance.findAll({
                where: { date: yesterdayStr },
            });
            const recordedUserIds = yesterdayRecords.map((r) => r.userId);

            // Find employees who didn't check in
            const absentEmployees = employees.filter(
                (emp) => !recordedUserIds.includes(emp.id)
            );

            // Create absent records
            if (absentEmployees.length > 0) {
                const absentRecords = absentEmployees.map((emp) => ({
                    userId: emp.id,
                    date: yesterdayStr,
                    status: 'absent',
                    checkInTime: null,
                    checkOutTime: null,
                    totalHours: 0,
                }));

                await Attendance.bulkCreate(absentRecords);
                console.log(`✅ Marked ${absentRecords.length} employees as absent for ${yesterdayStr}`);
            } else {
                console.log('✅ All employees had attendance records for yesterday');
            }
        } catch (error) {
            console.error('❌ Error in auto-mark absent cron:', error);
        }
    });

    console.log('✅ Cron job scheduled: Auto-mark absent at 00:05 AM daily');
};
