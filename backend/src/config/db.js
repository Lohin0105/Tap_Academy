import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false, // Set to console.log to see SQL queries
    dialectOptions: {
        ssl: {
            rejectUnauthorized: false,
        },
    },
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
});

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ PostgreSQL Connected');

        // Sync models
        await sequelize.sync({ alter: true }); // Use { force: true } to drop tables
        console.log('✅ Models Synced');
    } catch (error) {
        console.error('❌ Error connecting to PostgreSQL:', error.message);
        process.exit(1);
    }
};

export { sequelize, connectDB };
export default connectDB;
