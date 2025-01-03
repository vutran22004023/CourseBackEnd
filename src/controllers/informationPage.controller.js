import { InformationPageModel } from '../models/index.js';
import CacheUtility from '../utils/cache.util.js';
import i18n from 'i18n';
class InformationPageController {
  // Lấy thông tin của InformationPage
  async get(req, res) {
    try {
      const cacheKey = req.originalUrl;
      const informationPage = await InformationPageModel.findOne({});
      if (!informationPage) {
        return res.status(404).json({ message: i18n.__('infor_page.not_found') });
      }
      CacheUtility.setCache(cacheKey, informationPage);
      return res.status(200).json(informationPage);
    } catch (error) {
      return res.status(500).json({
        message: i18n.__('error.server'),
      });
    }
  }

  // Cập nhật thông tin của InformationPage
  async put(req, res) {
    try {
      const otherFields = { ...req.body };
      const updatedInformationPage = await InformationPageModel.findOneAndUpdate(
        {},
        { ...otherFields },
        { upsert: true, new: true }
      );
      CacheUtility.clearCache(`/api/information-page`);
      return res.json(updatedInformationPage);
    } catch (error) {
      return res.status(500).json({
        message: i18n.__('error.server'),
      });
    }
  }
}

export default new InformationPageController();
