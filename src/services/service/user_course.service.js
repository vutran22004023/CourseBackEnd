import { CourseModel } from '../../models/index.js';
import 'dotenv/config';
import { UserCourse } from '../../models/user_course.model.js';
import PayCourse from '../../models/paycourse.model.js';
import i18n from 'i18n';
import logger from '../../configs/logger.config.js';

class UserCourseService {
  async startUserCourse(data) {
    try {
      let { userId, courseId } = data;

      const course = await CourseModel.findById(courseId).populate({
        path: 'chapters',
        model: 'Chapter',
        populate: {
          path: 'videos',
          model: 'Video',
        },
      });

      if (!course) {
        return {
          status: 'ERR',
          message: i18n.__('course.not_found'),
        };
      }

      const userCourse = await UserCourse.findOne({
        userId: userId,
        courseId: courseId,
      });

      if (!userCourse) {
        // Kiểm tra payment
        if (course.price === 'paid') {
          const payCourse = await PayCourse.findOne({
            idUser: userId,
            courseId: courseId,
            paymentStatus: 'completed',
          }).lean();

          if (!payCourse) {
            return {
              status: 'ERR',
              message: i18n.__('course.not_paid'),
            };
          }
        }

        // Khởi tạo dữ liệu nếu người dùng chưa học khóa học này
        const chapters = course.chapters.map((chapter, chapterIndex) => ({
          chapterId: chapter._id,
          videos: chapter.videos.map((video, videoIndex) => ({
            videoId: video._id,
            status: chapterIndex === 0 && videoIndex === 0 ? 'in_progress' : 'not_started',
          })),
        }));

        const userCourse = await UserCourse.create({ userId, courseId, chapters });

        return {
          status: 200,
          data: userCourse,
          message: i18n.__('user_course.created'),
        };
      }

      // Handle if delete chapters
      userCourse.chapters = userCourse.chapters.filter((uc) => course.chapters.some((c) => c._id.equals(uc.chapterId)));

      // Đồng bộ chương
      course.chapters.forEach((courseChapter) => {
        const userChapter = userCourse.chapters.find((uc) => uc.chapterId.equals(courseChapter._id));
        if (!userChapter) {
          userCourse.chapters.push({
            chapterId: courseChapter._id,
            videos: courseChapter.videos.map((video, videoIndex) => ({
              videoId: video._id,
              status: videoIndex === 0 ? 'in_progress' : 'not_started',
            })),
          });
        } else {
          // Handle if delete videos
          userChapter.videos = userChapter.videos.filter((uv) =>
            courseChapter.videos.some((cv) => cv._id.equals(uv.videoId))
          );

          // Đồng bộ video trong chương
          courseChapter.videos.forEach((courseVideo) => {
            const userVideo = userChapter.videos.find((uv) => uv.videoId.equals(courseVideo._id));
            if (!userVideo) {
              userChapter.videos.push({
                videoId: courseVideo._id,
                status: 'not_started',
              });
            }
          });
        }
      });

      await userCourse.save();

      return {
        status: 200,
        data: userCourse,
        message: '',
      };
    } catch (err) {
      logger.error('file: user_course.service.js:110 ~ err:', err);
      return {
        status: 'ERR',
        message: i18n.__('error.server'),
      };
    }
  }

  async updateProgress(data) {
    try {
      const { userId, courseId, videoId } = data;

      // Tìm và cập nhật trạng thái video hiện tại thành 'completed'
      const userCourse = await UserCourse.findOneAndUpdate(
        { userId, courseId, 'chapters.videos.videoId': videoId },
        {
          $set: {
            'chapters.$[chapter].videos.$[video].status': 'completed',
          },
        },
        {
          new: true,
          arrayFilters: [{ 'chapter.videos.videoId': videoId }, { 'video.videoId': videoId }],
        }
      );

      if (!userCourse) {
        return {
          status: 'ERR',
          message: i18n.__('course.not_found'),
        };
      }

      let nextVideo = null;
      let chapterCompleted = false;

      // Kiểm tra xem tất cả các video trong chương hiện tại đã hoàn thành chưa
      for (let chapter of userCourse.chapters) {
        const currentVideoIndex = chapter.videos.findIndex((v) => v.videoId.toString() === videoId.toString());
        if (currentVideoIndex !== -1) {
          const allVideosCompleted = chapter.videos.every((v) => v.status === 'completed');
          if (allVideosCompleted) {
            chapterCompleted = true;
          } else {
            const nextVideoIndex = currentVideoIndex + 1;
            if (nextVideoIndex < chapter.videos.length) {
              nextVideo = chapter.videos[nextVideoIndex];
            }
            break;
          }
        }
      }

      if (chapterCompleted) {
        // Chuyển sang chương tiếp theo và đặt video đầu tiên thành 'in_progress'
        for (let i = 0; i < userCourse.chapters.length; i++) {
          const chapter = userCourse.chapters[i];
          const allVideosCompleted = chapter.videos.every((v) => v.status === 'completed');
          if (allVideosCompleted && i + 1 < userCourse.chapters.length) {
            nextVideo = userCourse.chapters[i + 1].videos[0];
            break;
          }
        }
      }
      if (!nextVideo) {
        return {
          status: 200,
          message: i18n.__('user_course.no_next_video'),
          data: userCourse,
        };
      }

      // Tìm video kế tiếp và cập nhật trạng thái của nó thành 'in_progress'
      const updatedCourse = await UserCourse.findOneAndUpdate(
        { userId, courseId, 'chapters.videos.videoId': nextVideo.videoId },
        {
          $set: {
            'chapters.$[chapter].videos.$[video].status': 'in_progress',
          },
        },
        {
          new: true,
          arrayFilters: [{ 'chapter.videos.videoId': nextVideo.videoId }, { 'video.videoId': nextVideo.videoId }],
        }
      );

      return {
        status: 200,
        message: i18n.__('user_course.updated'),
        data: updatedCourse,
      };
    } catch (err) {
      logger.error('file: user_course.service.js:202 ~ err:', err);
      return {
        status: 'ERR',
        message: i18n.__('error.server'),
      };
    }
  }

  async getCourseProgress(data) {
    try {
      let userCourses = await UserCourse.find({ userId: data.id })
        .select('chapters.videos.status updatedAt')
        .populate({
          path: 'courseId',
          model: 'Course',
          select: 'name slug image totalVideos',
        })
        .lean();

      userCourses = userCourses.map((userCourse) => {
        const { chapters, courseId, ...rest } = userCourse;

        // Get an array of videos from all chapters
        const allVideos = chapters.flatMap((chapter) => chapter.videos);

        // Get the progress
        const progress = allVideos.filter((video) => video.status === 'completed').length;

        return {
          ...rest,
          course: { ...courseId, progress },
        };
      });

      return {
        status: 200,
        data: userCourses,
        message: '',
      };
    } catch (err) {
      logger.error('file: user_course.service.js:242 ~ err:', err);
      return {
        status: 'ERR',
        message: i18n.__('error.server'),
      };
    }
  }

  async updateNote(data) {
    try {
      const { userId, courseId, videoId, notes } = data;
      const userCourse = await UserCourse.findOneAndUpdate(
        { userId, courseId },
        {
          $set: {
            'chapters.$[].videos.$[video].notes': notes,
          },
        },
        {
          new: true,
          arrayFilters: [{ 'video.videoId': videoId }],
        }
      );

      if (!userCourse) {
        return {
          status: 'ERR',
          message: i18n.__('course.not_found'),
        };
      }

      return {
        status: 200,
        message: i18n.__('note.updated'),
        data: userCourse,
      };
    } catch (err) {
      logger.error('file: user_course.service.js:279 ~ err:', err);
      return {
        status: 'ERR',
        message: i18n.__('error.server'),
      };
    }
  }

  async createNote(data) {
    try {
      const { userId, courseId, videoId, notes } = data;

      const userCourse = await UserCourse.findOneAndUpdate(
        { userId, courseId },
        {
          $push: {
            'chapters.$[].videos.$[video].notes': notes,
          },
        },
        {
          new: true,
          arrayFilters: [{ 'video.videoId': videoId }],
        }
      );

      if (!userCourse) {
        return {
          status: 'ERR',
          message: i18n.__('course.not_found'),
        };
      }

      return {
        status: 200,
        message: i18n.__('note.created'),
        data: userCourse,
      };
    } catch (err) {
      logger.error('file: user_course.service.js:317 ~ err:', err);
      return {
        status: 'ERR',
        message: i18n.__('error.server'),
      };
    }
  }

  async getAllNotes(data) {
    try {
      const { userId, courseId, videoId, currentChapter, nextChapter, sortOrder, page = 1, limit = 10 } = data;

      const sortOption = sortOrder === 'newest' ? -1 : 1; // -1 for newest first, 1 for oldest first
      const pageNumber = parseInt(page);
      const pageSize = parseInt(limit);

      // Tìm khóa học theo userId và courseId
      const userCourse = await UserCourse.findOne({
        userId,
        courseId,
      });

      if (!userCourse) {
        return {
          status: 'ERR',
          message: i18n.__('course.not_found'),
        };
      }

      // Lấy tất cả ghi chú từ chương hiện tại và chương sau
      let notes = [];

      // Duyệt qua các chương của khóa học
      userCourse.chapters.forEach((chapter, chapterIndex) => {
        // Kiểm tra nếu chương là chương hiện tại hoặc chương tiếp theo
        if (chapterIndex === parseInt(currentChapter) || chapterIndex === parseInt(nextChapter)) {
          // Duyệt qua các video trong chương
          chapter.videos.forEach((video) => {
            // Kiểm tra nếu videoId khớp với video hiện tại
            if (video.videoId.toString() === videoId.toString()) {
              // Push các ghi chú của video vào danh sách
              notes.push(...video.notes);
            }
          });
        }
      });

      // Kiểm tra nếu không tìm thấy ghi chú nào
      if (notes.length === 0) {
        return {
          status: 200,
          message: i18n.__('note.not_found'),
          currentPage: pageNumber,
          totalPages: 0,
          totalNotes: 0,
          data: [],
        };
      }

      // Sắp xếp ghi chú theo thời gian
      notes.sort((a, b) => {
        const dateA = new Date(a.time);
        const dateB = new Date(b.time);
        return sortOption === -1 ? dateB - dateA : dateA - dateB;
      });

      // Phân trang: tính toán số lượng ghi chú trả về cho trang hiện tại
      const startIndex = (pageNumber - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedNotes = notes.slice(startIndex, endIndex);

      return {
        status: 200,
        message: '',
        currentPage: pageNumber,
        totalPages: Math.ceil(notes.length / pageSize),
        totalNotes: notes.length,
        data: paginatedNotes,
      };
    } catch (err) {
      logger.error('file: user_course.service.js:397 ~ err:', err);
      return {
        status: 'ERR',
        message: i18n.__('error.server'),
      };
    }
  }

  async deleteNote(data) {
    try {
      const { userId, courseId, videoId, noteId } = data;
      const userCourse = await UserCourse.findOneAndUpdate(
        { userId, courseId },
        {
          $pull: {
            'chapters.$[].videos.$[video].notes': { _id: noteId }, // Remove the note with the specified _id
          },
        },
        {
          new: true,
          arrayFilters: [{ 'video.videoId': videoId }],
        }
      );

      if (!userCourse) {
        return {
          status: 'ERR',
          message: i18n.__('course.not_found'),
        };
      }

      return {
        status: 200,
        message: i18n.__('note.deleted'),
        data: userCourse,
      };
    } catch (err) {
      logger.error('file: user_course.service.js:434 ~ err:', err);
      return {
        status: 'ERR',
        message: i18n.__('error.server'),
      };
    }
  }

  async updateRating(data) {
    try {
      const { userId, courseId, rating } = data;

      // Validate the rating input to ensure it's between 0 and 5
      if (rating < 0 || rating > 5) {
        return {
          status: 'ERR',
          message: i18n.__('course.invalid_rating'),
        };
      }

      const userCourse = await UserCourse.findOneAndUpdate(
        { userId, courseId },
        {
          $set: {
            rating: rating,
            statusRating: true,
          },
        },
        {
          new: true,
        }
      );

      if (!userCourse) {
        return {
          status: 'ERR',
          message: i18n.__('course.not_found'),
        };
      }

      return {
        status: 200,
        message: i18n.__('course.rating_updated'),
        data: userCourse,
      };
    } catch (err) {
      logger.error('file: user_course.service.js:480 ~ err:', err);
      return {
        status: 'ERR',
        message: i18n.__('error.server'),
      };
    }
  }

  async checkAnswers(data) {
    const { courseId, chapterId, videoId, quizAnswers } = data;
    if (!quizAnswers || !Array.isArray(quizAnswers)) {
      return { status: 400, message: i18n.__('error.bad_request') };
    }
    try {
      const course = await CourseModel.findById({
        _id: courseId,
        'chapters._id': chapterId,
        'chapters.videos._id': videoId,
      });
      if (!course) {
        return { status: 404, message: i18n.__('course.not_found') };
      }
      const chapter = course.chapters[0];
      const video = chapter.videos.find((v) => v._id.toString() === videoId);
      if (!video) return { status: 404, message: i18n.__('video.not_found') };

      let results = quizAnswers.map((qa) => {
        const quiz = video.quiz.find((q) => q._id.toString() === qa.id);
        if (!quiz) return { id: qa.id, correct: null };

        const isCorrect = qa.answer === quiz.correctAnswer;
        return { id: qa.id, correct: isCorrect };
      });
      const totalQuestions = results.length;
      const incorrectAnswers = results.filter((r) => r.correct === false).length;
      if (incorrectAnswers === 0) {
        return {
          status: 'success',
          message: i18n.__('test.success'),
          totalQuestions,
          incorrectAnswers: 0,
          results: results,
        };
      } else {
        return {
          status: 'fail',
          message: i18n.__('test.fail'),
          totalQuestions,
          incorrectAnswers,
          results: results,
        };
      }
    } catch (error) {
      logger.error('file: user_course.service.js:533 ~ error:', error);
      return {
        status: 500,
        message: i18n.__('error.server'),
      };
    }
  }
}

export default new UserCourseService();
