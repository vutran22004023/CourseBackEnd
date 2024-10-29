import { InformationPageModel } from '../models/index.js';
import CacheUtility from '../utils/cache.util.js'
class InformationPageController {
  // Lấy thông tin của InformationPage
  async get(req, res) {
    try {
      const cacheKey = req.originalUrl;
      const informationPage = await InformationPageModel.findOne({});
      if (!informationPage) {
        return res.status(404).json({ message: "Information page not found" });
      }
      CacheUtility.setCache(cacheKey, informationPage);
      return res.status(200).json(informationPage);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  // Cập nhật thông tin của InformationPage
  async put(req, res) {
    try {
      const { name, paths } = req.body;

      const updatedInformationPage = await InformationPageModel.findOneAndUpdate(
        {},
        { name, paths },
        { upsert: true, new: true }
      );
      CacheUtility.clearCache(`/api/information-page/`);
      return res.json(updatedInformationPage);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}

export default new InformationPageController();
