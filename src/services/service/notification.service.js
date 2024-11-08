import Notification from '../../models/notification.model.js';
import admin from '../../configs/firebase_admin.config.js';
import i18n from 'i18n';
import logger from '../../configs/logger.config.js';

class NotificationService {
  async send(data) {
    try {
      let { title, content, icon } = data;
      const notification = await Notification.create({ title, content, icon });
      const message = {
        topic: 'test',
        notification: {
          title: notification.title,
          body: notification.content,
          icon: notification.icon,
        },
        webpush: {
          fcm_options: {
            link: process.env.URL_CLIENT,
          },
        },
      };
      await admin.messaging().send(message);
      return {
        status: 200,
        message: i18n.__('notification.sent'),
      };
    } catch (err) {
      logger.error(`Notification send error: ${err}`);
      return {
        status: 'ERR',
        message: i18n.__('error.server'),
      };
    }
  }

  async delete(id) {
    try {
      const result = await Notification.deleteOne({ _id: id });
      return {
        status: 200,
        data: result,
        message: i18n.__('notification.deleted'),
      };
    } catch (err) {
      logger.error(`Notification delete error: ${err}`);
      return {
        status: 'ERR',
        message: i18n.__('error.server'),
      };
    }
  }

  async deleteAll() {
    try {
      const result = await Notification.deleteMany();
      return {
        status: 200,
        data: result,
        message: i18n.__('notification.deleted_all'),
      };
    } catch (err) {
      logger.error(`Notification send error: ${err}`);
      return {
        status: 'ERR',
        message: i18n.__('error.server'),
      };
    }
  }

  async get(limit, page, sort, filter) {
    const total = await Notification.countDocuments();
    const query = {};
    const options = {
      limit: limit,
      skip: page * limit,
    };
    if (filter) {
      query[filter[0]] = { $regex: filter[1], $options: 'i' };
    }
    options.sort = { [sort[1]]: sort[0] };

    const result = await Notification.find(query, null, options).lean();

    return {
      status: 200,
      message: '',
      data: result,
      total: total,
      pageCurrent: Number(page),
      totalPage: Math.ceil(total / limit),
    };
  }
}

export default new NotificationService();
