import express from 'express';
import { AuthMiddleware, CacheMiddleware } from '../middlewares/index.js';
import VideoSDKController from '../controllers/videosdk.controller.js';
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     ZoomRoom:
 *       type: object
 *       required:
 *         - userIdZoom
 *         - title
 *         - startTime
 *         - endTime
 *         - permissions
 *       properties:
 *         id:
 *           type: string
 *           description: ID của phòng Zoom
 *         userIdZoom:
 *           type: string
 *           description: ID người dùng Zoom
 *         title:
 *           type: string
 *           description: Tiêu đề phòng Zoom
 *         startTime:
 *           type: string
 *           format: date-time
 *           description: Thời gian bắt đầu phòng Zoom
 *         endTime:
 *           type: string
 *           format: date-time
 *           description: Thời gian kết thúc phòng Zoom
 *         token:
 *           type: string
 *           description: Token xác thực cho phòng Zoom
 *         roomDetails:
 *           type: object
 *           description: Thông tin chi tiết về phòng Zoom
 *         permissions:
 *           type: array
 *           items:
 *             type: string
 *           description: Danh sách ID sinh viên được phép tham gia phòng Zoom
 *         status:
 *           type: string
 *           description: Trạng thái phòng Zoom (not_started, in_progress, ended)
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Thời gian tạo phòng Zoom
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Thời gian cập nhật phòng Zoom
 */

/**
 * @swagger
 * /api/videosdk/create-room:
 *   post:
 *     summary: Tạo phòng Zoom
 *     tags: [VideoSDK]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - startTime
 *               - endTime
 *               - userIdZoom
 *               - permissions
 *             properties:
 *               title:
 *                 type: string
 *                 description: Tiêu đề của phòng Zoom
 *               startTime:
 *                 type: string
 *                 format: date-time
 *                 description: Thời gian bắt đầu phòng Zoom
 *               endTime:
 *                 type: string
 *                 format: date-time
 *                 description: Thời gian kết thúc phòng Zoom
 *               userIdZoom:
 *                 type: string
 *                 description: ID của người dùng Zoom
 *               permissions:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Danh sách ID sinh viên được phép tham gia
 *     responses:
 *       200:
 *         description: Phòng Zoom đã được tạo và lưu thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   description: Mã trạng thái phản hồi
 *                 message:
 *                   type: string
 *                   description: Thông điệp thành công
 *       400:
 *         description: Lỗi khi tạo phòng Zoom
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   description: Mã trạng thái phản hồi
 *                 message:
 *                   type: string
 *                   description: Thông điệp lỗi
 *       500:
 *         description: Lỗi máy chủ nội bộ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   description: Mã trạng thái phản hồi
 *                 message:
 *                   type: string
 *                   description: Thông điệp lỗi
 */
router.post('/create-room', AuthMiddleware.authUser, VideoSDKController.createRoomZoom);
/**
 * @swagger
 * /api/videosdk/show-user-teacher-zoom/{userIdZoom}:
 *   get:
 *     summary: Hiển thị phòng Zoom của giáo viên
 *     tags: [VideoSDK]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userIdZoom
 *         required: true
 *         description: ID của giáo viên Zoom
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Danh sách phòng Zoom của giáo viên đã được lấy thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   description: Mã trạng thái phản hồi
 *                 message:
 *                   type: string
 *                   description: Thông điệp thành công
 *                 data:
 *                   type: object
 *                   properties:
 *                     rooms:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/ZoomRoom'
 *                     teacher:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           description: ID giáo viên
 *                         name:
 *                           type: string
 *                           description: Tên giáo viên
 *                         avatar:
 *                           type: string
 *                           description: Đường dẫn hình ảnh đại diện của giáo viên
 *       404:
 *         description: Không tìm thấy phòng cho giáo viên
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   description: Mã trạng thái phản hồi
 *                 message:
 *                   type: string
 *                   description: Thông điệp lỗi
 *       500:
 *         description: Lỗi máy chủ nội bộ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   description: Mã trạng thái phản hồi
 *                 message:
 *                   type: string
 *                   description: Thông điệp lỗi
 */
router.get(
  '/show-user-teacher-zoom/:userIdZoom',
  AuthMiddleware.authUser,
  CacheMiddleware.getCache,
  VideoSDKController.showUserTeacherZoom
);
/**
 * @swagger
 * /api/videosdk/show-user-student-zoom/{userIdZoom}:
 *   get:
 *     summary: Hiển thị phòng Zoom của sinh viên
 *     tags: [VideoSDK]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userIdZoom
 *         required: true
 *         description: ID của sinh viên Zoom
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Danh sách phòng Zoom của sinh viên đã được lấy thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   description: Mã trạng thái phản hồi
 *                 message:
 *                   type: string
 *                   description: Thông điệp thành công
 *                 data:
 *                   type: object
 *                   properties:
 *                     rooms:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/ZoomRoom'
 *       404:
 *         description: Không tìm thấy phòng cho sinh viên
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   description: Mã trạng thái phản hồi
 *                 message:
 *                   type: string
 *                   description: Thông điệp lỗi
 *       500:
 *         description: Lỗi máy chủ nội bộ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   description: Mã trạng thái phản hồi
 *                 message:
 *                   type: string
 *                   description: Thông điệp lỗi
 */
router.get(
  '/show-user-student-zoom/:userIdZoom',
  AuthMiddleware.authUser,
  CacheMiddleware.getCache,
  VideoSDKController.showUserStudentZoom
);
/**
 * @swagger
 * /api/videosdk/show-user-student-zoom/{userIdZoom}:
 *   get:
 *     summary: Lấy thông tin người dùng sinh viên trong phòng Zoom
 *     tags: [VideoSDK]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userIdZoom
 *         required: true
 *         description: ID của người dùng sinh viên trong phòng Zoom
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Thông tin người dùng sinh viên trong phòng Zoom
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   description: Mã trạng thái phản hồi
 *                 data:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: string
 *                       description: ID của người dùng
 *                     name:
 *                       type: string
 *                       description: Tên của người dùng
 *                     email:
 *                       type: string
 *                       description: Địa chỉ email của người dùng
 *                     zoomRoomId:
 *                       type: string
 *                       description: ID của phòng Zoom mà người dùng đang tham gia
 *       404:
 *         description: Không tìm thấy người dùng sinh viên trong phòng Zoom
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   description: Mã trạng thái phản hồi
 *                 message:
 *                   type: string
 *                   description: Thông điệp lỗi
 *       500:
 *         description: Lỗi máy chủ nội bộ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   description: Mã trạng thái phản hồi
 *                 message:
 *                   type: string
 *                   description: Thông điệp lỗi
 */
router.get(
  '/show-details-zoom/:idRoom',
  AuthMiddleware.authUser,
  CacheMiddleware.getCache,
  VideoSDKController.showDetailZoom
);
/**
 * @swagger
 * /api/videosdk/update-zoom/{id}:
 *   put:
 *     summary: Cập nhật thông tin phòng Zoom
 *     tags: [VideoSDK]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của phòng Zoom cần cập nhật
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Tiêu đề của phòng Zoom
 *               startTime:
 *                 type: string
 *                 format: date-time
 *                 description: Thời gian bắt đầu phòng Zoom
 *               endTime:
 *                 type: string
 *                 format: date-time
 *                 description: Thời gian kết thúc phòng Zoom
 *               permissions:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Danh sách ID sinh viên được phép tham gia
 *     responses:
 *       200:
 *         description: Phòng Zoom đã được cập nhật thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   description: Mã trạng thái phản hồi
 *                 message:
 *                   type: string
 *                   description: Thông điệp thành công
 *       404:
 *         description: Không tìm thấy phòng Zoom
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   description: Mã trạng thái phản hồi
 *                 message:
 *                   type: string
 *                   description: Thông điệp lỗi
 *       500:
 *         description: Lỗi máy chủ nội bộ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   description: Mã trạng thái phản hồi
 *                 message:
 *                   type: string
 *                   description: Thông điệp lỗi
 */
router.put('/update-zoom/:id', AuthMiddleware.authUser, VideoSDKController.updateRoom);
/**
 * @swagger
 * /api/videosdk/delete-zoom/{id}:
 *   delete:
 *     summary: Xóa phòng Zoom
 *     tags: [VideoSDK]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của phòng Zoom cần xóa
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Phòng Zoom đã được xóa thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   description: Mã trạng thái phản hồi
 *                 message:
 *                   type: string
 *                   description: Thông điệp thành công
 *       404:
 *         description: Không tìm thấy phòng Zoom
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   description: Mã trạng thái phản hồi
 *                 message:
 *                   type: string
 *                   description: Thông điệp lỗi
 *       500:
 *         description: Lỗi máy chủ nội bộ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   description: Mã trạng thái phản hồi
 *                 message:
 *                   type: string
 *                   description: Thông điệp lỗi
 */
router.delete('/delete-zoom/:id', AuthMiddleware.authUser, VideoSDKController.deleteRoom);
export default router;
