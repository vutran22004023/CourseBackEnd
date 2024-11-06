import { NotificationService } from '../services/index.js';
import i18n from 'i18n';

class NotificationController {
  // Send notification
  async send(req, res) {
    try {
      const result = await NotificationService.send(req.body);
      res.status(200).json(result);
      CacheUtility.clearCache(`/api/notification/dashboard`);
      CacheUtility.clearCache(`/api/notification/modal`);
    } catch (error) {
      res.status(500).json({
        message: i18n.__('error.server'),
      });
    }
  }

  // Get notifications - dashboard
  async index(req, res) {
    try {
      const cacheKey = req.originalUrl;
      const { limit, page, sort, filter } = req.query;
      const limitValue = parseInt(limit) || 30;
      const pageValue = parseInt(page) || 0;
      const sortArray = sort ? sort.split(':') : ['desc', 'createdAt'];
      const filterArray = filter ? filter.split(':') : null;
      const result = await NotificationService.get(limitValue, pageValue, sortArray, filterArray);
      res.status(200).json(result);
      CacheUtility.setCache(cacheKey, result);
    } catch (error) {
      res.status(500).json({
        message: i18n.__('error.server'),
      });
    }
  }

  // Get notifications for modal
  async get(req, res) {
    try {
      const cacheKey = req.originalUrl;
      const limitValue = 10;
      const pageValue = 0;
      const sortArray = ['desc', 'createdAt'];
      const filterArray = null;
      const result = await NotificationService.get(limitValue, pageValue, sortArray, filterArray);
      res.status(200).json(result);
      CacheUtility.setCache(cacheKey, result);
    } catch (error) {
      res.status(500).json({
        message: i18n.__('error.server'),
      });
    }
  }

  // Delete notification by id
  async delete(req, res) {
    try {
      const result = await NotificationService.delete(req.params.id);
      res.status(200).json(result);
      CacheUtility.clearCache(`/api/notification/dashboard`);
      CacheUtility.clearCache(`/api/notification/modal`);
    } catch (error) {
      res.status(500).json({
        message: i18n.__('error.server'),
      });
    }
  }

  // Delete all notifications
  async deleteAll(req, res) {
    try {
      const result = await NotificationService.deleteAll();
      res.status(200).json(result);
      CacheUtility.clearCache(`/api/notification/dashboard`);
      CacheUtility.clearCache(`/api/notification/modal`);
    } catch (error) {
      res.status(500).json({
        message: i18n.__('error.server'),
      });
    }
  }
}

export default new NotificationController();
