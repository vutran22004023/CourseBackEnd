import * as dotenv from 'dotenv';
import axios from 'axios';
dotenv.config();
import jwt from 'jsonwebtoken';
import { Zoom } from '../models/zoom.model.js';
import { UserModel } from '../models/index.js';

const API_KEY = process.env.VIDEOSDK_API_KEY;
const SECRET = process.env.VIDEOSDK_SECRET_KEY;
const URL = process.env.VIDEOSDK_URL;

const createTokenVideoSDK = (permissions) => {
  const options = {
    expiresIn: '120m',
    algorithm: 'HS256',
  };
  const payload = {
    apikey: API_KEY,
    permissions: permissions, // `ask_join` || `allow_mod`
    version: 2,
  };
  const token = jwt.sign(payload, SECRET, options);
  return token;
};

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
    console.error('Error creating meeting:', error);
    const errorResponse = {
      status: 200,
      message: 'Internal Server Error',
      error: error.message || 'An unexpected error occurred.',
    };
    throw new Error(JSON.stringify(errorResponse));
  }
};

// Controller cho VideoSDK
class VideoSDKController {
  async createRoomZoom(req, res) {
    try {
      const { title, startTime, endTime, userIdZoom, permissions } = req.body;

      const createToken = createTokenVideoSDK(permissions);
      if (!createToken) {
        return res.status(200).json({
          status: 400,
          message: 'Error generating token',
        });
      }

      const createIdZoom = await createRoomVideoSDK(createToken);

      if (!createIdZoom) {
        return res.status(200).json({
          status: 400,
          message: 'Error creating room, no roomId returned',
        });
      }

      const newZoom = new Zoom({
        userIdZoom,
        title,
        startTime,
        endTime,
        token: createToken,
        roomDetails: createIdZoom,
        permissions,
        status: 'not_started',
      });

      await newZoom.save();

      return res.status(200).json({
        status: 200,
        message: 'Room created and saved successfully',
      });
    } catch (error) {
      return res.status(200).json({
        status: 500,
        message: 'Internal Server Error',
        error: error.message,
      });
    }
  }
  async showUserTeacherZoom(req, res) {
    try {
      const { userIdZoom } = req.params;
      const rooms = await Zoom.find({ userIdZoom }).select('-token -roomDetails');
      if (rooms.length === 0) {
        return res.status(200).json({
          status: 404,
          message: 'No rooms found for this user.',
        });
      }
      const userTeacher = await UserModel.findOne({ _id: userIdZoom });

      if (!userTeacher) {
        return res.status(404).json({
          status: 404,
          message: 'User not found.',
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

      return res.status(200).json({
        status: 200,
        message: 'Rooms retrieved successfully',
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
      return res.status(200).json({
        status: 500,
        message: 'Internal Server Error',
        error: err.message,
      });
    }
  }

  async showUserStudentZoom(req, res) {
    try {
      const { userIdZoom } = req.params;

      // Tìm kiếm các phòng Zoom mà sinh viên tham gia
      const rooms = await Zoom.find({ permissions: userIdZoom }).select('-token -roomDetails');

      if (rooms.length === 0) {
        return res.status(200).json({
          status: 404,
          message: 'No rooms found for this student.',
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
        teacher: teacherData,
      }));

      return res.status(200).json({
        status: 200,
        message: 'Rooms retrieved successfully',
        data: {
          rooms: roomsWithDetails,
        },
      });
    } catch (err) {
      return res.status(500).json({
        status: 500,
        message: 'Internal Server Error',
        error: err.message,
      });
    }
  }
}

export default new VideoSDKController();
