import { Zoom } from '../models/zoom.model.js';
import moment from 'moment';
import cron from 'node-cron';
async function updateCourseStatus() {
  const now = moment();

  const rooms = await Zoom.find({
    $or: [
      { status: 'not_started', startTime: { $lte: now.toDate() } }, // Đã đến thời điểm bắt đầu
      { status: 'in_progress', endTime: { $lte: now.toDate() } }, // Đã đến thời điểm kết thúc
    ],
  });

  for (const room of rooms) {
    const startTime = moment(room.startTime);
    const endTime = moment(room.endTime);

    if (now.isAfter(startTime) && now.isBefore(endTime)) {
      if (room.status !== 'in_progress') {
        room.status = 'in_progress';
        console.log(`Cập nhật phòng họp "${room.title}" thành in_progress`);
        await room.save();
      }
    } else if (now.isAfter(endTime)) {
      if (room.status !== 'completed') {
        room.status = 'completed';
        console.log(`Cập nhật phòng họp "${room.title}" thành completed`);
        await room.save();
      }
    }
  }
}

cron.schedule('* * * * *', () => {
  updateCourseStatus();
});

export default updateCourseStatus;
