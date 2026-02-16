import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import User from './User.js';

const Attendance = sequelize.define('Attendance', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        },
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    checkInTime: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    checkOutTime: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    status: {
        type: DataTypes.ENUM('present', 'absent', 'late', 'half-day'),
        defaultValue: 'absent',
    },
    totalHours: {
        type: DataTypes.FLOAT, // Use FLOAT for hours
        defaultValue: 0,
    },
}, {
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: ['userId', 'date'],
        },
    ],
});

// Setup relationships
User.hasMany(Attendance, { foreignKey: 'userId' });
Attendance.belongsTo(User, { foreignKey: 'userId' });

export default Attendance;
