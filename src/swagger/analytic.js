/**
 * @swagger
 * /api/analytics:
 *   get:
 *     summary: "Lấy dữ liệu thống kê về doanh thu và người dùng"
 *     description: "API này trả về dữ liệu thống kê doanh thu, số người dùng và danh sách các khóa học phổ biến nhất trong một khoảng thời gian. Yêu cầu quyền admin để truy cập."
 *     tags:
 *       - Analytics
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: "Số lượng bản ghi tối đa để lấy trong danh sách top khóa học."
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: "Trang dữ liệu hiện tại."
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           default: "desc"
 *         description: "Thứ tự sắp xếp, mặc định là giảm dần"
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: "Ngày cụ thể để thống kê"
 *       - in: query
 *         name: month
 *         schema:
 *           type: integer
 *         description: "Tháng cụ thể để thống kê"
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         description: "Năm cụ thể để thống kê"
 *     responses:
 *       200:
 *         description: "Dữ liệu thống kê doanh thu và người dùng."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalMoney:
 *                   type: number
 *                   description: "Tổng số tiền doanh thu trong khoảng thời gian hiện tại."
 *                 previousTotalMoney:
 *                   type: number
 *                   description: "Tổng số tiền doanh thu của khoảng thời gian trước đó."
 *                 moneyPercentageChange:
 *                   type: number
 *                   description: "Phần trăm thay đổi doanh thu so với khoảng thời gian trước đó."
 *                 totalUsers:
 *                   type: integer
 *                   description: "Tổng số người đăng ký hiện tại."
 *                 previousTotalUsers:
 *                   type: integer
 *                   description: "Tổng số người đăng ký trước đó."
 *                 usersPercentageChange:
 *                   type: number
 *                   description: "Phần trăm thay đổi số người dùng so với khoảng thời gian trước đó."
 *                 topCourses:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       courseId:
 *                         type: string
 *                         description: "ID của khóa học."
 *                       courseName:
 *                         type: string
 *                         description: "Tên của khóa học."
 *                       slug:
 *                         type: string
 *                         description: "Slug của khóa học."
 *                       image:
 *                         type: string
 *                         description: "Đường dẫn hình ảnh của khóa học."
 *                       totalPurchases:
 *                         type: integer
 *                         description: "Số lượng mua khóa học."
 *                       totalMoney:
 *                         type: number
 *                         description: "Tổng số tiền thu được từ khóa học."
 *       401:
 *         description: "Yêu cầu quyền admin để truy cập."
 *       500:
 *         description: "Lỗi server."
 */
