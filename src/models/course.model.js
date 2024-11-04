import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

// Define schema for multiple-choice questions
const questionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Câu hỏi không có tiêu đề'],
  },
  options: {
    type: [
      {
        label: {
          type: String,
          required: [true, 'Chưa có nhãn cho đáp án'],
        },
        text: {
          type: String,
          required: [true, 'Chưa có nội dung cho đáp án'],
        },
      },
    ],
    validate: [
      {
        validator: function (arr) {
          return arr.length >= 2; // Ensure at least two answer options
        },
        message: 'Phải có ít nhất hai đáp án',
      },
      {
        validator: function (arr) {
          const labels = arr.map((option) => option.label);
          return labels.length === new Set(labels).size;
        },
        message: 'Các nhãn đáp án phải là duy nhất',
      },
    ],
  },
  correctAnswer: {
    type: String,
    required: [true, 'Chưa có câu trả lời đúng'],
    validate: {
      validator: function (value) {
        return this.options.some((option) => option.label === value);
      },
      message: 'Câu trả lời đúng phải khớp với một trong các nhãn đáp án',
    },
  },
});
const videoSchema = new mongoose.Schema(
  {
    childname: {
      type: String,
      maxLength: [255, 'Tiêu đề video quá dài'],
      required: [true, 'Chưa có tiêu đề video'],
    },
    videoType: {
      type: String,
      required: true,
      enum: ['video', 'exercise'],
    },
    video: {
      type: String,
      required: [
        function () {
          return this.videoType === 'video';
        },
        'Chưa có đường dẫn video',
      ],
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
      maxLength: [255, 'Tiêu đề chương quá dài'],
      required: [true, 'Chưa có tiêu đề chương'],
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
      maxLength: [255, 'Tiêu đề khóa học quá dài'],
      required: [true, 'Chưa có tiêu đề khóa học'],
    },
    description: {
      type: String,
      // required: [true, 'Chưa có mô tả khóa học'],
    },
    image: {
      type: String,
      maxLength: [255, 'Đường dẫn hình ảnh vượt quá 255 ký tự'],
      default: null,
    },
    video: {
      type: String,
      default: null,
    },
    chapters: [chapterSchema],
    price: {
      type: String,
      required: [true, 'Chưa chọn loại khóa học'],
      enum: { values: ['free', 'paid'], message: 'Loại khóa học chỉ cho phép giá trị free hoặc paid' },
    },
    priceAmount: {
      type: Number,
      required: [
        function () {
          return this.price === 'paid';
        },
        'Chưa có số tiền',
      ],
    },
    slug: {
      type: String,
      unique: true,
      required: [true, 'Chưa có slug của khóa học'],
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
