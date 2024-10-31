import redisClient from '../configs/redisClient.config.js';

class CacheUtility {

  // Lưu dữ liệu vào cache
  async setCache(key, data, expiration = 3600) {
    // expiration mặc định 1 giờ
    try {
      await redisClient.set(key, JSON.stringify(data), 'EX', expiration); // Lưu vào Redis với thời gian sống
    } catch (error) {
      console.log('Cache set error:', error);
    }
  }

  // Cập nhật cache (có thể dùng tương tự setCache)
  async updateCache(key, data, expiration = 3600) {
    try {
      await redisClient.set(key, JSON.stringify(data), 'EX', expiration); // Ghi đè cache với key tương ứng
    } catch (error) {
      console.log('Cache update error:', error);
    }
  }

  async clearCache(key) {
    try {
      await redisClient.del(key); // Xóa cache theo key
    } catch (error) {
      console.log('Cache clear error:', error);
    }
  }
}

export default new CacheUtility();
