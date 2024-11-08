import express from 'express';
import UserCourseController from '../controllers/user_course.controller.js';
import { AuthMiddleware } from '../middlewares/index.js';

const router = express.Router();

router.post('/start-course', AuthMiddleware.authUser, UserCourseController.startUserCourse);
router.post('/update-progress', AuthMiddleware.authUser, UserCourseController.updateProgress);
router.get('/course-progress', AuthMiddleware.authUser, UserCourseController.getCourseProgress);
router.put('/update-note', AuthMiddleware.authUser, UserCourseController.updateNote);
router.post('/delete-note', AuthMiddleware.authUser, UserCourseController.deleteNotes);
router.post('/create-note', AuthMiddleware.authUser, UserCourseController.createNote);
router.post('/all-note', AuthMiddleware.authUser, UserCourseController.getAllNotes);
router.put('/update-rating', AuthMiddleware.authUser, UserCourseController.updateRating);
router.post('/check-quiz-answers', AuthMiddleware.authUser, UserCourseController.checkAnswers);

export default router;
