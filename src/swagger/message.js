/**
 * @swagger
 * components:
 *   schemas:
 *     Message:
 *       type: object
 *       properties:
 *         userId:
 *           type: string
 *           description: ID của người dùng
 *         name:
 *           type: string
 *           description: Tên người dùng
 *         avatar:
 *           type: string
 *           description: URL ảnh đại diện của người dùng
 *         text:
 *           type: string
 *           description: Nội dung tin nhắn
 *
 *     VideoChat:
 *       type: object
 *       properties:
 *         videoId:
 *           type: string
 *           description: ID của video
 *         messages:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Message'
 *
 *     ChapterChat:
 *       type: object
 *       properties:
 *         chapterId:
 *           type: string
 *           description: ID của chương
 *         videos:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/VideoChat'
 *
 *     CourseChat:
 *       type: object
 *       properties:
 *         courseId:
 *           type: string
 *           description: ID của khóa học
 *         chapters:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ChapterChat'
 */

/**
 * @swagger
 * /api/message/postMessage:
 *   post:
 *     summary: Gửi tin nhắn đến video trong khóa học
 *     tags:
 *       - Message
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               courseId:
 *                 type: string
 *                 description: ID của khóa học
 *               chapterId:
 *                 type: string
 *                 description: ID của chương trong khóa học
 *               videoId:
 *                 type: string
 *                 description: ID của video trong chương
 *               userId:
 *                 type: string
 *                 description: ID của người gửi tin nhắn
 *               name:
 *                 type: string
 *                 description: Tên của người gửi
 *               avatar:
 *                 type: string
 *                 description: URL ảnh đại diện của người gửi
 *               text:
 *                 type: string
 *                 description: Nội dung tin nhắn
 *     responses:
 *       201:
 *         description: Tin nhắn đã được gửi thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Yêu cầu không hợp lệ
 *       500:
 *         description: Lỗi máy chủ
 */

/**
 * @swagger
 * /api/message/getMessages:
 *   get:
 *     summary: Lấy danh sách tin nhắn của video trong khóa học
 *     tags:
 *       - Message
 *     parameters:
 *       - in: query
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của khóa học
 *       - in: query
 *         name: chapterId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của chương trong khóa học
 *       - in: query
 *         name: videoId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của video trong chương
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *         description: Số trang muốn lấy
 *         example: 1
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *         description: Số lượng tin nhắn trên mỗi trang
 *     responses:
 *       200:
 *         description: Danh sách tin nhắn được trả về thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 page:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 totalMessages:
 *                   type: integer
 *                 messages:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       userId:
 *                         type: string
 *                       name:
 *                         type: string
 *                       avatar:
 *                         type: string
 *                       text:
 *                         type: string
 *       404:
 *         description: Không tìm thấy khóa học, chương, video, hoặc trang tin nhắn
 *       500:
 *         description: Lỗi máy chủ
 */

/**
 * @swagger
 * /api/message/updateMessage/{courseId}/{chapterId}/{videoId}/{messageId}:
 *   put:
 *     summary: Cập nhật tin nhắn trong video của khóa học
 *     tags:
 *       - Message
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của khóa học
 *       - in: path
 *         name: chapterId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của chương trong khóa học
 *       - in: path
 *         name: videoId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của video trong chương
 *       - in: path
 *         name: messageId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của tin nhắn cần cập nhật
 *       - in: body
 *         name: body
 *         required: true
 *         description: Nội dung cần cập nhật của tin nhắn
 *         schema:
 *           type: object
 *           required:
 *             - userId
 *             - text
 *           properties:
 *             userId:
 *               type: string
 *               description: ID của người dùng cập nhật tin nhắn
 *             text:
 *               type: string
 *               description: Nội dung mới của tin nhắn
 *     responses:
 *       200:
 *         description: Cập nhật tin nhắn thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       403:
 *         description: Người dùng không có quyền
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       404:
 *         description: Không tìm thấy dữ liệu
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */

/**
 * @swagger
 * /api/message/deleteMessage/{courseId}/{chapterId}/{videoId}/{messageId}:
 *   delete:
 *     summary: Xóa tin nhắn trong video của khóa học
 *     tags:
 *       - Message
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của khóa học
 *       - in: path
 *         name: chapterId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của chương trong khóa học
 *       - in: path
 *         name: videoId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của video trong chương
 *       - in: path
 *         name: messageId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của tin nhắn cần xóa
 *       - in: body
 *         name: body
 *         required: true
 *         description: ID của người dùng yêu cầu xóa tin nhắn
 *         schema:
 *           type: object
 *           required:
 *             - userId
 *           properties:
 *             userId:
 *               type: string
 *               description: ID của người dùng
 *     responses:
 *       200:
 *         description: Xóa tin nhắn thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       403:
 *         description: Người dùng không có quyền xóa tin nhắn
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       404:
 *         description: Không tìm thấy dữ liệu
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
