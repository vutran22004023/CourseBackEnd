/**
 * @swagger
 * components:
 *   schemas:
 *     TournamentHistory:
 *       type: object
 *       required:
 *         - userId
 *         - tournamentId
 *         - nameAlgorithm
 *         - solution
 *         - message
 *       properties:
 *         userId:
 *           type: string
 *           description: ID của người dùng
 *         tournamentId:
 *           type: string
 *           description: ID của giải đấu
 *         nameAlgorithm:
 *           type: string
 *           description: Tên thuật toán hoặc tiêu đề bài toán
 *         solution:
 *           type: string
 *           description: Giải pháp hoặc nội dung thuật toán
 */

/**
 * @swagger
 * /api/algorithm/new-algorithm:
 *   get:
 *     summary: Tạo thuật toán tự động
 *     tags:
 *       - Algorithm
 *     responses:
 *       200:
 *         description: Trả về dữ liệu JSON từ thuật toán đã thực thi thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Lỗi server
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 */

/**
 * @swagger
 * /api/algorithm/check-algorithm:
 *   post:
 *     summary: Kiểm tra thuật toán của người dùng và lưu kết quả
 *     tags:
 *       - Algorithm
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ten:
 *                 type: string
 *               solution:
 *                 type: string
 *               userId:
 *                 type: string
 *               tournamentId:
 *                 type: string
 *             required:
 *               - ten
 *               - solution
 *               - userId
 *               - tournamentId
 *     responses:
 *       200:
 *         description: Trả về kết quả kiểm tra thuật toán
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 algorithm_name:
 *                   type: string
 *                 accuracy:
 *                   type: number
 *                 description:
 *                   type: string
 *                 result:
 *                   type: number
 *                 expected_result:
 *                   type: number
 *                 message:
 *                   type: string
 *       404:
 *         description: Thuật toán không tìm thấy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 */
