import Course from '../models/course.model.js';
import { CourseService } from '../services/index.js';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import CacheUtility from '../utils/cache.util.js';
import i18n from 'i18n';
dotenv.config();

class CourseController {
  // Get all courses
  async index(req, res) {
    try {
      const cacheKey = req.originalUrl;
      const { limit, page, sort, filter } = req.query;
      const limitValue = parseInt(limit) || 30;
      const pageValue = parseInt(page) || 0;
      const sortArray = sort ? sort.split(':') : null;
      const filterArray = filter ? filter.split(':') : null;
      const result = await CourseService.getAllCourses(limitValue, pageValue, sortArray, filterArray);
      CacheUtility.setCache(cacheKey, result);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: i18n.__('error.server') });
    }
  }

  // Get course detail
  async get(req, res) {
    try {
      const cacheKey = req.originalUrl;
      const { slug } = req.params;
      const result = await CourseService.getDetaiCourse(slug, req?.user);
      CacheUtility.setCache(cacheKey, result);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: i18n.__('error.server') });
    }
  }

  // Add course
  async add(req, res) {
    try {
      // Call the service method to create the course
      const result = await CourseService.createCourse(req.body);
      // Send the result back to the client
      CacheUtility.clearCache(`/api/course/all-courses`);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: i18n.__('error.server') });
    }
  }

  // Delete course
  async delete(req, res) {
    try {
      const { id } = req.params;
      if (!id)
        return res.status(200).json({
          status: 'ERR',
          message: i18n.__('error.bad_request'),
        });
      if (!mongoose.isValidObjectId(id)) {
        return res.status(200).json({ status: 'ERR', message: i18n.__('error.invalid_id') });
      }
      const result = await Course.findOneAndDelete({ _id: id });
      if (!result)
        return res.status(404).json({
          status: 404,
          message: i18n.__('course.not_found'),
        });
      else {
        CacheUtility.clearCache(`/api/course/all-courses`);
        CacheUtility.clearCache(`/api/course/detail-courses/${id}`);
      }
      res.status(200).json({
        status: 200,
        message: i18n.__('course.deleted', { id: id }),
      });
    } catch (error) {
      res.status(500).json({ message: i18n.__('error.server') });
    }
  }

  // Update course
  async update(req, res) {
    try {
      const { id } = req.params;
      if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({
          status: 400,
          message: i18n.__('error.invalid_id'),
        });
      }

      const result = await CourseService.updateCourse(id, req.body);
      CacheUtility.clearCache(`/api/course/all-courses`);
      CacheUtility.updateCache(`/api/course/detail-courses/${id}`, result);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: i18n.__('error.server') });
    }
  }
}

export default new CourseController();
