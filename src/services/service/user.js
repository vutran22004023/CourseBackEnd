import { UserModel } from '../../models/index.js';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import i18n from 'i18n';
import logger from '../../configs/logger.config.js';

const getAllUsers = async (limit, page, sort, filter) => {
  try {
    const totalUsers = await UserModel.countDocuments();
    const query = {};
    const options = {
      limit: limit,
      skip: page * limit,
    };
    if (filter) {
      query[filter[0]] = { $regex: filter[1], $options: 'i' };
    }
    if (sort) {
      options.sort = { [sort[1]]: sort[0] };
    }

    const allUsers = await UserModel.find(query, null, options).select('-password').lean();

    return {
      status: 200,
      message: i18n.__('user.view_all'),
      data: allUsers,
      total: totalUsers,
      pageCurrent: Number(page),
      totalPage: Math.ceil(totalUsers / limit),
    };
  } catch (err) {
    logger.error(`Get all users: ${err}`);
    return {
      status: 500,
      message: i18n.__('error.server'),
    };
  }
};

const getDetailUser = async (id) => {
  try {
    const checkUser = await UserModel.findOne({
      _id: id,
    }).select('-password');
    if (!checkUser) {
      return {
        status: 'ERR',
        message: i18n.__('user.not_found'),
      };
    }
    return {
      status: 200,
      message: i18n.__('user.detail', { id: checkUser.id }),
      data: {
        password: 'Not password',
        ...checkUser._doc,
      },
    };
  } catch (err) {
    logger.error(`Get detail user: ${err}`);
    return {
      status: 'ERR',
      message: i18n.__('error.server'),
    };
  }
};

const updateUser = async (id, data, isAdmin) => {
  try {
    const checkUser = await UserModel.findOne({
      _id: id,
    });
    if (!checkUser) {
      return {
        status: 'ERR',
        message: i18n.__('user.not_found'),
      };
    }
    if (!isAdmin) {
      delete data.isAdmin;
    }

    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    const updateUser = await UserModel.findByIdAndUpdate(id, data, { new: true });
    return {
      status: 200,
      message: i18n.__('user.updated', { id: updateUser._id }),
      data: {
        ...updateUser._doc,
      },
    };
  } catch (err) {
    logger.error(`Update user: ${err}`);
    return {
      status: 'ERR',
      message: i18n.__('error.server'),
    };
  }
};

const deleteUser = async (id) => {
  try {
    const checkUser = await UserModel.findOne({
      _id: id,
    });
    if (!checkUser) {
      return {
        status: 'ERR',
        message: i18n.__('user.not_found'),
      };
    }
    const deleteUser = await UserModel.findByIdAndDelete(id, { new: true });
    return {
      status: 200,
      message: i18n.__('user.deleted', { id: deleteUser._id }),
    };
  } catch (err) {
    logger.error(`Delete user: ${err}`);
    return {
      status: 'ERR',
      message: i18n.__('error.server'),
    };
  }
};

const deleteManyUser = async (ids) => {
  try {
    if (!Array.isArray(ids) || ids.length === 0) {
      return {
        status: 400,
        message: i18n.__('error.bad_request'),
      };
    }
    const validIds = ids.every((id) => mongoose.Types.ObjectId.isValid(id));
    if (!validIds) {
      return {
        status: 400,
        message: i18n.__('error.bad_request'),
      };
    }
    await UserModel.deleteMany({ _id: { $in: ids } });
    return {
      status: 200,
      message: i18n.__('user.deleted_many'),
    };
  } catch (err) {
    logger.error(`Delete many users: ${err}`);
    return {
      status: 'ERR',
      message: i18n.__('error.server'),
    };
  }
};

const createUser = async (user) => {
  try {
    const { name, email, password, role } = user;
    const hashedPassword = await bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS));
    const checkUser = await UserModel.findOne({
      email: email,
    });
    if (checkUser !== null) {
      return {
        status: 'ERR',
        message: 'Tài Khoản đã tồn tại',
      };
    }
    const createdUser = await UserModel.create({
      name,
      email,
      password: hashedPassword,
      role,
    });
    if (createdUser) {
      return {
        status: 200,
        message: i18n.__('user.created'),
        data: {
          ...createdUser._doc,
          // password: 'not password',
        },
      };
    }
  } catch (err) {
    logger.error(`Update user: ${err}`);
    return {
      status: 'ERR',
      message: i18n.__('error.server'),
    };
  }
};

export default {
  getAllUsers,
  getDetailUser,
  updateUser,
  deleteUser,
  deleteManyUser,
  createUser,
};
