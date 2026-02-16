import dotenv from 'dotenv';
import { sequelize } from './src/config/db.js';
import User from './src/models/User.js';
import Attendance from './src/models/Attendance.js';

dotenv.config();

// Helper: Get date N days ago (YYYY-MM-DD)
const getDaysAgo = (n) => {
    const date = new Date();
    date.setDate(date.getDate() - n);
    return date.toISOString().split('T')[0];
};

// Helper: Random number between min and max
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const seedData = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Connected to PostgreSQL');

        // Sync models and drop existing tables
        await sequelize.sync({ force: true });
        console.log('🗑️  Dropped and re-synced items...');

        console.log('👥 Creating users...');

        // Create 2 managers
        const managers = await User.bulkCreate([
            {
                name: 'John Manager',
                email: 'john.manager@company.com',
                password: 'password123',
                employeeCode: 'MGR001',
                department: 'Engineering',
                role: 'manager',
            },
            {
                name: 'Sarah Admin',
                email: 'sarah.admin@company.com',
                password: 'password123',
                employeeCode: 'MGR002',
                department: 'HR',
                role: 'manager',
            },
        ], { individualHooks: true }); // Enable hooks to hash password

        // Create 10 employees across 3 departments
        const employees = await User.bulkCreate([
            {
                name: 'Alice Johnson',
                email: 'alice.johnson@company.com',
                password: 'password123',
                employeeCode: 'EMP001',
                department: 'Engineering',
                role: 'employee',
            },
            {
                name: 'Bob Smith',
                email: 'bob.smith@company.com',
                password: 'password123',
                employeeCode: 'EMP002',
                department: 'Engineering',
                role: 'employee',
            },
            {
                name: 'Charlie Davis',
                email: 'charlie.davis@company.com',
                password: 'password123',
                employeeCode: 'EMP003',
                department: 'Engineering',
                role: 'employee',
            },
            {
                name: 'Diana Prince',
                email: 'diana.prince@company.com',
                password: 'password123',
                employeeCode: 'EMP004',
                department: 'Sales',
                role: 'employee',
            },
            {
                name: 'Ethan Hunt',
                email: 'ethan.hunt@company.com',
                password: 'password123',
                employeeCode: 'EMP005',
                department: 'Sales',
                role: 'employee',
            },
            {
                name: 'Fiona Green',
                email: 'fiona.green@company.com',
                password: 'password123',
                employeeCode: 'EMP006',
                department: 'Sales',
                role: 'employee',
            },
            {
                name: 'George Wilson',
                email: 'george.wilson@company.com',
                password: 'password123',
                employeeCode: 'EMP007',
                department: 'HR',
                role: 'employee',
            },
            {
                name: 'Hannah Lee',
                email: 'hannah.lee@company.com',
                password: 'password123',
                employeeCode: 'EMP008',
                department: 'HR',
                role: 'employee',
            },
            {
                name: 'Ian Brown',
                email: 'ian.brown@company.com',
                password: 'password123',
                employeeCode: 'EMP009',
                department: 'Marketing',
                role: 'employee',
            },
            {
                name: 'Julia White',
                email: 'julia.white@company.com',
                password: 'password123',
                employeeCode: 'EMP010',
                department: 'Marketing',
                role: 'employee',
            },
        ], { individualHooks: true });

        console.log(`✅ Created ${managers.length} managers and ${employees.length} employees`);

        console.log('📅 Creating attendance records for last 30 days...');

        const attendanceRecords = [];

        for (let day = 1; day <= 30; day++) {
            const dateStr = getDaysAgo(day);
            const dateObj = new Date(dateStr);

            // Skip weekends
            const dayOfWeek = dateObj.getDay();
            if (dayOfWeek === 0 || dayOfWeek === 6) continue;

            for (const employee of employees) {
                // 85% chance of attendance
                const isPresent = Math.random() > 0.15;

                if (isPresent) {
                    // Random check-in time between 8:00 AM and 10:30 AM
                    const checkInHour = randomInt(8, 10);
                    const checkInMinute = checkInHour === 10 ? randomInt(0, 30) : randomInt(0, 59);
                    const checkInTime = new Date(dateStr);
                    checkInTime.setHours(checkInHour, checkInMinute, 0, 0);

                    // Random check-out time between 5:00 PM and 7:00 PM
                    const checkOutHour = randomInt(17, 19);
                    const checkOutMinute = randomInt(0, 59);
                    const checkOutTime = new Date(dateStr);
                    checkOutTime.setHours(checkOutHour, checkOutMinute, 0, 0);

                    // Calculate hours
                    const totalHours = (checkOutTime - checkInTime) / (1000 * 60 * 60);

                    // Determine status
                    let status = 'present';
                    if (totalHours < 4) {
                        status = 'half-day';
                    } else if (checkInHour > 9 || (checkInHour === 9 && checkInMinute > 30)) {
                        status = 'late';
                    }

                    attendanceRecords.push({
                        userId: employee.id,
                        date: dateStr,
                        checkInTime,
                        checkOutTime,
                        totalHours,
                        status,
                    });
                } else {
                    // Absent
                    attendanceRecords.push({
                        userId: employee.id,
                        date: dateStr,
                        status: 'absent',
                        totalHours: 0,
                    });
                }
            }
        }

        await Attendance.bulkCreate(attendanceRecords);
        console.log(`✅ Created ${attendanceRecords.length} attendance records`);

        console.log('\n🎉 Database seeded successfully!');
        console.log('\n📝 Sample Login Credentials:');
        console.log('┌─────────────────────────────────────────┐');
        console.log('│ Manager:                                │');
        console.log('│   Email: john.manager@company.com       │');
        console.log('│   Password: password123                 │');
        console.log('│                                         │');
        console.log('│ Employee:                               │');
        console.log('│   Email: alice.johnson@company.com      │');
        console.log('│   Password: password123                 │');
        console.log('└─────────────────────────────────────────┘');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seedData();
