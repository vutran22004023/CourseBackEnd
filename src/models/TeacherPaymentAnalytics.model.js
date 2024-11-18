import mongoose from 'mongoose';

const TeacherPaymentAnalyticsSchema = new mongoose.Schema({
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Giả sử bạn có model 'User' để liên kết với Teacher
    required: true,
  },
  amountRequested: {
    type: Number,
    required: true, // Số tiền yêu cầu thanh toán từ Teacher
  },
  adminFee: {
    type: Number,
    required: true, // Phí Admin (10% của tổng số tiền yêu cầu)
  },
  teacherAmountAfterTransfer: {
    type: Number,
    required: true, // Số tiền Teacher nhận được sau khi trừ phí Admin
  },
  createdAt: {
    type: Date,
    default: Date.now, // Ngày tạo yêu cầu thanh toán
  },
  status: {
    type: String,
    enum: ['pending', 'completed'],
    default: 'pending', // Trạng thái yêu cầu thanh toán, mặc định là 'pending'
  },
  transferDate: {
    type: Date,
    default: null, // Ngày chuyển tiền thực tế từ Admin (nếu có)
  },
});

const TeacherPaymentAnalytics = mongoose.model('TeacherPaymentAnalytics', TeacherPaymentAnalyticsSchema);

export { TeacherPaymentAnalytics };
