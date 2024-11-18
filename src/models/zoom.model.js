import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const RoomDetailsSchema = new mongoose.Schema({
  roomId: {
    type: String,
    required: true,
  },
  apiKey: {
    type: String,
    required: true,
  },
  webhook: {
    events: {
      type: [String],
      default: [],
    },
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  autoCloseConfig: {
    type: {
      type: String,
      default: 'session-end',
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  links: {
    get_room: {
      type: String,
    },
    get_session: {
      type: String,
    },
  },
  id: {
    type: String,
    required: true,
  },
});
const ZoomSchema = new mongoose.Schema({
  userIdZoom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['not_started', 'in_progress', 'completed'],
    default: 'not_started',
  },
  statusPrice: {
    type: String,
    enum: ['free', 'paid'],
    default: 'free',
  },
  price: {
    type: String,
    required: function () {
      return this.statusPrice === 'paid';
    },
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  timeRoom: {
    type: Date,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  roomDetails: RoomDetailsSchema,
  permissions: [{ type: String }],
});

ZoomSchema.plugin(uniqueValidator);

const Zoom = mongoose.model('Zoom', ZoomSchema);

export { Zoom };
