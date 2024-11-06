import Post from '../models/post.model.js';
import { BlogService } from '../services/index.js';
import mongoose from 'mongoose';
import 'dotenv/config';
import CacheUtility from '../utils/cache.util.js';
import i18n from 'i18n';

class BlogController {
  // Get all posts for users
  async index(req, res) {
    try {
      const cacheKey = req.originalUrl;
      const { limit, page, sort, filter } = req.query;
      const limitValue = parseInt(limit) || 30;
      const pageValue = parseInt(page) || 0;
      const sortArray = sort ? sort.split(':') : null;
      const filterArray = filter ? filter.split(':') : null;
      const result = await BlogService.getAllPosts(limitValue, pageValue, sortArray, filterArray);
      res.status(200).json(result);
      CacheUtility.setCache(cacheKey, result);
    } catch (error) {
      return res.status(500).json({
        message: i18n.__('error.server'),
      });
    }
  }

  // Get all posts for admin
  async adminIndex(req, res) {
    try {
      const cacheKey = req.originalUrl;
      const { limit, page, sort, filter } = req.query;
      const limitValue = parseInt(limit) || 30;
      const pageValue = parseInt(page) || 0;
      const sortArray = sort ? sort.split(':') : null;
      const filterArray = filter ? filter.split(':') : null;
      const result = await BlogService.getAllPosts(limitValue, pageValue, sortArray, filterArray, true);
      res.status(200).json(result);
      CacheUtility.setCache(cacheKey, result);
    } catch (error) {
      return res.status(500).json({
        message: i18n.__('error.server'),
      });
    }
  }

  // Get post detail
  async get(req, res) {
    try {
      const cacheKey = req.originalUrl;
      const { slug } = req.params;
      const result = await BlogService.getDetaiPost(slug);
      res.status(200).json(result);
      CacheUtility.setCache(cacheKey, result);
    } catch (error) {
      return res.status(500).json({
        message: i18n.__('error.server'),
      });
    }
  }

  // Add post
  async add(req, res) {
    try {
      // Call the service method to create the post
      const result = await BlogService.createPost(req);
      // Send the result back to the client
      res.status(200).json(result);
      CacheUtility.clearCache(`/api/blog/all-posts`);
      CacheUtility.clearCache(`/api/blog/all-posts/admin`);
    } catch (error) {
      return res.status(500).json({
        message: i18n.__('error.server'),
      });
    }
  }

  // Delete post
  async delete(req, res) {
    try {
      if (!mongoose.isValidObjectId(id)) {
        return res.json({ status: 'ERR', message: i18n.__('error.invalid_id') });
      }
      const result = await Post.findById(id);
      if (!result)
        res.status(404).json({
          status: 404,
          message: i18n.__('blog.not_found'),
        });
      else if (req.user.id === result.userId || req.user.isAdmin) {
        await result.deleteOne();
        res.status(200).json({
          status: 200,
          message: i18n.__('blog.deleted', { id: result._id }),
        });
        CacheUtility.clearCache(`/api/blog/all-posts`);
        CacheUtility.clearCache(`/api/blog/all-posts/admin`);
        CacheUtility.clearCache(`/api/blog/detail-post/${result.slug}`);
      } else
        res.status(403).json({
          status: 'ERR',
          message: i18n.__('error.forbidden'),
        });
    } catch (error) {
      return res.status(500).json({
        message: i18n.__('error.server'),
      });
    }
  }

  // Update post
  async update(req, res) {
    try {
      const { id } = req.params;
      if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({
          status: 400,
          message: i18n.__('error.invalid_id'),
        });
      }

      if (req.user.id !== req.body.userId)
        return res.status(403).json({
          status: 'ERR',
          message: i18n.__('error.forbidden'),
        });
      const result = await BlogService.updatePost(id, req.body);

      res.status(200).json(result);
      CacheUtility.clearCache(`/api/blog/all-posts`);
      CacheUtility.clearCache(`/api/blog/all-posts/admin`);
      CacheUtility.clearCache(`/api/blog/detail-post/${result.data.slug}`);
    } catch (error) {
      return res.status(500).json({
        message: i18n.__('error.server'),
      });
    }
  }

  // Confirm post
  async confirmPost(req, res) {
    try {
      const { id } = req.params;
      if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({
          status: 400,
          message: i18n.__('error.invalid_id'),
        });
      }
      const result = await BlogService.confirmPost(id, req.body);
      res.status(200).json(result);
      CacheUtility.clearCache(`/api/blog/all-posts`);
      CacheUtility.clearCache(`/api/blog/all-posts/admin`);
      CacheUtility.clearCache(`/api/blog/detail-post/${result.data.slug}`);
    } catch (error) {
      return res.status(500).json({
        message: i18n.__('error.server'),
      });
    }
  }
}

export default new BlogController();
