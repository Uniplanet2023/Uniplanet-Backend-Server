import mongoose from "mongoose";

export type ChatDocument = mongoose.Document & {
    productId: mongoose.Types.ObjectId;
    buyer: mongoose.Types.ObjectId;
    seller: mongoose.Types.ObjectId;
    lastMessage: mongoose.Types.ObjectId;
};

type ChatAttrs = {
    productId: String;
    buyer: String;
    seller: String;
    lastMessage?: String;
};

interface ChatModel extends mongoose.Model<ChatDocument> {
    build(attrs: ChatAttrs): ChatDocument;
}

const chatModel = new mongoose.Schema({
    productId:{ type: mongoose.Schema.Types.ObjectId, required: true},
    seller: { type: mongoose.Schema.Types.ObjectId, required: true},
    buyer: { type: mongoose.Schema.Types.ObjectId, required: true},
    lastMessage: { type: mongoose.Schema.Types.ObjectId, ref:"Message", default: null },
    deletionDate: { type: Date, default: null },
},{ timestamps: true });

chatModel.statics.build = (attrs: ChatAttrs) => {
    return new Chat(attrs);
}

const Chat = mongoose.model<ChatDocument, ChatModel>("Chat", chatModel);

export default Chat;

