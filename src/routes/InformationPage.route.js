import express from 'express';
import informationPageController from '../controllers/informationPage.controller.js';
import CacheUtility from '../utils/cache.util.js'
import { AuthMiddleware } from '../middlewares/index.js';
const router = express.Router();

router.get('/', CacheUtility.getCache, informationPageController.get);
router.put('/update-information',AuthMiddleware.authAdmin, informationPageController.put);

export default router;
