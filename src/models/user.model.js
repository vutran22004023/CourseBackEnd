import mongoose from 'mongoose';

const TeacherInfoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  qualifications: {
    type: String,
    required: true,
  },
  experienceYears: {
    type: Number,
    required: true,
  },
  subjects: {
    type: [String], // Array of subjects taught by the teacher
    required: true,
  },
});

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
      required: true,
    },
    role: {
      type: String,
      enum: ['student', 'teacher'],
      required: function () {
        return !this.isAdmin;
      },
      default: function () {
        return this.isAdmin ? 'teacher' : null;
      },
      set: function (value) {
        if (this.isAdmin) {
          return 'teacher';
        }
        return value;
      },
    },
    teacherInfo: {
      type: TeacherInfoSchema,
      required: function () {
        return this.role === 'teacher';
      },
    },
    approvalStatus: {
      type: String,
      enum: ['not_qualified', 'pending', 'approved'],
      default: 'not_qualified',
      required: function () {
        return this.role === 'teacher';
      },
    },
    status: {
      type: Boolean,
      default: false,
      required: true,
    },
    avatar: {
      type: String,
      default: null,
    },
    point: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', UserSchema);

export default User;
