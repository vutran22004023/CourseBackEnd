import { UserService } from '../services/index.js';
import { UserModel } from '../models/index.js';

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
      return res.status(404).json({
        message: err,
      });
    }
  }

  async getDetailUser(req, res) {
    try {
      const userid = req.params.id;
      if (!userid) {
        return res.status(200).json({
          status: 'ERR',
          message: 'Chưa truyền id',
        });
      }
      const response = await UserService.getDetailUser(userid);
      return res.status(200).json(response);
    } catch (err) {
      return res.status(404).json({
        message: err,
      });
    }
  }

  async updateUser(req, res) {
    try {
      const userid = req.params.id;
      const data = req.body;
      const isAdmin = req.user.isAdmin;
      if (!userid) {
        return res.status(200).json({
          status: 'ERR',
          message: 'Chưa truyền id',
        });
      }
      const response = await UserService.updateUser(userid, data, isAdmin);
      return res.status(200).json(response);
    } catch (err) {
      return res.status(404).json({
        message: err,
      });
    }
  }

  async deleteUser(req, res) {
    try {
      const userid = req.params.id;
      if (!userid) {
        return res.status(200).json({
          status: 'ERR',
          message: 'Chưa truyền id',
        });
      }
      const response = await UserService.deleteUser(userid);
      return res.status(200).json(response);
    } catch (err) {
      return res.status(404).json({
        message: err,
      });
    }
  }

  async deleteManyUser(req, res) {
    try {
      const userids = req.body.id;
      if (!userids) {
        return res.status(200).json({
          status: 'ERR',
          message: 'Chưa truyền id',
        });
      }
      const response = await UserService.deleteManyUser(userids);
      return res.status(200).json(response);
    } catch (err) {
      return res.status(404).json({
        message: err,
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
          message: 'Chưa điền đầy đủ thông tin',
        });
      } else if (!isCheckEmail) {
        return res.status(200).json({
          status: 'ERR',
          message: 'Email nhập chưa đúng',
        });
      }

      const response = await UserService.createUser(req.body);
      return res.status(200).json(response);
    } catch (err) {
      return res.status(500).json({
        message: err,
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
        message: 'Xem tất cả các người dùng',
        data: result,
        total: totalUsers,
        pageCurrent: pageValue,
        totalPage: Math.ceil(totalUsers / limitValue),
      });
    } catch (err) {
      return res.status(500).json({
        status: 500,
        message: 'Internal server error',
        error: err.message,
      });
    }
  }
}

export default new UserController();
