import CourseChat from '../models/message.model.js';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
dotenv.config();
import CacheUtility from '../utils/cache.util.js';
import i18n from 'i18n';

class MessageController {
  async postMessage(req, res) {
    const { courseId, chapterId, videoId, userId, name, avatar, text } = req.body;

    try {
      let courseChat = await CourseChat.findOne({ courseId });

      if (!courseChat) {
        courseChat = new CourseChat({ courseId, chapters: [] });
      }

      let chapter = courseChat.chapters.find((ch) => ch.chapterId.toString() === chapterId);

      if (!chapter) {
        chapter = { chapterId, videos: [] };
        courseChat.chapters.push(chapter);
      }

      let videoChat = chapter.videos.find((vid) => vid.videoId.toString() === videoId);

      if (!videoChat) {
        videoChat = { videoId, messages: [] };
        chapter.videos.push(videoChat);
      }

      const newMessage = { userId, name, avatar, text, timestamp: new Date() };
      videoChat.messages.push(newMessage);

      await courseChat.save();

      res.status(201).json({ message: i18n.__('message.sent') });
      CacheUtility.clearCache(`/api/message/getMessages`);
    } catch (error) {
      return res.status(500).json({
        error: i18n.__('error.server'),
      });
    }
  }

  async getMessages(req, res) {
    const cacheKey = req.originalUrl;
    const { courseId, chapterId, videoId, page = 1, limit = 10 } = req.query;

    try {
      const pageNumber = parseInt(page, 10);
      const pageSize = parseInt(limit, 10);

      if (isNaN(pageNumber) || isNaN(pageSize) || pageNumber < 1 || pageSize < 1) {
        return res.status(400).json({ error: i18n.__('error.invalid_page_number') });
      }

      const courseChat = await CourseChat.findOne({ courseId });

      if (!courseChat) {
        return res.status(404).json({ error: i18n.__('course.not_found') });
      }

      const chapter = courseChat.chapters.find((ch) => ch.chapterId.toString() === chapterId);

      if (!chapter) {
        return res.status(404).json({ error: i18n.__('chapter.not_found') });
      }

      const videoChat = chapter.videos.find((vid) => vid.videoId.toString() === videoId);

      if (!videoChat) {
        return res.status(404).json({ error: i18n.__('video.not_found') });
      }

      const sortedMessages = videoChat.messages.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

      const totalMessages = sortedMessages.length;
      const totalPages = Math.ceil(totalMessages / pageSize);
      const startIndex = (pageNumber - 1) * pageSize;
      const endIndex = startIndex + pageSize;

      if (startIndex >= totalMessages) {
        return res.status(404).json({ error: i18n.__('error.not_found') });
      }

      const messages = sortedMessages.slice(startIndex, endIndex);
      const result = {
        page: pageNumber,
        totalPages,
        totalMessages,
        messages,
      };

      res.status(200).json(result);
      CacheUtility.setCache(cacheKey, result);
    } catch (error) {
      return res.status(500).json({
        error: i18n.__('error.server'),
      });
    }
  }
  async getMessagesCourseId(req, res) {
    const cacheKey = req.originalUrl;
    const { courseId, page = 1, limit = 10 } = req.query;

    try {
      const pageNumber = parseInt(page, 10);
      const pageSize = parseInt(limit, 10);

      if (isNaN(pageNumber) || isNaN(pageSize) || pageNumber < 1 || pageSize < 1) {
        return res.status(400).json({ error: i18n.__('error.invalid_page_number') });
      }

      const courseChat = await CourseChat.findOne({ courseId });

      if (!courseChat) {
        return res.status(404).json({ error: i18n.__('course.not_found') });
      }

      // Collect all messages from every chapter and video in the course
      const allMessages = courseChat.chapters.flatMap((chapter) =>
        chapter.videos.flatMap((video) =>
          video.messages.map((message) => ({
            ...message.toObject(), // Convert message to plain object if it's a Mongoose document
            chapterId: chapter.chapterId,
            videoId: video.videoId,
          }))
        )
      );

      // Sort messages by timestamp in descending order
      const sortedMessages = allMessages.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

      const totalMessages = sortedMessages.length;
      const totalPages = Math.ceil(totalMessages / pageSize);
      const startIndex = (pageNumber - 1) * pageSize;
      const endIndex = startIndex + pageSize;

      if (startIndex >= totalMessages) {
        return res.status(404).json({ error: i18n.__('error.not_found') });
      }

      const messages = sortedMessages.slice(startIndex, endIndex);
      const result = {
        page: pageNumber,
        totalPages,
        totalMessages,
        messages,
      };

      res.status(200).json(result);
      CacheUtility.setCache(cacheKey, result);
    } catch (error) {
      return res.status(500).json({
        message: i18n.__('error.server'),
      });
    }
  }

  async updateMessage(req, res) {
    const { courseId, chapterId, videoId, messageId } = req.params;
    const { userId, text } = req.body;

    try {
      const courseChat = await CourseChat.findOne({ courseId });

      if (!courseChat) {
        return res.status(404).json({ error: i18n.__('course.not_found') });
      }

      const chapter = courseChat.chapters.find((ch) => ch.chapterId.toString() === chapterId);

      if (!chapter) {
        return res.status(404).json({ error: i18n.__('chapter.not_found') });
      }

      const videoChat = chapter.videos.find((vid) => vid.videoId.toString() === videoId);

      if (!videoChat) {
        return res.status(404).json({ error: i18n.__('video.not_found') });
      }

      const message = videoChat.messages.find((msg) => msg._id.toString() === messageId);

      if (!message) {
        return res.status(404).json({ error: i18n.__('message.not_found') });
      }

      if (message.userId.toString() !== userId) {
        return res.status(403).json({ error: i18n.__('error.forbidden') });
      }

      message.text = text;
      message.timestamp = new Date();

      await courseChat.save();

      res.status(200).json({ message: i18n.__('message.updated') });
      CacheUtility.clearCache(`/api/message/getMessages`);
    } catch (error) {
      return res.status(500).json({
        error: i18n.__('error.server'),
      });
    }
  }

  async deleteMessage(req, res) {
    const { courseId, chapterId, videoId, messageId } = req.params;
    const { userId } = req.body;

    try {
      const courseChat = await CourseChat.findOne({ courseId });

      if (!courseChat) {
        return res.status(404).json({ error: i18n.__('course.not_found') });
      }

      const chapter = courseChat.chapters.find((ch) => ch.chapterId.toString() === chapterId);

      if (!chapter) {
        return res.status(404).json({ error: i18n.__('chapter.not_found') });
      }

      const videoChat = chapter.videos.find((vid) => vid.videoId.toString() === videoId);

      if (!videoChat) {
        return res.status(404).json({ error: i18n.__('video.not_found') });
      }

      const messageIndex = videoChat.messages.findIndex((msg) => msg._id.toString() === messageId);

      if (messageIndex === -1) {
        return res.status(404).json({ error: i18n.__('message.not_found') });
      }

      const message = videoChat.messages[messageIndex];

      if (message.userId.toString() !== userId) {
        return res.status(403).json({ error: i18n.__('error.forbidden') });
      }

      videoChat.messages.splice(messageIndex, 1);

      await courseChat.save();

      res.status(200).json({ message: i18n.__('message.deleted') });
      CacheUtility.clearCache(`/api/message/getMessages`);
    } catch (error) {
      return res.status(500).json({
        error: i18n.__('error.server'),
      });
    }
  }
}

export default new MessageController();
