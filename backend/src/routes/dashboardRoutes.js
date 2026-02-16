import express from 'express';
import { getEmployeeDashboard, getManagerDashboard } from '../controllers/dashboardController.js';
import { authenticate, authorize } from '../middlewares/auth.js';

const router = express.Router();

router.get('/employee', authenticate, getEmployeeDashboard);
router.get('/manager', authenticate, authorize('manager'), getManagerDashboard);

export default router;
