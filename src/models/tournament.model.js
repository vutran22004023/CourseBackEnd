import mongoose from 'mongoose';

const TournamentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Tên giải đấu không được để trống!'],
    },
    description: {
      type: String,
    },
    start: {
      type: Date,
      required: [true, 'Ngày bắt đầu không được để trống!'],
      default: Date.now,
    },
    end: {
      type: Date,
      required: [true, 'Ngày kết thúc không được để trống!'],
      validate: {
        validator: function (value) {
          return value > this.start;
        },
        message: 'Ngày kết thúc phải lớn hơn ngày bắt đầu!',
      },
    },
    ranking: [
      {
        player: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        rank: Number,
        pointsAwarded: Number,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Tournament', TournamentSchema);
