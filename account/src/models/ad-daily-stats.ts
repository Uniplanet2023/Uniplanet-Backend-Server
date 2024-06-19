import { model, Model, ObjectId, Schema } from 'mongoose';
import { Document } from 'mongoose';

export type AdDailyStatsDocument = Document & {
  advertiser: ObjectId;
  advertisement: string;
  date: Date;
  clickCount: number;
};

type AdDailyStatsAttrs = {
  advertiser: ObjectId;
  advertisement: string;
  date: Date;
  clickCount: number;
};

interface AdDailyStatsModel extends Model<AdDailyStatsDocument> {
  build(attrs: AdDailyStatsAttrs): AdDailyStatsDocument;
}

const adDailyStatsSchema: Schema = new Schema(
  {
    advertiser: { type: Schema.Types.ObjectId, ref: 'Advertiser', required: true },
    advertisement: { type: String, required: true },
    date: { type: Date, required: true },
    clickCount: { type: Number, default: 0 },
  },
  {
    toJSON: {
      transform(ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
    timestamps: true,
  }
);

adDailyStatsSchema.index({ advertiser: 1, advertisement: 1, date: 1 }, { unique: true });

adDailyStatsSchema.statics.build = (attrs: AdDailyStatsAttrs) => {
  return new AdDailyStats(attrs);
};

const AdDailyStats = model<AdDailyStatsDocument, AdDailyStatsModel>('AdDailyStats', adDailyStatsSchema);

export default AdDailyStats;