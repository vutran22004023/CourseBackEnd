import express from 'express';
import getAnalyticCourse from '../controllers/analytic.controller.js';
import { AuthMiddleware, passportMiddleware } from '../middlewares/index.js';
const router = express.Router();

router.get('/', AuthMiddleware.authAdmin, getAnalyticCourse.getAnalyticCourse);
router.get('/get-monthly-earnings', AuthMiddleware.authUser, getAnalyticCourse.getMonthlyEarnings);
router.get('/get-teacher-payment-status', AuthMiddleware.authUser, getAnalyticCourse.getMonthlyEarnings);
export default router;
