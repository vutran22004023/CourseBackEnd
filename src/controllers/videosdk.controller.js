import * as dotenv from 'dotenv';
import axios from 'axios';
dotenv.config();
import jwt from 'jsonwebtoken';
import { Zoom } from '../models/zoom.model.js';
import { Payment } from '../models/paymentRoom.model.js';
import { UserModel } from '../models/index.js';
import CacheUtility from '../utils/cache.util.js';
import i18n from 'i18n';
import logger from '../configs/logger.config.js';

const API_KEY = process.env.VIDEOSDK_API_KEY;
const SECRET = process.env.VIDEOSDK_SECRET_KEY;
const URL = process.env.VIDEOSDK_URL;

const createRoomVideoSDK = async (createToken) => {
  try {
    const axiosResponse = await axios.post(
      `${URL}/rooms`,
      { region: 'sg001' }, // body của request
      {
        headers: {
          Authorization: createToken,
          'Content-Type': 'application/json',
        },
      }
    );
    return axiosResponse.data;
  } catch (error) {
    logger.error('Error creating meeting:', error);
    const errorResponse = {
      status: 200,
      message: i18n.__('error.server'),
    };
    throw new Error(JSON.stringify(errorResponse));
  }
};

// Controller cho VideoSDK
class VideoSDKController {
  async createRoomZoom(req, res) {
    try {
      const { title, startTime, endTime, userIdZoom, price, statusPrice, timeRoom } = req.body;

      const createIdZoom = await createRoomVideoSDK(createToken);

      if (!createIdZoom) {
        return res.status(200).json({
          status: 400,
          message: i18n.__('room.id_error'),
        });
      }

      const newZoom = new Zoom({
        userIdZoom,
        title,
        startTime,
        endTime,
        roomDetails: createIdZoom,
        status: 'not_started',
        price,
        statusPrice,
        timeRoom,
      });

      await newZoom.save();

      await CacheUtility.clearCache(`/api/videosdk/show-details-zoom/${newZoom._id}`);
      await Promise.all(
        newZoom.permissions.map(async (permissionId) => {
          const cacheKey = `/api/videosdk/show-user-student-zoom/${permissionId}`;
          await CacheUtility.clearCache(cacheKey);
        })
      );
      await CacheUtility.clearCache(`/api/videosdk/show-user-teacher-zoom/${userIdZoom}`);
      return res.status(200).json({
        status: 200,
        message: i18n.__('room.created'),
      });
    } catch (error) {
      logger.error('file: videosdk.controller.js:124 ~ error:', error);
      return res.status(200).json({
        status: 500,
        message: i18n.__('error.server'),
      });
    }
  }

  async showUserTeacherZoom(req, res) {
    try {
      const cacheKey = req.originalUrl;
      const { userIdZoom } = req.params;
      const rooms = await Zoom.find({ userIdZoom }).select('-token -roomDetails');
      if (rooms.length === 0) {
        return res.status(200).json({
          status: 404,
          message: i18n.__('room.not_found'),
        });
      }
      const userTeacher = await UserModel.findOne({ _id: userIdZoom });

      if (!userTeacher) {
        return res.status(404).json({
          status: 404,
          message: i18n.__('user.not_found'),
        });
      }

      const studentIds = rooms.map((room) => room.permissions).flat();

      const students = await UserModel.find({
        _id: { $in: studentIds },
      });
      const studentData = students.map((student) => ({
        _id: student._id,
        name: student.name,
        avatar: student.avatar,
      }));
      const roomsWithStudents = rooms.map((room) => ({
        ...room.toObject(),
        permissions: studentData.filter((student) => room.permissions.includes(student._id.toString())),
      }));
      await CacheUtility.setCache(cacheKey, {
        status: 200,
        message: i18n.__('room.got'),
        data: {
          rooms: roomsWithStudents,
          teacher: {
            id: userTeacher._id,
            name: userTeacher.name,
            avatar: userTeacher.avatar,
          },
        },
      });
      return res.status(200).json({
        status: 200,
        message: i18n.__('room.got'),
        data: {
          rooms: roomsWithStudents,
          teacher: {
            id: userTeacher._id,
            name: userTeacher.name,
            avatar: userTeacher.avatar,
          },
        },
      });
    } catch (err) {
      logger.error('file: videosdk.controller.js:190 ~ err:', err);
      return res.status(200).json({
        status: 500,
        message: i18n.__('error.server'),
      });
    }
  }

  async showUserStudentZoom(req, res) {
    try {
      const { userIdZoom } = req.params;
      const cacheKey = req.originalUrl;
      // Tìm kiếm các phòng Zoom mà sinh viên tham gia
      const rooms = await Zoom.find({ permissions: userIdZoom }).select('-token -roomDetails');

      if (rooms.length === 0) {
        return res.status(200).json({
          status: 404,
          message: i18n.__('room.not_found'),
        });
      }

      const studentIds = rooms.map((room) => room.permissions).flat();

      const students = await UserModel.find({
        _id: { $in: studentIds },
      });

      const studentData = students.map((student) => ({
        _id: student._id,
        name: student.name,
        avatar: student.avatar,
      }));
      // Tìm kiếm thông tin giáo viên
      const teacherIds = rooms.map((room) => room.userIdZoom).flat();
      const teachers = await UserModel.find({
        _id: { $in: teacherIds },
      });

      const teacherData = teachers.map((teacher) => ({
        _id: teacher._id,
        name: teacher.name,
        avatar: teacher.avatar,
      }));

      // Thêm thông tin giáo viên vào mỗi phòng
      const roomsWithDetails = rooms.map((room) => ({
        _id: room._id,
        userIdZoom: room.userIdZoom,
        title: room.title,
        status: room.status,
        startTime: room.startTime,
        endTime: room.endTime,
        permissions: studentData.filter((student) => room.permissions.includes(student._id.toString())),
      }));
      await CacheUtility.setCache(cacheKey, {
        status: 200,
        message: i18n.__('room.got'),
        data: {
          rooms: roomsWithDetails,
          teacher: {
            ...teacherData,
          },
        },
      });
      return res.status(200).json({
        status: 200,
        message: i18n.__('room.got'),
        data: {
          rooms: roomsWithDetails,
        },
      });
    } catch (err) {
      logger.error('file: videosdk.controller.js:263 ~ err:', err);
      return res.status(500).json({
        status: 500,
        message: i18n.__('error.server'),
      });
    }
  }

  async showDetailZoom(req, res) {
    try {
      const cacheKey = req.originalUrl;
      const { idRoom } = req.params;
      const rooms = await Zoom.find({ _id: idRoom });
      if (!rooms) {
        return res.status(200).json({
          status: 404,
          message: i18n.__('room.not_found'),
        });
      }
      await CacheUtility.setCache(cacheKey, {
        status: 200,
        message: i18n.__('room.got'),
        data: rooms,
      });
      return res.status(200).json({
        status: 200,
        message: i18n.__('room.got'),
        data: rooms,
      });
    } catch (err) {
      logger.error('file: videosdk.controller.js:293 ~ err:', err);
      return res.status(500).json({
        status: 500,
        message: i18n.__('error.server'),
      });
    }
  }

  async updateRoom(req, res) {
    const { id } = req.params;
    const { title, startTime, endTime, permissions, status } = req.body;
    try {
      const existingRoom = await Zoom.findById(id);
      if (!existingRoom) {
        return res.status(404).json({
          status: 404,
          message: i18n.__('room.not_found'),
        });
      }
      existingRoom.status = status || existingRoom.status;
      existingRoom.roomDetails = existingRoom.roomDetails;
      existingRoom.token = existingRoom.token;
      existingRoom.title = title || existingRoom.title;
      existingRoom.startTime = startTime || existingRoom.startTime;
      existingRoom.endTime = endTime || existingRoom.endTime;
      existingRoom.permissions = permissions || existingRoom.permissions;

      await existingRoom.save();

      await CacheUtility.clearCache(`/api/videosdk/show-details-zoom/${id}`);
      await Promise.all(
        existingRoom?.permissions.map(async (permissionId) => {
          const cacheKey = `/api/videosdk/show-user-student-zoom/${permissionId}`;
          await CacheUtility.clearCache(cacheKey);
        })
      );
      await CacheUtility.clearCache(`/api/videosdk/show-user-teacher-zoom/${existingRoom?.userIdZoom}`);
      return res.status(200).json({
        status: 200,
        message: i18n.__('room.updated'),
      });
    } catch (err) {
      logger.error('file: videosdk.controller.js:335 ~ err:', err);
      return res.status(500).json({
        status: 500,
        message: i18n.__('error.server'),
      });
    }
  }

  async deleteRoom(req, res) {
    const { id } = req.params;
    try {
      const existingRoom = await Zoom.findById(id);
      if (!existingRoom) {
        return res.status(404).json({
          status: 404,
          message: i18n.__('room.not_found'),
        });
      }
      await Zoom.findByIdAndDelete(id);
      await CacheUtility.clearCache(`/api/videosdk/show-details-zoom/${id}`);
      await Promise.all(
        existingRoom.permissions.map(async (permissionId) => {
          const cacheKey = `/api/videosdk/show-user-student-zoom/${permissionId}`;
          await CacheUtility.clearCache(cacheKey);
        })
      );
      await CacheUtility.clearCache(`/api/videosdk/show-user-teacher-zoom/${existingRoom?.userIdZoom}`);
      return res.status(200).json({
        status: 200,
        message: i18n.__('room.deleted'),
      });
    } catch (err) {
      logger.error('file: videosdk.controller.js:368 ~ err:', err);
      return res.status(500).json({
        status: 500,
        message: i18n.__('error.server'),
      });
    }
  }

  async johnRoom(req, res) {
    try {
      const { id } = req.params;
      const { userId } = req.body;
      const existingRoom = await Zoom.findById(id);
      if (!existingRoom) {
        return res.status(404).json({
          status: 404,
          message: i18n.__('room.not_found'),
        });
      }
      if (existingRoom.statusPrice === 'free') {
        await Zoom.findByIdAndUpdate(id, { $addToSet: { permissions: userId } }, { new: true });
        return res.status(200).json({
          status: 200,
          message: i18n.__('room.permissions_updated'),
        });
      } else if (existingRoom.statusPrice === 'paid') {
        const payment = new Payment({
          userIdTeacher: existingRoom.userIdZoom,
          userId,
          roomId: id,
          amount: existingRoom.price,
          status: 'pending',
        });
        await payment.save();

        return res.status(200).json({
          status: 200,
          message: i18n.__('room.permissions_updated'),
        });
      }
    } catch (e) {
      logger.error('file: videosdk.controller.js:368 ~ err:', err);
      return res.status(500).json({
        status: 500,
        message: i18n.__('error.server'),
      });
    }
  }

  async getAllPaymentsByUser(req, res) {
    try {
      const { userId } = req.params;

      // Find all payments for the given userId
      const payments = await Payment.find({ userId });

      // Check if there are any payments for this user
      if (!payments || payments.length === 0) {
        return res.status(404).json({
          status: 404,
          message: i18n.__('payment.no_payments_found'),
        });
      }

      // Return the list of payments
      return res.status(200).json({
        status: 200,
        data: payments,
        message: i18n.__('payment.all_payments_retrieved'),
      });
    } catch (err) {
      logger.error('file: videosdk.controller.js:~ getAllPaymentsByUser error:', err);
      return res.status(500).json({
        status: 500,
        message: i18n.__('error.server'),
      });
    }
  }

  async getAllPaymentsByUserTeacher(req, res) {
    try {
      const { userIdTeacher } = req.params;

      // Find all payments for the given userId
      const payments = await Payment.find({ userIdTeacher });

      // Check if there are any payments for this user
      if (!payments || payments.length === 0) {
        return res.status(404).json({
          status: 404,
          message: i18n.__('payment.no_payments_found'),
        });
      }

      // Return the list of payments
      return res.status(200).json({
        status: 200,
        data: payments,
        message: i18n.__('payment.all_payments_retrieved'),
      });
    } catch (err) {
      logger.error('file: videosdk.controller.js:~ getAllPaymentsByUser error:', err);
      return res.status(500).json({
        status: 500,
        message: i18n.__('error.server'),
      });
    }
  }

  async updatePaymentStatus(req, res) {
    try {
      const { paymentId } = req.params; // Payment ID from the route
      const { status, userId } = req.body; // New status and userId from the request body

      // Validate status
      if (!['pending', 'completed', 'failed'].includes(status)) {
        return res.status(400).json({
          status: 400,
          message: i18n.__('payment.invalid_status'),
        });
      }

      // Find and update the payment status
      const updatedPayment = await Payment.findByIdAndUpdate(paymentId, { status }, { new: true });

      // Check if the payment exists
      if (!updatedPayment) {
        return res.status(404).json({
          status: 404,
          message: i18n.__('payment.not_found'),
        });
      }

      // If payment is completed, add user to permissions
      if (status === 'completed') {
        // Ensure userId is provided
        if (!userId) {
          return res.status(400).json({
            status: 400,
            message: i18n.__('payment.missing_userId'),
          });
        }

        // Update the room's permissions to include the user
        await Zoom.findByIdAndUpdate(updatedPayment.roomId, { $addToSet: { permissions: userId } }, { new: true });
      }

      // Respond with success and updated payment data
      return res.status(200).json({
        status: 200,
        data: updatedPayment,
        message: i18n.__('payment.status_updated'),
      });
    } catch (err) {
      logger.error('file: videosdk.controller.js:~ updatePaymentStatus error:', err);
      return res.status(500).json({
        status: 500,
        message: i18n.__('error.server'),
      });
    }
  }
}

export default new VideoSDKController();
