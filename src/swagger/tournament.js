/**
 * @swagger
 * components:
 *   schemas:
 *     Tournament:
 *       type: object
 *       required:
 *         - name
 *         - start
 *         - end
 *       properties:
 *         id:
 *           type: string
 *           description: ID của giải đấu
 *         name:
 *           type: string
 *           description: Tên giải đấu
 *         description:
 *           type: string
 *           description: Mô tả về giải đấu
 *         start:
 *           type: string
 *           format: date-time
 *           description: Ngày bắt đầu giải đấu
 *         end:
 *           type: string
 *           format: date-time
 *           description: Ngày kết thúc giải đấu
 *         ranking:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               player:
 *                 type: string
 *                 description: ID của người chơi
 *               rank:
 *                 type: number
 *                 description: Hạng của người chơi
 *               pointsAwarded:
 *                 type: number
 *                 description: Số điểm được trao cho người chơi
 *
 *     TournamentHistory:
 *       type: object
 *       required:
 *         - userId
 *         - tournamentId
 *         - nameAlgorithm
 *         - solution
 *         - message
 *       properties:
 *         id:
 *           type: string
 *           description: ID của lịch sử giải đấu
 *         userId:
 *           type: string
 *           description: ID của người dùng tham gia
 *         tournamentId:
 *           type: string
 *           description: ID của giải đấu liên quan
 *         nameAlgorithm:
 *           type: string
 *           description: Tiêu đề của thuật toán
 *         solution:
 *           type: string
 *           description: Nội dung giải pháp
 *         result:
 *           type: number
 *           description: Kết quả của giải pháp
 *         expected_result:
 *           type: number
 *           description: Kết quả mong đợi
 *         message:
 *           type: string
 *           description: Nội dung tin nhắn
 */

/**
 * @swagger
 * /api/tournament/all:
 *   get:
 *     summary: Lấy danh sách tất cả giải đấu
 *     tags:
 *       - Tournament
 *     parameters:
 *       - name: limit
 *         in: query
 *         description: Số lượng giải đấu mỗi trang
 *         schema:
 *           type: integer
 *       - name: page
 *         in: query
 *         description: Số trang
 *         schema:
 *           type: integer
 *       - name: sort
 *         in: query
 *         description: Tham số sắp xếp
 *         schema:
 *           type: string
 *       - name: filter
 *         in: query
 *         description: Tham số lọc
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Thành công
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
 *                     $ref: '#/components/schemas/Tournament'
 *                 total:
 *                   type: integer
 *                 pageCurrent:
 *                   type: integer
 *                 totalPage:
 *                   type: integer
 */

/**
 * @swagger
 * /api/tournament/detail/{id}:
 *   get:
 *     summary: Lấy thông tin chi tiết của giải đấu
 *     tags:
 *       - Tournament
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID của giải đấu cần lấy thông tin
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Thành công
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
 *                   $ref: '#/components/schemas/Tournament'
 *       404:
 *         description: Không tìm thấy giải đấu
 */

/**
 * @swagger
 * /api/tournament/{id}/ranking:
 *   get:
 *     summary: Lấy xếp hạng của giải đấu
 *     tags:
 *       - Tournament
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID của giải đấu cần lấy xếp hạng
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Thành công
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
 *                   properties:
 *                     ranking:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           player:
 *                             type: string
 *                             description: ID của người chơi
 *                           rank:
 *                             type: number
 *                             description: Xếp hạng của người chơi
 *                           pointsAwarded:
 *                             type: number
 *                             description: Điểm đã được trao cho người chơi
 *       404:
 *         description: Không tìm thấy giải đấu hoặc xếp hạng chưa có
 */
