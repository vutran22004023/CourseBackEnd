/**
 * @swagger
 * components:
 *   schemas:
 *     PayCourse:
 *       type: object
 *       required:
 *         - idUser
 *         - courseId
 *         - paymentStatus
 *         - money
 *       properties:
 *         idUser:
 *           type: string
 *           description: ID của người dùng thực hiện thanh toán
 *         courseId:
 *           type: string
 *           description: ID của khóa học đã mua
 *         paymentStatus:
 *           type: string
 *           enum: [pending, completed, failed]
 *           description: Trạng thái thanh toán của giao dịch
 *         money:
 *           type: number
 *           description: Số tiền thanh toán cho khóa học
 * 
 *     PayOSResponse:
 *       type: object
 *       properties:
 *         code:
 *           type: string
 *           description: "Mã trạng thái của phản hồi"
 *         desc:
 *           type: string
 *           description: "Mô tả trạng thái của phản hồi"
 *         data:
 *           type: object
 *           description: "Dữ liệu liên quan đến phản hồi"
 *           additionalProperties: true
 *         signature:
 *           type: string
 *           description: "Chữ ký bảo mật của phản hồi"
 * 
 *     CheckoutRequest:
 *       type: object
 *       properties:
 *         orderCode:
 *           type: number
 *           description: "Mã đơn hàng"
 *         amount:
 *           type: number
 *           description: "Số tiền thanh toán"
 *         description:
 *           type: string
 *           description: "Mô tả giao dịch"
 *         cancelUrl:
 *           type: string
 *           description: "URL để quay lại khi giao dịch bị hủy"
 *         returnUrl:
 *           type: string
 *           description: "URL để quay lại sau khi giao dịch thành công"
 *         signature:
 *           type: string
 *           description: "Chữ ký bảo mật của yêu cầu"
 *         items:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: "Tên sản phẩm"
 *               quantity:
 *                 type: number
 *                 description: "Số lượng sản phẩm"
 *               price:
 *                 type: number
 *                 description: "Giá của sản phẩm"
 *         buyerName:
 *           type: string
 *           description: "Tên người mua"
 *         buyerEmail:
 *           type: string
 *           description: "Email của người mua"
 *         buyerPhone:
 *           type: string
 *           description: "Số điện thoại của người mua"
 *         buyerAddress:
 *           type: string
 *           description: "Địa chỉ của người mua"
 *         expiredAt:
 *           type: number
 *           description: "Thời gian hết hạn của giao dịch"
 * 
 *     CheckoutResponseData:
 *       type: object
 *       properties:
 *         bin:
 *           type: string
 *           description: "Số BIN của thẻ"
 *         accountNumber:
 *           type: string
 *           description: "Số tài khoản thanh toán"
 *         accountName:
 *           type: string
 *           description: "Tên tài khoản thanh toán"
 *         amount:
 *           type: number
 *           description: "Số tiền thanh toán"
 *         description:
 *           type: string
 *           description: "Mô tả giao dịch"
 *         orderCode:
 *           type: number
 *           description: "Mã đơn hàng"
 *         currency:
 *           type: string
 *           description: "Mã tiền tệ của giao dịch"
 *         paymentLinkId:
 *           type: string
 *           description: "ID của liên kết thanh toán"
 *         status:
 *           type: string
 *           description: "Trạng thái của giao dịch"
 *         expiredAt:
 *           type: number
 *           description: "Thời gian hết hạn của giao dịch"
 *         checkoutUrl:
 *           type: string
 *           description: "URL để thanh toán"
 *         qrCode:
 *           type: string
 *           description: "Mã QR cho giao dịch"
 * 
 *     CancelPaymentLinkRequest:
 *       type: object
 *       properties:
 *         cancellationReason:
 *           type: string
 *           description: "Lý do hủy thanh toán"
 * 
 *     ConfirmWebhookRequest:
 *       type: object
 *       properties:
 *         webhookUrl:
 *           type: string
 *           description: "URL webhook để nhận thông báo"
 * 
 *     PaymentLinkData:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: "ID của liên kết thanh toán"
 *         orderCode:
 *           type: number
 *           description: "Mã đơn hàng"
 *         amount:
 *           type: number
 *           description: "Số tiền thanh toán"
 *         amountPaid:
 *           type: number
 *           description: "Số tiền đã thanh toán"
 *         amountRemaining:
 *           type: number
 *           description: "Số tiền còn lại cần thanh toán"
 *         status:
 *           type: string
 *           description: "Trạng thái của liên kết thanh toán"
 *         createdAt:
 *           type: string
 *           description: "Thời gian tạo liên kết thanh toán"
 *         transactions:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Transaction'
 *         cancellationReason:
 *           type: string
 *           nullable: true
 *           description: "Lý do hủy liên kết thanh toán, nếu có"
 *         canceledAt:
 *           type: string
 *           nullable: true
 *           description: "Thời gian hủy liên kết thanh toán, nếu có"
 * 
 *     Transaction:
 *       type: object
 *       properties:
 *         reference:
 *           type: string
 *           description: "Tham chiếu giao dịch"
 *         amount:
 *           type: number
 *           description: "Số tiền của giao dịch"
 *         accountNumber:
 *           type: string
 *           description: "Số tài khoản của giao dịch"
 *         description:
 *           type: string
 *           description: "Mô tả giao dịch"
 *         transactionDateTime:
 *           type: string
 *           description: "Thời gian giao dịch"
 *         virtualAccountName:
 *           type: string
 *           nullable: true
 *           description: "Tên tài khoản ảo, nếu có"
 *         virtualAccountNumber:
 *           type: string
 *           nullable: true
 *           description: "Số tài khoản ảo, nếu có"
 *         counterAccountBankId:
 *           type: string
 *           nullable: true
 *           description: "ID của ngân hàng tài khoản đối ứng, nếu có"
 *         counterAccountBankName:
 *           type: string
 *           nullable: true
 *           description: "Tên ngân hàng tài khoản đối ứng, nếu có"
 *         counterAccountName:
 *           type: string
 *           nullable: true
 *           description: "Tên tài khoản đối ứng, nếu có"
 *         counterAccountNumber:
 *           type: string
 *           nullable: true
 *           description: "Số tài khoản đối ứng, nếu có"
 * 
 *     Webhook:
 *       type: object
 *       properties:
 *         code:
 *           type: string
 *           description: "Mã trạng thái của webhook"
 *         desc:
 *           type: string
 *           description: "Mô tả trạng thái của webhook"
 *         success:
 *           type: boolean
 *           description: "Trạng thái thành công của webhook"
 *         data:
 *           $ref: '#/components/schemas/WebhookData'
 *         signature:
 *           type: string
 *           description: "Chữ ký bảo mật của webhook"
 * 
 *     WebhookData:
 *       type: object
 *       properties:
 *         orderCode:
 *           type: number
 *           description: "Mã đơn hàng"
 *         amount:
 *           type: number
 *           description: "Số tiền thanh toán"
 *         description:
 *           type: string
 *           description: "Mô tả giao dịch"
 *         accountNumber:
 *           type: string
 *           description: "Số tài khoản thanh toán"
 *         reference:
 *           type: string
 *           description: "Tham chiếu giao dịch"
 *         transactionDateTime:
 *           type: string
 *           description: "Thời gian giao dịch"
 *         currency:
 *           type: string
 *           description: "Mã tiền tệ của giao dịch"
 *         paymentLinkId:
 *           type: string
 *           description: "ID của liên kết thanh toán"
 *         code:
 *           type: string
 *           description: "Mã trạng thái giao dịch"
 *         desc:
 *           type: string
 *           description: "Mô tả trạng thái giao dịch"
 *         counterAccountBankId:
 *           type: string
 *           nullable: true
 *           description: "ID của ngân hàng tài khoản đối ứng, nếu có"
 *         counterAccountBankName:
 *           type: string
 *           nullable: true
 *           description: "Tên ngân hàng tài khoản đối ứng, nếu có"
 *         counterAccountName:
 *           type: string
 *           nullable: true
 *           description: "Tên tài khoản đối ứng, nếu có"
 *         counterAccountNumber:
 *           type: string
 *           nullable: true
 *           description: "Số tài khoản đối ứng, nếu có"
 *         virtualAccountName:
 *           type: string
 *           nullable: true
 *           description: "Tên tài khoản ảo, nếu có"
 *         virtualAccountNumber:
 *           type: string
 *           nullable: true
 *           description: "Số tài khoản ảo, nếu có"
 */

/**
 * @swagger
 * /api/pay/create-payment-link:
 *   post:
 *     tags:
 *       - Payment
 *     summary: Tạo liên kết thanh toán
 *     description: Tạo một liên kết thanh toán mới. Yêu cầu đăng nhập để thực hiện hành động này.
 *     security:
 *       - Bearer: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 description: "Tên đầy đủ của người mua"
 *               totalPrice:
 *                 type: number
 *                 description: "Tổng số tiền thanh toán"
 *               email:
 *                 type: string
 *                 description: "Email của người mua"
 *             required:
 *               - fullName
 *               - totalPrice
 *               - email
 *     responses:
 *       200:
 *         description: "Liên kết thanh toán được tạo thành công"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CheckoutResponseData'
 *       400:
 *         description: "Yêu cầu không hợp lệ"
 *       401:
 *         description: "Người dùng chưa đăng nhập hoặc token không hợp lệ"
 *       500:
 *         description: "Lỗi máy chủ"
 */

/**
 * @swagger
 * /api/pay/get-payment-infomations/{idorder}:
 *   get:
 *     summary: "Lấy thông tin liên kết thanh toán"
 *     description: "API này cho phép người dùng lấy thông tin của một liên kết thanh toán dựa trên mã đơn hàng"
 *     tags:
 *       - Payment
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: idorder
 *         in: path
 *         required: true
 *         description: "Mã đơn hàng cần lấy thông tin"
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: "Thông tin liên kết thanh toán"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaymentLinkData'
 *       404:
 *         description: "Không tìm thấy liên kết thanh toán cho mã đơn hàng đã cho"
 *       500:
 *         description: "Lỗi server"
 */

/**
 * @swagger
 * /api/pay/cancel-payment-link/{idorder}:
 *   post:
 *     tags:
 *       - Payment
 *     summary: Hủy liên kết thanh toán
 *     description: Hủy một liên kết thanh toán dựa trên mã đơn hàng. Yêu cầu đăng nhập để thực hiện hành động này.
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: idorder
 *         required: true
 *         description: "Mã đơn hàng của liên kết thanh toán cần hủy"
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: "Liên kết thanh toán đã được hủy thành công"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaymentLinkData'
 *       400:
 *         description: "Yêu cầu không hợp lệ"
 *       401:
 *         description: "Người dùng chưa đăng nhập hoặc token không hợp lệ"
 *       404:
 *         description: "Liên kết thanh toán không tìm thấy"
 *       500:
 *         description: "Lỗi máy chủ"
 */

/**
 * @swagger
 * /api/pay/confirm-webhook-payos:
 *   post:
 *     tags:
 *       - Payment
 *     summary: Xác nhận webhook từ PayOs
 *     description: Gửi yêu cầu xác nhận webhook đến PayOs và nhận kết quả về.
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: "Webhook đã được xác nhận thành công"
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *       400:
 *         description: "Yêu cầu không hợp lệ"
 *       500:
 *         description: "Lỗi máy chủ"
 */

/**
 * @swagger
 * /api/pay/payment-zalopay:
 *   post:
 *     tags:
 *       - Payment
 *     summary: Tạo đơn hàng thanh toán ZaloPay
 *     security:
 *       - Bearer: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orderItem:
 *                 type: object
 *                 properties:
 *                   productId:
 *                     type: string
 *                     description: ID sản phẩm
 *               fullName:
 *                 type: string
 *                 description: Họ và tên người dùng
 *               address:
 *                 type: string
 *                 description: Địa chỉ người dùng
 *               phone:
 *                 type: string
 *                 description: Số điện thoại người dùng
 *               paymentMethod:
 *                 type: string
 *                 description: Phương thức thanh toán
 *               itemsPrice:
 *                 type: number
 *                 description: Giá sản phẩm
 *               shippingPrice:
 *                 type: number
 *                 description: Giá vận chuyển
 *               totalPrice:
 *                 type: number
 *                 description: Tổng giá thanh toán
 *               user:
 *                 type: object
 *                 description: Thông tin người dùng
 *             required:
 *               - orderItem
 *               - fullName
 *               - address
 *               - phone
 *               - totalPrice
 *     responses:
 *       200:
 *         description: Thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     itemid:
 *                       type: string
 *                       description: ID sản phẩm
 *                 message:
 *                   type: string
 *                   description: Thông báo
 *       500:
 *         description: Lỗi máy chủ nội bộ
 */

/**
 * @swagger
 * /api/pay/callback-zalo:
 *   post:
 *     tags:
 *       - Payment
 *     summary: Nhận callback từ ZaloPay sau khi thanh toán
 *     security:
 *       - Bearer: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 type: string
 *                 description: Dữ liệu trả về từ ZaloPay
 *               mac:
 *                 type: string
 *                 description: Giá trị MAC để xác thực callback
 *             required:
 *               - data
 *               - mac
 *     responses:
 *       200:
 *         description: Kết quả xác thực callback
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 return_code:
 *                   type: integer
 *                   description: Mã trạng thái trả về
 *                 return_message:
 *                   type: string
 *                   description: Thông báo trạng thái
 *       500:
 *         description: Lỗi máy chủ nội bộ
 */

/**
 * @swagger
 * /api/pay/order-status-zalopay/{apptransid}:
 *   post:
 *     tags:
 *       - Payment
 *     summary: Lấy trạng thái đơn hàng từ ZaloPay
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - name: apptransid
 *         in: path
 *         required: true
 *         description: ID giao dịch từ ứng dụng
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Trạng thái đơn hàng từ ZaloPay
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 return_code:
 *                   type: integer
 *                   description: Mã trạng thái trả về
 *                 return_message:
 *                   type: string
 *                   description: Thông điệp trạng thái
 *                 data:
 *                   type: object
 *                   properties:
 *                     apptransid:
 *                       type: string
 *                       description: ID giao dịch ứng dụng
 *                     status:
 *                       type: string
 *                       description: Trạng thái giao dịch
 *                     amount:
 *                       type: number
 *                       format: float
 *                       description: Số tiền đã thanh toán
 *       500:
 *         description: Lỗi máy chủ nội bộ
 */

/**
 * @swagger
 * /api/pay/transaction-refund:
 *   post:
 *     tags:
 *       - Payment
 *     summary: Yêu cầu hoàn tiền cho giao dịch ZaloPay
 *     security:
 *       - Bearer: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               zptransid:
 *                 type: string
 *                 description: ID giao dịch ZaloPay cần hoàn tiền
 *               amount:
 *                 type: number
 *                 format: float
 *                 description: Số tiền hoàn lại
 *               description:
 *                 type: string
 *                 description: Mô tả lý do hoàn tiền
 *     responses:
 *       200:
 *         description: Kết quả hoàn tiền thành công
 *       400:
 *         description: Thông tin đầu vào không hợp lệ
 *       500:
 *         description: Lỗi máy chủ
 */

/**
 * @swagger
 * /api/pay/transaction-refund-status:
 *   post:
 *     tags:
 *       - Payment
 *     summary: Lấy trạng thái hoàn tiền cho giao dịch ZaloPay
 *     security:
 *       - Bearer: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mrefundid:
 *                 type: string
 *                 description: ID hoàn tiền cần kiểm tra trạng thái
 *     responses:
 *       200:
 *         description: Kết quả trạng thái hoàn tiền thành công
 *       400:
 *         description: Thông tin đầu vào không hợp lệ
 *       500:
 *         description: Lỗi máy chủ
 */

/**
 * @swagger
 * /api/pay/information-course:
 *   get:
 *     tags:
 *       - Payment
 *     summary: Lấy thông tin khóa học
 *     description: Lấy danh sách các khóa học đã thanh toán với phân trang, tìm kiếm và sắp xếp.
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - name: page
 *         in: query
 *         description: Số trang cần lấy dữ liệu
 *         required: false
 *         type: integer
 *         default: 1
 *       - name: limit
 *         in: query
 *         description: Số lượng bản ghi trên mỗi trang
 *         required: false
 *         type: integer
 *         default: 10
 *       - name: search
 *         in: query
 *         description: Từ khóa tìm kiếm
 *         required: false
 *         type: string
 *         default: ''
 *       - name: sort
 *         in: query
 *         description: Thứ tự sắp xếp
 *         required: false
 *         type: string
 *         default: 'desc'
 *     responses:
 *       200:
 *         description: Thành công, trả về danh sách khóa học đã thanh toán.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalStatus:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: Trạng thái thanh toán
 *                       count:
 *                         type: integer
 *                         description: Số lượng trạng thái thanh toán
 *                 totalPayCourses:
 *                   type: integer
 *                   description: Tổng số khóa học đã thanh toán
 *                 currentPage:
 *                   type: integer
 *                   description: Trang hiện tại
 *                 totalPages:
 *                   type: integer
 *                   description: Tổng số trang
 *                 payCourses:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/PayCourse'
 *       500:
 *         description: Lỗi máy chủ
 */

/**
 * @swagger
 * /api/pay/post-information-course:
 *   post:
 *     tags:
 *       - Payment
 *     summary: Tạo thông tin khóa học
 *     description: Tạo mới một bản ghi thanh toán cho khóa học.
 *     security:
 *       - Bearer: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PayCourse'
 *     responses:
 *       201:
 *         description: Thanh toán thành công
 *       400:
 *         description: Thiếu thông tin yêu cầu
 *       500:
 *         description: Lỗi máy chủ
 */

/**
 * @swagger
 * /api/pay/update-information-course/{id}:
 *   put:
 *     tags:
 *       - Payment
 *     summary: Cập nhật thông tin khóa học
 *     description: Cập nhật thông tin thanh toán cho khóa học theo ID.
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID của thông tin thanh toán cần cập nhật
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PayCourse'
 *     responses:
 *       200:
 *         description: Cập nhật thông tin thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Thông báo thành công
 *                 data:
 *                   $ref: '#/components/schemas/PayCourse'
 *       404:
 *         description: Không tìm thấy thông tin
 *       500:
 *         description: Lỗi máy chủ
 */

/**
 * @swagger
 * /api/pay/delete-information-course/{id}:
 *   delete:
 *     tags:
 *       - Payment
 *     summary: Xóa thông tin khóa học
 *     description: Xóa thông tin thanh toán cho khóa học theo ID.
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID của thông tin thanh toán cần xóa
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Xóa thông tin thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Thông báo thành công
 *                 data:
 *                   $ref: '#/components/schemas/PayCourse'
 *       404:
 *         description: Không tìm thấy thông tin
 *       500:
 *         description: Lỗi máy chủ
 */

/**
 * @swagger
 * /api/pay/check-paid-course/{courseId}:
 *   get:
 *     tags:
 *       - Payment
 *     summary: Kiểm tra trạng thái thanh toán của khóa học
 *     description: Kiểm tra xem người dùng đã thanh toán cho khóa học cụ thể hay chưa.
 *     parameters:
 *       - name: courseId
 *         in: path
 *         required: true
 *         description: ID của khóa học cần kiểm tra
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Người dùng đã thanh toán cho khóa học
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Thông báo thành công
 *                 data:
 *                   $ref: '#/components/schemas/PayCourse'
 *       404:
 *         description: Không tìm thấy thông tin
 *       500:
 *         description: Lỗi máy chủ
 */
