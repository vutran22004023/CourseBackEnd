/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *         - status
 *       properties:
 *         name:
 *           type: string
 *           description: Tên người dùng
 *         email:
 *           type: string
 *           description: Địa chỉ email
 *         password:
 *           type: string
 *           description: Mật khẩu người dùng
 *           format: password
 *         isAdmin:
 *           type: boolean
 *           description: Người dùng có phải là admin không
 *           default: false
 *         role:
 *           type: string
 *           enum: ['student', 'teacher']
 *           description: Vai trò của người dùng (học sinh hoặc giáo viên)
 *         status:
 *           type: boolean
 *           description: Trạng thái hoạt động của người dùng
 *           default: false
 *         avatar:
 *           type: string
 *           nullable: true
 *           description: Đường dẫn ảnh đại diện
 *         point:
 *           type: number
 *           description: Điểm tích lũy của người dùng
 *           default: 0
 *       example:
 *         name: "Nguyen A"
 *         email: "example@example.com"
 *         password: "test123"
 *         isAdmin: false
 *         role: "student"
 *         status: true
 *         avatar: "https://example.com/avatar.png"
 *         point: 0
 */

/**
 * @swagger
 * /api/user/get-all-users:
 *   get:
 *     summary: Lấy tất cả các người dùng (yêu cầu đăng nhập)
 *     description: Lấy danh sách tất cả các người dùng có trong hệ thống (dành cho admin).
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       403:
 *         description: Không có quyền truy cập (chỉ admin)
 */

/**
 * @swagger
 * /api/user/get-detail-user/{id}:
 *   get:
 *     summary: Lấy chi tiết người dùng (yêu cầu đăng nhập)
 *     description: Lấy thông tin chi tiết của một người dùng dựa trên id, yêu cầu đăng nhập.
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: id của người dùng
 *     responses:
 *       200:
 *         description: Thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Không có quyền truy cập (chưa đăng nhập)
 *       404:
 *         description: Người dùng không tồn tại
 */

/**
 * @swagger
 * /api/user/create-user:
 *   post:
 *     summary: Tạo người dùng mới (yêu cầu đăng nhập)
 *     description: Tạo mới một người dùng. Chỉ dành cho admin.
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: Người dùng được tạo thành công
 *       403:
 *         description: Không có quyền truy cập (chỉ admin)
 *       400:
 *         description: Dữ liệu không hợp lệ
 */

/**
 * @swagger
 * /api/user/update-user/{id}:
 *   put:
 *     summary: Cập nhật thông tin người dùng (yêu cầu đăng nhập)
 *     description: Cập nhật thông tin người dùng cho admin hoặc người dùng hiện tại
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: id của người dùng
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Thông tin người dùng cập nhật thành công
 *       401:
 *         description: Token không hợp lệ
 *       403:
 *         description: Không có quyền (chỉ admin hoặc người dùng hiện tại)
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       404:
 *         description: Người dùng không tồn tại
 */

/**
 * @swagger
 * /api/user/delete-user/{id}:
 *   delete:
 *     summary: Xóa một người dùng (yêu cầu đăng nhập)
 *     description: Xóa một người dùng. Chỉ dành cho admin.
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: id của người dùng
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 type: string
 *                 description: id của người dùng
 *     responses:
 *       200:
 *         description: Người dùng xóa thành công
 *       401:
 *         description: Token không hợp lệ
 *       403:
 *         description: Không có quyền (chỉ admin)
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       404:
 *         description: Người dùng không tồn tại
 */

/**
 * @swagger
 * /api/user/delete-many-user:
 *   post:
 *     summary: Xóa nhiều người dùng (yêu cầu đăng nhập)
 *     description: Xóa nhiều người dùng. Chỉ dành cho admin.
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *             type: array
 *             schema:
 *                items:
 *                  type: string
 *                  description: id của người dùng
 *     responses:
 *       200:
 *         description: Người dùng xóa thành công
 *       401:
 *         description: Token không hợp lệ
 *       403:
 *         description: Không có quyền (chỉ admin)
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       404:
 *         description: Người dùng không tồn tại
 */