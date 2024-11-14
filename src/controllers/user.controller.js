import { UserService } from '../services/index.js';
import { UserModel } from '../models/index.js';
import i18n from 'i18n';

class UserController {
  async getAllUsers(req, res) {
    try {
      //GET /api/users?limit=10&page=0&sort=asc:name&filter=name:John
      const { limit, page, sort, filter } = req.query;
      const limitValue = parseInt(limit) || 30;
      const pageValue = parseInt(page) || 0;
      const sortArray = sort ? sort.split(':') : null;
      const filterArray = filter ? filter.split(':') : null;
      const response = await UserService.getAllUsers(limitValue, pageValue, sortArray, filterArray);
      return res.status(200).json(response);
    } catch (err) {
      return res.status(500).json({
        message: i18n.__('error.server'),
      });
    }
  }

  async getDetailUser(req, res) {
    try {
      const userid = req.params.id;
      const response = await UserService.getDetailUser(userid);
      return res.status(200).json(response);
    } catch (err) {
      return res.status(500).json({
        message: i18n.__('error.server'),
      });
    }
  }

  async updateUser(req, res) {
    try {
      const userid = req.params.id;
      const data = req.body;
      const isAdmin = req.user.isAdmin;
      const response = await UserService.updateUser(userid, data, isAdmin);
      return res.status(200).json(response);
    } catch (err) {
      return res.status(500).json({
        message: i18n.__('error.server'),
      });
    }
  }

  async deleteUser(req, res) {
    try {
      const userid = req.params.id;
      const response = await UserService.deleteUser(userid);
      return res.status(200).json(response);
    } catch (err) {
      return res.status(500).json({
        message: i18n.__('error.server'),
      });
    }
  }

  async deleteManyUser(req, res) {
    try {
      const userids = req.body.id;
      const response = await UserService.deleteManyUser(userids);
      return res.status(200).json(response);
    } catch (err) {
      return res.status(500).json({
        message: i18n.__('error.server'),
      });
    }
  }

  async createUser(req, res) {
    try {
      const { name, email, password, role } = req.body;
      const mailformat = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
      const isCheckEmail = mailformat.test(email);
      if (!name || !email || !password || !role) {
        return res.status(200).json({
          status: 'ERR',
          message: i18n.__('error.bad_request'),
        });
      } else if (!isCheckEmail) {
        return res.status(200).json({
          status: 'ERR',
          message: i18n.__('user.incorrect_email'),
        });
      }

      const response = await UserService.createUser(req.body);
      return res.status(200).json(response);
    } catch (err) {
      return res.status(500).json({
        message: i18n.__('error.server'),
      });
    }
  }

  async getSearchUsers(req, res) {
    try {
      const { limit, page, sort, filter } = req.query;

      const limitValue = parseInt(limit) || 30;
      const pageValue = parseInt(page) || 0;

      const query = {};
      const options = {
        limit: limitValue,
        skip: pageValue * limitValue,
        sort: {},
      };

      if (filter) {
        const filterArray = filter.split(':');
        query[filterArray[0]] = { $regex: filterArray[1], $options: 'i' }; // Tìm kiếm không phân biệt hoa thường
      }

      if (sort) {
        const sortArray = sort.split(':');
        options.sort[sortArray[1]] = sortArray[0] === 'asc' ? 1 : -1; // Sắp xếp tăng dần hoặc giảm dần
      }

      const totalUsers = await UserModel.countDocuments(query);

      const allUsers = await UserModel.find(query, null, options)
        .select('-password') // Loại bỏ trường password
        .lean();

      // Chọn trường cần thiết từ kết quả
      const result = allUsers.map((user) => ({
        _id: user._id,
        name: user.name,
        avatar: user.avatar,
      }));

      // Trả về kết quả
      return res.status(200).json({
        status: 200,
        message: i18n.__('user.view_all'),
        data: result,
        total: totalUsers,
        pageCurrent: pageValue,
        totalPage: Math.ceil(totalUsers / limitValue),
      });
    } catch (err) {
      return res.status(500).json({
        message: i18n.__('error.server'),
      });
    }
  }

  async formTeacherUser (req, res) {
    const { userId, name, qualifications, experienceYears, subjects } = req.body;
    try {
      let user = await UserModel.findOne({
        _id: userId,
      }).select('-password');
      if (!user) {
        return res.status(404).json({ message: i18n.__('user.not_found') });
      }
      user.teacherInfo = {
        name,
        qualifications,
        experienceYears,
        subjects,
      };
      user.approvalStatus = 'pending';
      await user.save();

      res.status(200).json({ message: i18n.__('user.formTeacherUser'), user });
    } catch (err) {
      return res.status(500).json({
        message: i18n.__('error.server'),
      });
    }
  }

  async approveTeacher (req, res) {
      const { userId } = req.params;
      const { approvalStatus } = req.body;
      try {
        let user = await UserModel.findOne({
          _id: userId,
        }).select('-password');
        if (!user) {
          return res.status(404).json({ message: i18n.__('user.not_found') });
        }
        user.approvalStatus = 'teacher';
        user.approvalStatus = approvalStatus;
        await user.save();
        res.status(200).json({ message: i18n.__('user.approveTeacher'), user });
      } catch (err) {
      return res.status(500).json({
        message: i18n.__('error.server'),
      });
    }
  }

  async approveTeacherStatus(req, res) {
    try {
      const { status } = req.params;
      const { page = 1, limit = 10 } = req.query; // Default page 1, limit 10
  
      // Validate the status parameter
      if (!['not_qualified', 'pending', 'approved'].includes(status)) {
        return res.status(400).json({ message: 'Invalid approval status' });
      }
  
      // Convert page and limit to integers
      const pageNumber = parseInt(page, 10);
      const limitNumber = parseInt(limit, 10);
  
      // Calculate the skip value for pagination
      const skip = (pageNumber - 1) * limitNumber;
  
      // Query teacher applicants with pagination and sorting by `createdAt` in descending order
      const teacherApplicants = await UserModel.find({ approvalStatus: status })
        .sort({ createdAt: -1 }) // Sort by timestamps in descending order
        .skip(skip)
        .limit(limitNumber)
        .select('-password');
  
      // Get the total count of applicants for the given status
      const totalApplicants = await UserModel.countDocuments({ approvalStatus: status });
  
      res.status(200).json({
        status,
        message: `Teacher applicants with status: ${status}`,
        currentPage: pageNumber,
        totalPages: Math.ceil(totalApplicants / limitNumber),
        totalApplicants,
        teacherApplicants,
      });
    } catch (e) {
      return res.status(500).json({
        message: i18n.__('error.server'),
      });
    }
  }
  
}

export default new UserController();
