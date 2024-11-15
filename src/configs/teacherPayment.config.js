import cron from 'node-cron';
import { Payment } from '../models/paymentRoom.model.js'; 
import { TeacherPaymentAnalytics } from '../models/TeacherPaymentAnalytics.model.js'; 
import moment from 'moment';

function createTransferRequest() {
  const startOfLastMonth = moment().subtract(1, 'month').startOf('month').toDate();
  const endOfLastMonth = moment().subtract(1, 'month').endOf('month').toDate();

  // Truy vấn thanh toán của Teacher trong tháng trước với statusTeacher là 'unpaid'
  Payment.aggregate([
    {
      $match: {
        status: 'completed',  // Trạng thái của Admin đã thanh toán
        statusTeacher: 'unpaid',  // Trạng thái thanh toán của Teacher là 'unpaid'
        createdAt: {
          $gte: startOfLastMonth,
          $lte: endOfLastMonth,
        },
      },
    },
    {
      $group: {
        _id: '$userIdTeacher',  // Lấy tổng số tiền của từng Teacher
        totalAmount: { $sum: '$amount' },
      },
    },
  ]).then(async (payments) => {
    for (let payment of payments) {
      const teacherId = payment._id;
      const totalAmount = payment.totalAmount;

      // Tính số tiền Admin lấy 10%
      const adminFee = totalAmount * 0.1;
      const teacherAmount = totalAmount - adminFee;

      // Lưu lại thông tin yêu cầu chuyển tiền vào TeacherPaymentAnalytics
      const transferRequest = new TeacherPaymentAnalytics({
        teacherId,
        amountRequested: totalAmount,
        adminFee,
        teacherAmountAfterTransfer: teacherAmount,
        createdAt: Date.now(),
      });

      await transferRequest.save();

      // Cập nhật lại trạng thái 'statusTeacher' thành 'pending' trong bảng Payment
      await Payment.updateMany(
        { 
          userIdTeacher: teacherId, 
          statusTeacher: 'unpaid', 
          createdAt: { 
            $gte: startOfLastMonth, 
            $lte: endOfLastMonth 
          }
        },
        { $set: { statusTeacher: 'pending' } }
      );

    }
  }).catch((err) => {
    console.error('Error while calculating payments for teacher:', err);
  });
}

// Đặt lịch cron để chạy vào lúc 12:00 AM đầu mỗi tháng
cron.schedule('0 0 1 * *', createTransferRequest, {
  scheduled: true,
  timezone: 'Asia/Ho_Chi_Minh',
});

console.log('Cron job to create transfer requests set up successfully.');
