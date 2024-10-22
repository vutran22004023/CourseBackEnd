import CacheUtility from '../utils/cache.util.js';

class CacheMiddleware {
  // Lấy dữ liệu từ cache
  async getCache(req, res, next) {
    const key = req.originalUrl; // Sử dụng URL làm key cho cache

    try {
      const cacheData = await CacheUtility.getCache(key); // Lấy dữ liệu từ Redis
      if (cacheData) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).send(cacheData); // Nếu có cache, trả về cache
      } else {
        next(); // Nếu không có, tiếp tục tới controller
      }
    } catch (error) {
      console.log('Cache error:', error);
      next(); // Nếu lỗi, tiếp tục tới controller
    }
  }
}

export default new CacheMiddleware();
