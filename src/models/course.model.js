import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import i18n from '../configs/i18n.config.js';

// Define schema for multiple-choice questions
const questionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, () => i18n.__('course.missing_question_title')],
  },
  options: {
    type: [
      {
        label: {
          type: String,
          required: [true, () => i18n.__('course.missing_answer_label')],
        },
        text: {
          type: String,
          required: [true, () => i18n.__('course.missing_answer')],
        },
      },
    ],
    validate: [
      {
        validator: function (arr) {
          return arr.length >= 2; // Ensure at least two answer options
        },
        message: () => i18n.__('course.more_answer'),
      },
      {
        validator: function (arr) {
          const labels = arr.map((option) => option.label);
          return labels.length === new Set(labels).size;
        },
        message: () => i18n.__('course.unique_answer_label'),
      },
    ],
  },
  correctAnswer: {
    type: String,
    required: [true, () => i18n.__('course.missing_correct_answer')],
    validate: {
      validator: function (value) {
        return this.options.some((option) => option.label === value);
      },
      message: () => i18n.__('course.missing_correct_answer_label'),
    },
  },
});
const videoSchema = new mongoose.Schema(
  {
    childname: {
      type: String,
      required: [true, () => i18n.__('video.missing_title')],
      validate: {
        validator: function (value) {
          return value.length > 255;
        },
        message: () => i18n.__('video.title_too_long'),
      },
    },
    childnameEN: {
      type: String,
    },
    videoType: {
      type: String,
      required: true,
      enum: ['video', 'exercise', 'videofile'],
    },
    video: {
      type: String,
      required: [
        function () {
          return this.videoType === 'video';
        },
        () => i18n.__('video.missing_link'),
      ],
      default: null,
    },
    videoFile: {
      type: String,
      default: null,
    },
    file: {
      type: String,
      default: null,
    },
    quiz: {
      type: [questionSchema],
      // validate: {
      //   validator: function (value) {
      //     return this.videoType !== 'exercise' || (value && value.length > 0);
      //   },
      //   message: 'Chưa có bài tập trắc nghiệm',
      // },
      default: [],
    },
    time: {
      type: String,
      default: null,
    },
    slug: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const chapterSchema = new mongoose.Schema(
  {
    namechapter: {
      type: String,
      required: [true, () => i18n.__('chapter.missing_title')],
      validate: {
        validator: function (value) {
          return value.length > 255;
        },
        message: () => i18n.__('chapter.title_too_long'),
      },
    },
    namechapterEN: {
      type: String,
    },
    videos: [videoSchema],
  },
  {
    timestamps: true,
  }
);

const courseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, () => i18n.__('course.missing_title')],
      validate: {
        validator: function (value) {
          return value.length > 255;
        },
        message: () => i18n.__('course.title_too_long'),
      },
    },
    nameEN: {
      type: String,
    },
    description: {
      type: String,
    },
    image: {
      type: String,
      default: null,
      validate: {
        validator: function (value) {
          return value.length > 255;
        },
        message: () => i18n.__('course.image_link_too_long'),
      },
    },
    video: {
      type: String,
      default: null,
    },
    chapters: [chapterSchema],
    price: {
      type: String,
      required: [true, () => i18n.__('course.missing_type')],
      enum: { values: ['free', 'paid'], message: () => i18n.__('course.type_limit') },
    },
    priceAmount: {
      type: Number,
      required: [
        function () {
          return this.price === 'paid';
        },
        () => i18n.__('course.missing_price'),
      ],
    },
    slug: {
      type: String,
      unique: true,
      required: [true, () => i18n.__('course.missing_slug')],
    },
    view: {
      type: Number,
      default: 0,
    },
    totalVideos: {
      type: Number,
      default: 0,
    },
    totalTime: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

mongoose.plugin(uniqueValidator);

export default mongoose.model('Course', courseSchema);
