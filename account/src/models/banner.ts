import { Schema, Document, model, Model } from 'mongoose';

// Define the interface for the Banner document
export interface BannerDocument extends Document {
  link: string;
  image: string;
  company: string;
  numberOfClicks: number;
  impressions: number;
}

// Define the schema for the Banner model
const BannerSchema: Schema<BannerDocument> = new Schema(
  {
    link: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
      trim: true,
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    numberOfClicks: {
      type: Number,
      default: 0, // Initialize with 0 clicks
    },
    impressions: {
      type: Number,
      default: 0, // Initialize with 0 impressions
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  }
);

// Create the Banner model
const Banner: Model<BannerDocument> = model<BannerDocument>('Banner', BannerSchema);

export default Banner;