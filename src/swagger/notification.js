/**
 * @swagger
 * components:
 *   schemas:
 *     Notification:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           description: Tiêu đề của thông báo.
 *         content:
 *           type: string
 *           description: Nội dung của thông báo.
 *         icon:
 *           type: string
 *           description: URL hoặc tên biểu tượng của thông báo.
 *       required:
 *         - title
 *         - content
 */

/**
 * @swagger
 * /api/notification/dashboard:
 *   get:
 *     summary: Lấy danh sách thông báo cho dashboard
 *     description: Xem tất cả thông báo với các tùy chọn phân trang và lọc
 *     tags: [Notification]
 *     parameters:
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *       - in: query
 *         name: sort
 *         required: false
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *       - in: query
 *         name: filter
 *         required: false
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *     responses:
 *       200:
 *         description: Lấy thông báo thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Notification'
 *                 total:
 *                   type: integer
 *                 pageCurrent:
 *                   type: integer
 *                 totalPage:
 *                   type: integer
 *       500:
 *         description: Lỗi máy chủ
 */

/**
 * @swagger
 * /api/notification/modal:
 *   get:
 *     summary: Lấy danh sách thông báo cho modal
 *     description: Xem tất cả thông báo với các tùy chọn phân trang và lọc cho modal
 *     tags: [Notification]
 *     parameters:
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *       - in: query
 *         name: sort
 *         required: false
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *       - in: query
 *         name: filter
 *         required: false
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *     responses:
 *       200:
 *         description: Lấy danh sách thông báo thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Notification'
 *                 total:
 *                   type: integer
 *                 pageCurrent:
 *                   type: integer
 *                 totalPage:
 *                   type: integer
 *       400:
 *         description: Tham số không hợp lệ
 *       500:
 *         description: Lỗi máy chủ
 */

/**
 * @swagger
 * /api/notification:
 *   post:
 *     summary: Tạo thông báo mới
 *     description: Tạo thông báo mới và gửi đến người dùng. Cần quyền admin.
 *     tags: [Notification]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              $ref: '#/components/schemas/Notification'
 *     responses:
 *       200:
 *         description: Gửi thông báo thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       401:
 *         description: Không có quyền truy cập (cần quyền admin)
 *       500:
 *         description: Lỗi máy chủ
 */

/**
 * @swagger
 * /api/notification/{id}:
 *   delete:
 *     summary: Xóa thông báo
 *     description: Xóa thông báo theo ID. Cần quyền admin.
 *     tags: [Notification]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Xóa thông báo thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *       401:
 *         description: Không có quyền truy cập (cần quyền admin)
 *       404:
 *         description: Thông báo không tồn tại
 *       500:
 *         description: Lỗi máy chủ
 */

/**
 * @swagger
 * /api/notification:
 *   delete:
 *     summary: Xóa tất cả thông báo
 *     description: Xóa tất cả thông báo trong cơ sở dữ liệu. Cần quyền admin.
 *     tags: [Notification]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Xóa tất cả thông báo thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *       401:
 *         description: Không có quyền truy cập (cần quyền admin)
 *       500:
 *         description: Lỗi máy chủ
 */
