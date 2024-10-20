import express from 'express';
import CourseController from '../controllers/course.controller.js';
import { AuthMiddleware, passportMiddleware, CacheMiddleware } from '../middlewares/index.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Course:
 *       type: object
 *       required:
 *         - name
 *         - description
 *       properties:
 *         id:
 *           type: string
 *           description: ID khóa học
 *         name:
 *           type: string
 *           description: Tên khóa học
 *         slug:
 *           type: string
 *           description: Đường dẫn duy nhất của khóa học
 *         description:
 *           type: string
 *           description: Mô tả khóa học
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Thời gian tạo khóa học
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Thời gian cập nhật khóa học
 */

/**
 * @swagger
 * /api/course/all-courses:
 *   get:
 *     summary: Lấy tất cả các khóa học
 *     description: Lấy danh sách tất cả các khóa học có trong hệ thống.
 *     tags: [Course]
 *     responses:
 *       200:
 *         description: Thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Course'
 */
router.get('/all-courses', CacheMiddleware.getCache, CourseController.index);

/**
 * @swagger
 * /api/course/detail-courses/not-login/{slug}:
 *   get:
 *     summary: Lấy chi tiết khóa học (không cần đăng nhập)
 *     description: Lấy thông tin chi tiết của một khóa học dựa trên slug mà không yêu cầu đăng nhập.
 *     tags: [Course]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Slug của khóa học
 *     responses:
 *       200:
 *         description: Thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Course'
 *       404:
 *         description: Khóa học không tồn tại
 */
router.get('/detail-courses/not-login/:slug', CacheMiddleware.getCache, CourseController.get);

/**
 * @swagger
 * /api/course/detail-courses/{slug}:
 *   get:
 *     summary: Lấy chi tiết khóa học (yêu cầu đăng nhập)
 *     description: Lấy thông tin chi tiết của một khóa học dựa trên slug, yêu cầu đăng nhập.
 *     tags: [Course]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Slug của khóa học
 *     responses:
 *       200:
 *         description: Thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Course'
 *       401:
 *         description: Không có quyền truy cập (chưa đăng nhập)
 *       404:
 *         description: Khóa học không tồn tại
 */
router.get('/detail-courses/:slug', passportMiddleware, CacheMiddleware.getCache, CourseController.get);

/**
 * @swagger
 * /api/course/create-courses:
 *   post:
 *     summary: Tạo khóa học mới
 *     description: Tạo mới một khóa học. Chỉ dành cho admin.
 *     tags: [Course]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Course'
 *     responses:
 *       201:
 *         description: Khóa học được tạo thành công
 *       403:
 *         description: Không có quyền truy cập (chỉ admin)
 *       400:
 *         description: Dữ liệu không hợp lệ
 */
router.post('/create-courses', AuthMiddleware.authAdmin, CourseController.add);
router.put('/update-courses/:id', AuthMiddleware.authAdmin, CourseController.update);
router.delete('/delete-courses/:id', AuthMiddleware.authAdmin, CourseController.delete);

export default router;
