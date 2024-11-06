import mongoose from 'mongoose';

const FooterItemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    items: [
      {
        label: {
          type: String,
          required: true,
          trim: true,
        },
        link: {
          type: String,
          trim: true,
        },
      },
    ],
  },
  { _id: false }
);

const SocialMediaSchema = new mongoose.Schema(
  {
    platform: {
      type: String,
      required: true,
      trim: true,
    },
    url: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false }
);

const RouteSchema = new mongoose.Schema(
  {
    route: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      default: '',
    },
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      default: '',
    },
    description: {
      type: String,
      required: true,
      trim: true,
      default: '',
    },
  },
  { _id: false }
);

const ContactInfoSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
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
    description: {
      type: String,
    },
    paths: {
      type: [RouteSchema],
      required: true,
    },
    logo: {
      type: String,
    },
    logoSmall: {
      type: String,
    },
    footer: {
      type: [FooterItemSchema],
    },
    socialMediaLinks: {
      type: [SocialMediaSchema],
    },
    contactInfo: {
      type: ContactInfoSchema,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('InformationPage', InformationPageSchema);
