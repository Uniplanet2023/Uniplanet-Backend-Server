import mongoose from "mongoose";

export type LikeDocument = mongoose.Document & {
    user: mongoose.Types.ObjectId;
    productId: mongoose.Types.ObjectId;  
};

type LikeAttrs = {
    user: String;
    productId: String;
};

interface LikeModel extends mongoose.Model<LikeDocument> {
    build(attrs: LikeAttrs): LikeDocument;
}

const likeModel = new mongoose.Schema({
    user:{ type: mongoose.Schema.Types.ObjectId, required: true},
    productId: { type: mongoose.Schema.Types.ObjectId, required: true},
    deletionDate: { type: Date, default: null },
},{ timestamps: true });

likeModel.statics.build = (attrs: LikeAttrs) => {
    return new Like(attrs);
}

const Like = mongoose.model<LikeDocument, LikeModel>("Like", likeModel);

export default Like;

