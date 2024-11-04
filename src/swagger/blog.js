/**
 * @swagger
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       required:
 *         - userId
 *         - title
 *         - content
 *       properties:
 *         userId:
 *           type: string
 *           description: ID của người dùng đăng bài viết.
 *         title:
 *           type: string
 *           description: Tiêu đề của bài viết.
 *         content:
 *           type: string
 *           description: Nội dung chi tiết của bài viết.
 *         tag:
 *           type: string
 *           description: Tag hoặc danh mục của bài viết.
 *         isConfirmed:
 *           type: boolean
 *           description: Trạng thái xác nhận của bài viết.
 *         slug:
 *           type: string
 *           description: Chuỗi slug được tạo tự động từ tiêu đề bài viết.
 */

/**
 * @swagger
 * /api/blog/all-posts:
 *   get:
 *     summary: Lấy danh sách tất cả bài đăng
 *     tags:
 *       - Blog
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: filter
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *       - in: query
 *         name: sort
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *       - in: query
 *         name: isAdmin
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: Xem tất cả bài đăng thành công
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
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Post'
 *                 total:
 *                   type: integer
 *                 pageCurrent:
 *                   type: integer
 *                   example: 0
 *                 totalPage:
 *                   type: integer
 *       500:
 *         description: Lỗi máy chủ
 */

/**
 * @swagger
 * /api/blog/detail-post/{slug}:
 *   get:
 *     summary: Lấy chi tiết bài đăng theo slug
 *     tags:
 *       - Blog
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Trả về chi tiết bài đăng
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
 *                   $ref: '#/components/schemas/Post'
 *       500:
 *         description: Lỗi máy chủ
 */

/**
 * @swagger
 * /api/blog/create-post:
 *   post:
 *     summary: Tạo bài đăng mới (yêu cầu đăng nhập)
 *     tags:
 *       - Blog
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Post'
 *             required:
 *               - title
 *               - content
 *     responses:
 *       200:
 *         description: Bài đăng được tạo thành công
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
 *                   $ref: '#/components/schemas/Post'
 *       401:
 *         description: Không có quyền (chưa đăng nhập)
 *       500:
 *         description: Lỗi máy chủ
 */

/**
 * @swagger
 * /api/blog/update-post/{id}:
 *   put:
 *     summary: Cập nhật bài đăng theo ID (yêu cầu đăng nhập)
 *     tags:
 *       - Blog
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của bài đăng cần cập nhật
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               tag:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cập nhật bài đăng thành công
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
 *                   $ref: '#/components/schemas/Post'
 *       500:
 *         description: Lỗi máy chủ
 */

/**
 * @swagger
 * /api/blog/delete-post/{id}:
 *   delete:
 *     summary: Xóa bài đăng theo ID (yêu cầu đăng nhập)
 *     tags:
 *       - Blog
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của bài đăng cần xóa
 *     responses:
 *       200:
 *         description: Xóa bài đăng thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *       500:
 *         description: Lỗi máy chủ
 */

/**
 * @swagger
 * /api/blog/all-posts/admin:
 *   get:
 *     summary: Xem tất cả bài đăng (Chỉ dành cho Admin)
 *     tags:
 *       - Blog
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: filter
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *       - in: query
 *         name: sort
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *     responses:
 *       200:
 *         description: Trả về danh sách tất cả bài đăng
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
 *                     $ref: '#/components/schemas/Post'
 *                 total:
 *                   type: integer
 *                 pageCurrent:
 *                   type: integer
 *                 totalPage:
 *                   type: integer
 *       403:
 *         description: Không có quyền truy cập
 *       500:
 *         description: Lỗi máy chủ
 */

/**
 * @swagger
 * /api/blog/confirm-post/{id}:
 *   patch:
 *     summary: Xác nhận bài đăng (Yêu cầu quyền admin)
 *     tags:
 *       - Blog
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của bài đăng cần xác nhận
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isConfirmed:
 *                 type: boolean
 *             required:
 *               - isConfirmed
 *     responses:
 *       200:
 *         description: Đã xác nhận bài đăng thành công
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
 *                   $ref: '#/components/schemas/Post'
 *       403:
 *         description: Không có quyền
 *       500:
 *         description: Lỗi máy chủ
 */
