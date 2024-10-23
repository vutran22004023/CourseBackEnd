import express from 'express';
import { AuthMiddleware, CacheMiddleware } from '../middlewares/index.js';
import VideoSDKController from '../controllers/videosdk.controller.js';
const router = express.Router();

router.post('/create-room', AuthMiddleware.authUser, VideoSDKController.createRoomZoom);
router.get(
  '/show-user-teacher-zoom/:userIdZoom',
  AuthMiddleware.authUser,
  CacheMiddleware.getCache,
  VideoSDKController.showUserTeacherZoom
);
router.get(
  '/show-user-student-zoom/:userIdZoom',
  AuthMiddleware.authUser,
  CacheMiddleware.getCache,
  VideoSDKController.showUserStudentZoom
);
router.get(
  '/show-details-zoom/:idRoom',
  AuthMiddleware.authUser,
  CacheMiddleware.getCache,
  VideoSDKController.showDetailZoom
);
router.put('/update-zoom/:id', AuthMiddleware.authUser, VideoSDKController.updateRoom);
router.delete('/delete-zoom/:id', AuthMiddleware.authUser, VideoSDKController.deleteRoom);
export default router;
