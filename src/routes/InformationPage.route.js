import express from 'express';
import informationPageController from '../controllers/informationPage.controller.js';
import { AuthMiddleware,CacheMiddleware } from '../middlewares/index.js';
const router = express.Router();

router.get('/', CacheMiddleware.getCache, informationPageController.get);
router.put('/update-information',AuthMiddleware.authAdmin, informationPageController.put);

export default router;
