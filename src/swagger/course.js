/**
 * @swagger
 * components:
 *   schemas:
 *     Video:
 *       type: object
 *       properties:
 *         childname:
 *           type: string
 *           description: Tên của video
 *         video:
 *           type: string
 *           description: Đường dẫn video
 *         time:
 *           type: string
 *           description: Thời gian của video
 *         slug:
 *           type: string
 *           description: Slug của video
 *
 *     Chapter:
 *       type: object
 *       properties:
 *         namechapter:
 *           type: string
 *           description: Tiêu đề của chương
 *         videos:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Video'
 *
 *     Course:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           description: Tên của khóa học
 *         description:
 *           type: string
 *           description: Mô tả khóa học
 *         image:
 *           type: string
 *           description: Đường dẫn hình ảnh
 *         video:
 *           type: string
 *           nullable: true
 *           description: Đường dẫn video giới thiệu
 *         chapters:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Chapter'
 *           description: Danh sách các chương trong khóa học
 *         price:
 *           type: string
 *           enum: ['free', 'paid']
 *           description: Loại khóa học (miễn phí hoặc có phí)
 *         priceAmount:
 *           type: number
 *           description: Số tiền cho khóa học nếu có phí
 *         slug:
 *           type: string
 *           description: Slug của khóa học
 *         view:
 *           type: number
 *           default: 0
 *           description: Số lượt xem
 *         totalVideos:
 *           type: number
 *           default: 0
 *           description: Tổng số video trong khóa học
 *         totalTime:
 *           type: string
 *           description: Tổng thời gian của khóa học
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

/**
 * @swagger
 * /api/course/update-courses/{id}:
 *   put:
 *     summary: Cập nhật khóa học
 *     description: Cập nhật một khóa học. Chỉ dành cho admin.
 *     tags: [Course]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: id của khóa học
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Course'
 *     responses:
 *       200:
 *         description: Khóa học cập nhật thành công
 *       401:
 *         description: Token không hợp lệ
 *       403:
 *         description: Không có quyền (chỉ admin)
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       404:
 *         description: Khóa học không tồn tại
 */

/**
 * @swagger
 * /api/course/delete-courses/{id}:
 *   delete:
 *     summary: Xóa khóa học
 *     description: Xóa một khóa học. Chỉ dành cho admin.
 *     tags: [Course]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: id của khóa học
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 type: string
 *                 description: id của khóa học
 *     responses:
 *       200:
 *         description: Khóa học xóa thành công
 *       401:
 *         description: Token không hợp lệ
 *       403:
 *         description: Không có quyền (chỉ admin)
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       404:
 *         description: Khóa học không tồn tại
 */