import mongoose from 'mongoose';

const RouteSchema = new mongoose.Schema(
  {
    route: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      default: "",
    },
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      default: "",
    },
    description: {
      type: String,
      required: true,
      trim: true,
      default: "",
    },
  },
  { _id: false }
);

const InformationPageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description:{
      type: String,
    },
    paths: {
      type: [RouteSchema], 
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('InformationPage', InformationPageSchema);
