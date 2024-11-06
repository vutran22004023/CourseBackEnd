import { UserCourseService } from '../services/index.js';
import i18n from 'i18n';

class UserCourseController {
  // Start user-course
  async startUserCourse(req, res) {
    try {
      const result = await UserCourseService.startUserCourse(req.body);
      res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({
        message: i18n.__('error.server'),
      });
    }
  }

  // Update progress
  async updateProgress(req, res) {
    try {
      const result = await UserCourseService.updateProgress(req.body);
      res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({
        message: i18n.__('error.server'),
      });
    }
  }

  // Get course progress
  async getCourseProgress(req, res) {
    try {
      const result = await UserCourseService.getCourseProgress(req.user);
      res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({
        message: i18n.__('error.server'),
      });
    }
  }

  // Add, update or delete note
  async updateNote(req, res) {
    try {
      const data = { userId: req.user.id, ...req.body };
      const result = await UserCourseService.updateNote(data);
      res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({
        message: i18n.__('error.server'),
      });
    }
  }

  async createNote(req, res) {
    try {
      const data = { userId: req.user.id, ...req.body };
      const result = await UserCourseService.createNote(data);
      res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({
        message: i18n.__('error.server'),
      });
    }
  }

  async getAllNotes(req, res) {
    try {
      const data = { userId: req.user.id, ...req.body };
      const result = await UserCourseService.getAllNotes(data);
      res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({
        message: i18n.__('error.server'),
      });
    }
  }

  async deleteNotes(req, res) {
    try {
      const data = { userId: req.user.id, ...req.body };
      const result = await UserCourseService.deleteNote(data);
      res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({
        message: i18n.__('error.server'),
      });
    }
  }

  async updateRating(req, res) {
    try {
      const data = { userId: req.user.id, ...req.body };
      const result = await UserCourseService.updateRating(data);
      res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({
        message: i18n.__('error.server'),
      });
    }
  }

  async checkAnswers(req, res) {
    try {
      const result = await UserCourseService.checkAnswers(req.body);
      res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({
        message: i18n.__('error.server'),
      });
    }
  }
}

export default new UserCourseController();
