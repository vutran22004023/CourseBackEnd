import { UserModel } from '../../models/index.js';
import { TokenMiddleware } from '../../middlewares/index.js';
import sendEmailResetPassword from '../../emails/EmailforgotPassword.js';
import sendEmailAuthenticateuser from '../../emails/Emailauthenticateduser.js';
import bcrypt from 'bcrypt';
import i18n from 'i18n';
import logger from '../../configs/logger.config.js';

function generateRandomPassword(length) {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomPassword = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    randomPassword += charset[randomIndex];
  }
  return randomPassword;
}

const loginUserGoogle = async (data) => {
  try {
    const { displayName, email, photoURL } = data;
    const password = generateRandomPassword(15);
    const checkUser = await UserModel.findOne({ email: email });

    if (checkUser) {
      const access_Token = await TokenMiddleware.generateAccessToken({
        id: checkUser._id,
        isAdmin: checkUser.isAdmin,
      });
      const refresh_Token = await TokenMiddleware.generateRefreshToken({
        id: checkUser._id,
        isAdmin: checkUser.isAdmin,
      });
      return {
        status: 200,
        message: i18n.__('user.login'),
        id: checkUser._id,
        access_Token,
        refresh_Token,
      };
    } else {
      const hashedPassword = await bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS));
      const createdUser = await UserModel.create({
        name: displayName,
        email,
        password: hashedPassword,
        isAdmin: false,
        avatar: photoURL,
      });

      if (createdUser) {
        return {
          status: 200,
          message: i18n.__('user.registered'),
          data: {
            ...createdUser._doc,
            password: 'not password',
          },
        };
      }
    }
  } catch (err) {
    logger.err('Error creating user:', err);
    throw new Error(i18n.__('error.server'));
  }
};

const LoginIn = async (user) => {
  try {
    const { email, password } = user;
    const checkUser = await UserModel.findOne({
      email: email,
    });
    if (checkUser === null) {
      return {
        status: 'ERR',
        message: i18n.__('user.not_found'),
      };
    }
    const comparePasswords = bcrypt.compareSync(password, checkUser.password);
    if (!comparePasswords) {
      return {
        status: 'ERR',
        message: i18n.__('user.incorrect_password'),
      };
    }

    if (checkUser) {
      const access_Token = await TokenMiddleware.generateAccessToken({
        id: checkUser._id,
        isAdmin: checkUser.isAdmin,
      });
      const refresh_Token = await TokenMiddleware.generateRefreshToken({
        id: checkUser._id,
        isAdmin: checkUser.isAdmin,
      });
      return {
        status: 200,
        message: i18n.__('user.login'),
        id: checkUser._id,
        access_Token,
        refresh_Token,
      };
    }
  } catch (err) {
    logger.error('file: login_registerservice.js:106 ~ err:', err);
    return {
      status: 'ERR',
      message: i18n.__('error.server'),
    };
  }
};

const Register = async (user) => {
  try {
    const { name, email, password, role } = user;
    const hashedPassword = await bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS));
    const checkUser = await UserModel.findOne({
      email: email,
    });
    if (checkUser !== null) {
      return {
        status: 'ERR',
        message: i18n.__('user.existed'),
      };
    }
    const createdUser = await UserModel.create({
      name,
      email,
      password: hashedPassword,
      role,
    });
    if (createdUser) {
      const resetToken = await TokenMiddleware.generateAccessTokenResetPassword({
        id: createdUser._id,
      });
      await sendEmailAuthenticateuser(createdUser, resetToken);
      return {
        status: 200,
        message: i18n.__('user.registered'),
        data: {
          ...createdUser._doc,
          password: 'not password',
        },
      };
    }
  } catch (err) {
    logger.error('file: login_registerservice.js:148 ~ err:', err);
    return {
      status: 'ERR',
      message: i18n.__('error.server'),
    };
  }
};

const forgotPassword = async (email) => {
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return {
        status: 'ERR',
        message: i18n.__('user.not_exist_email'),
      };
    }

    const resetToken = await TokenMiddleware.generateAccessTokenResetPassword({
      id: user._id,
    });

    await sendEmailResetPassword(user, resetToken);
    return {
      status: 200,
      message: i18n.__('user.reset_password_email_sent'),
    };
  } catch (err) {
    logger.error('file: login_registerservice.js:176 ~ err:', err);
    return {
      status: 'ERR',
      message: i18n.__('error.server'),
    };
  }
};

const resetPassword = async (id, newPassword) => {
  try {
    const user = await UserModel.findById(id);
    if (!user) {
      return {
        status: 'ERR',
        message: i18n.__('user.not_found'),
      };
    }
    const hashedPassword = bcrypt.hashSync(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return {
      status: 200,
      message: i18n.__('user.password_reset'),
    };
  } catch (err) {
    logger.error('file: login_registerservice.js:202 ~ err:', err);
    return {
      status: 'ERR',
      message: i18n.__('error.server'),
    };
  }
};

const authenticateUser = async (id, status) => {
  try {
    const user = await UserModel.findById(id);
    if (!user) {
      return {
        status: 'ERR',
        message: i18n.__('user.not_found'),
      };
    }
    user.status = status;
    await user.save();
    return {
      status: 200,
      message: i18n.__('user.status_updated'),
    };
  } catch (err) {
    logger.error('file: login_registerservice.js:226 ~ err:', err);
    return {
      status: 'ERR',
      message: i18n.__('error.server'),
    };
  }
};

export default {
  LoginIn,
  Register,
  forgotPassword,
  resetPassword,
  authenticateUser,
  loginUserGoogle,
};
