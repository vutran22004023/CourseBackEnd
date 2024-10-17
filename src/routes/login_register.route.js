import express from 'express';
import Login_registerController from '../controllers/auth.controller.js';
import { AuthMiddleware } from '../middlewares/index.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     LoginInput:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           description: Email của người dùng
 *         password:
 *           type: string
 *           description: Mật khẩu của người dùng
 *     RegisterInput:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *         - confirmPassword
 *       properties:
 *         name:
 *           type: string
 *           description: Tên của người dùng
 *         email:
 *           type: string
 *           description: Email của người dùng
 *         password:
 *           type: string
 *           description: Mật khẩu của người dùng
 *         confirmPassword:
 *           type: string
 *           description: Xác nhận mật khẩu
 *     ForgotPasswordInput:
 *       type: object
 *       required:
 *         - email
 *       properties:
 *         email:
 *           type: string
 *           description: Email để đặt lại mật khẩu
 */

/**
 * @swagger
 * /api/login-in:
 *   post:
 *     summary: Đăng nhập
 *     description: Người dùng đăng nhập vào hệ thống.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginInput'
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
 *       401:
 *         description: Đăng nhập thất bại
 */

router.post('/login-in', Login_registerController.loginIn);
/**
 * @swagger
 * /api/login-in/google:
 *   post:
 *     summary: Đăng nhập bằng Google
 *     description: Người dùng đăng nhập vào hệ thống bằng tài khoản Google.
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
 *       401:
 *         description: Đăng nhập thất bại
 */
router.post('/login-in/google', Login_registerController.loginInGoogle);
/**
 * @swagger
 * /api/register:
 *   post:
 *     summary: Đăng ký người dùng mới
 *     description: Tạo tài khoản người dùng mới.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterInput'
 *     responses:
 *       201:
 *         description: Đăng ký thành công
 *       400:
 *         description: Đăng ký thất bại
 */
router.post('/register', Login_registerController.Register);
/**
 * @swagger
 * /api/login-out:
 *   post:
 *     summary: Đăng xuất
 *     description: Người dùng đăng xuất khỏi hệ thống.
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Đăng xuất thành công
 */
router.post('/login-out', Login_registerController.logout);
/**
 * @swagger
 * /api/forgot-password:
 *   post:
 *     summary: Quên mật khẩu
 *     description: Yêu cầu đặt lại mật khẩu.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ForgotPasswordInput'
 *     responses:
 *       200:
 *         description: Email đặt lại mật khẩu đã được gửi
 *       400:
 *         description: Gửi email thất bại
 */
router.post('/forgot-password', Login_registerController.forgotPassword);

/**
 * @swagger
 * /api/reset-password:
 *   post:
 *     summary: Đặt lại mật khẩu
 *     description: Đặt lại mật khẩu của người dùng bằng token đặt lại mật khẩu.
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Đặt lại mật khẩu thành công
 *       400:
 *         description: Token không hợp lệ
 */
router.post('/reset-password', AuthMiddleware.verifyResetToken, Login_registerController.resetPassword);
/**
 * @swagger
 * /api/authenticate-user:
 *   post:
 *     summary: Xác thực người dùng
 *     description: Xác thực người dùng bằng token đặt lại mật khẩu.
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Xác thực thành công
 *       400:
 *         description: Token không hợp lệ
 */
router.post('/authenticate-user', AuthMiddleware.verifyResetToken, Login_registerController.authenticateUser);
/**
 * @swagger
 * /api/refresh-token:
 *   post:
 *     summary: Làm mới token truy cập
 *     description: Cấp token truy cập mới bằng token làm mới.
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Cấp token thành công
 *       401:
 *         description: Token làm mới không hợp lệ
 */
router.post('/refresh-token', AuthMiddleware.refreshAccessToken);
/**
 * @swagger
 * /api/get-token:
 *   get:
 *     summary: Lấy token truy cập
 *     description: Lấy token truy cập từ cookie.
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Token truy cập được tìm thấy
 *       404:
 *         description: Không tìm thấy token
 */
router.get('/get-token', (req, res) => {
  const token = req.cookies.access_Token || null;
  if (token) {
    res.status(200).json({ token });
  } else {
    res.status(404).json({ message: 'Token not found' });
  }
});
/**
 * @swagger
 * /api/get-refreshtoken:
 *   get:
 *     summary: Lấy token làm mới
 *     description: Lấy token làm mới từ cookie.
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Token làm mới được tìm thấy
 *       404:
 *         description: Không tìm thấy token
 */
router.get('/get-refreshtoken', (req, res) => {
  const token = req.cookies.refresh_Token || null;
  if (token) {
    res.status(200).json({ token });
  } else {
    res.status(404).json({ message: 'Token not found' });
  }
});

export default router;
