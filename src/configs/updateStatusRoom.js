import { Zoom } from '../models/zoom.model.js';
import moment from 'moment';
import cron from 'node-cron';
import CacheUtility from '../utils/cache.util.js';
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
        await CacheUtility.clearCache(`/api/videosdk/show-details-zoom/${room._id}`);
        await Promise.all(
          room.permissions.map(async (permissionId) => {
            const cacheKey = `/api/videosdk/show-user-student-zoom/${permissionId}`;
            await CacheUtility.clearCache(cacheKey);
          })
        );
        await CacheUtility.clearCache(`/api/videosdk/show-user-teacher-zoom/${room.userIdZoom}`);
      }
    } else if (now.isAfter(endTime)) {
      if (room.status !== 'completed') {
        room.status = 'completed';
        console.log(`Cập nhật phòng họp "${room.title}" thành completed`);
        await room.save();
        await CacheUtility.clearCache(`/api/videosdk/show-details-zoom/${room._id}`);
        await Promise.all(
          room.permissions.map(async (permissionId) => {
            const cacheKey = `/api/videosdk/show-user-student-zoom/${permissionId}`;
            await CacheUtility.clearCache(cacheKey);
          })
        );
        await CacheUtility.clearCache(`/api/videosdk/show-user-teacher-zoom/${room.userIdZoom}`);
      }
    }
  }
}

cron.schedule('* * * * *', () => {
  updateCourseStatus();
});

export default updateCourseStatus;
