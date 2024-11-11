import redisClient from '../configs/redisClient.config.js';
import logger from '../configs/logger.config.js';

class CacheUtility {
  // Lấy dữ liệu từ cache
  async getCache(key) {
    try {
      return await redisClient.get(key); // Lấy dữ liệu từ Redis
    } catch (error) {
      logger.error('Cache error:', error);
    }
  }

  // Lưu dữ liệu vào cache
  async setCache(key, data, expiration = 3600) {
    // expiration mặc định 1 giờ
    try {
      await redisClient.set(key, JSON.stringify(data), 'EX', expiration); // Lưu vào Redis với thời gian sống
    } catch (error) {
      logger.error('Cache set error:', error);
    }
  }

  // Cập nhật cache (có thể dùng tương tự setCache)
  async updateCache(key, data, expiration = 3600) {
    try {
      await redisClient.set(key, JSON.stringify(data), 'EX', expiration); // Ghi đè cache với key tương ứng
    } catch (error) {
      logger.error('Cache update error:', error);
    }
  }

  async clearCache(key) {
    try {
      await redisClient.del(key); // Xóa cache theo key
    } catch (error) {
      logger.error('Cache clear error:', error);
    }
  }
}

export default new CacheUtility();
