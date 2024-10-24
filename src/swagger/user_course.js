/**
 * @swagger
 * components:
 *   schemas:
 *     Note:
 *       type: object
 *       properties:
 *         time:
 *           type: string
 *           description: Thời gian ghi chú
 *         title:
 *           type: string
 *           description: Tiêu đề của ghi chú
 *         content:
 *           type: string
 *           description: Nội dung ghi chú
 *       required:
 *         - time
 *         - title
 *         - content
 *
 *     VideoStatus:
 *       type: object
 *       properties:
 *         videoId:
 *           type: string
 *           description: ID của video
 *         status:
 *           type: string
 *           enum: [not_started, in_progress, completed]
 *           default: not_started
 *           description: Trạng thái của video
 *         progress:
 *           type: number
 *           description: Tiến độ video
 *         notes:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Note'
 *       required:
 *         - videoId
 *
 *     ChapterStatus:
 *       type: object
 *       properties:
 *         chapterId:
 *           type: string
 *           description: ID của chương
 *         videos:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/VideoStatus'
 *       required:
 *         - chapterId
 *
 *     UserCourse:
 *       type: object
 *       properties:
 *         userId:
 *           type: string
 *           description: ID của người dùng
 *         courseId:
 *           type: string
 *           description: ID của tiến độ học tập
 *         chapters:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ChapterStatus'
 *       required:
 *         - userId
 *         - user-courseId
 */

/**
 * @swagger
 * /api/user-course/start-course:
 *   post:
 *     summary: Lấy tiến độ học tập hoặc tạo mới nếu chưa có
 *     description: Lấy tiến độ học tập của người dùng cho một khóa học hoặc tạo mới nếu chưa có
 *     tags: [UserCourse]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID người dùng
 *               courseId:
 *                 type: string
 *                 description: ID khóa học
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 data:
 *                   $ref: '#/components/schemas/UserCourse'
 *                 message:
 *                   type: string
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       401:
 *         description: Không có quyền truy cập (chưa đăng nhập)
 *       500:
 *         description: Lỗi máy chủ
 */

/**
 * @swagger
 * /api/user-course/update-progress:
 *   post:
 *     summary: Cập nhật tiến độ học tập
 *     description: Cập nhật tiến độ học tập của khóa học đang theo dõi
 *     tags: [UserCourse]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: string
 *                   description: ID người dùng
 *                 courseId:
 *                   type: string
 *                   description: ID khóa học
 *                 videoId:
 *                   type: string
 *                   description: ID video
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 data:
 *                   $ref: '#/components/schemas/UserCourse'
 *                 message:
 *                   type: string
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       401:
 *         description: Không có quyền truy cập (chưa đăng nhập)
 *       500:
 *         description: Lỗi máy chủ
 */

/**
 * @swagger
 * /api/user-course/course-progress:
 *   get:
 *     summary: Lấy tiến độ học tập của người dùng
 *     description: Trả về danh sách các khóa học cùng với tiến độ học tập của người dùng cho từng khóa.
 *     tags: [UserCourse]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       course:
 *                         type: object
 *                         description: Thông tin khóa học và tiến độ
 *                         properties:
 *                           name:
 *                             type: string
 *                           slug:
 *                             type: string
 *                           image:
 *                             type: string
 *                           totalVideos:
 *                             type: integer
 *                           progress:
 *                             type: integer
 *                 message:
 *                   type: string
 *       401:
 *         description: Không có quyền truy cập (chưa đăng nhập)
 *       500:
 *         description: Lỗi máy chủ
 */

/**
 * @swagger
 * /api/user-course/update-note:
 *   put:
 *     summary: Cập nhật ghi chú cho video trong khóa học
 *     description: Cập nhật danh sách ghi chú của một video cụ thể trong khóa học của người dùng.
 *     tags: [UserCourse]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               courseId:
 *                 type: string
 *               videoId:
 *                 type: string
 *               notes:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Note'
 *     responses:
 *       200:
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
 *                   $ref: '#/components/schemas/UserCourse'
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       401:
 *         description: Không có quyền truy cập (chưa đăng nhập)
 *       500:
 *         description: Lỗi máy chủ
 */

/**
 * @swagger
 * /api/user-course/create-note:
 *   post:
 *     summary: Tạo mới ghi chú cho video trong khóa học
 *     description: Thêm một ghi chú mới cho video cụ thể trong khóa học của người dùng.
 *     tags: [UserCourse]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               courseId:
 *                 type: string
 *               videoId:
 *                 type: string
 *               notes:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Note'
 *     responses:
 *       200:
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
 *                   $ref: '#/components/schemas/UserCourse'
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       401:
 *         description: Không có quyền truy cập (chưa đăng nhập)
 *       500:
 *         description: Lỗi máy chủ
 */

/**
 * @swagger
 * /api/user-course/all-note:
 *   post:
 *     summary: Lấy tất cả ghi chú từ một video trong khóa học
 *     description: Lấy danh sách các ghi chú từ video của chương hiện tại và chương tiếp theo, có hỗ trợ sắp xếp và phân trang.
 *     tags: [UserCourse]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               courseId:
 *                 type: string
 *               videoId:
 *                 type: string
 *               currentChapter:
 *                 type: integer
 *               nextChapter:
 *                 type: integer
 *               sortOrder:
 *                 type: string
 *               page:
 *                 type: integer
 *               limit:
 *                 type: integer
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *                 currentPage:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 totalNotes:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Note'
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       401:
 *         description: Không có quyền truy cập (chưa đăng nhập)
 *       500:
 *         description: Lỗi máy chủ
 */
