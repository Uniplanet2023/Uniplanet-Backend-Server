
import mongoose from "mongoose";

export type MessageDocument = mongoose.Document & {
    sender: mongoose.Types.ObjectId;
    receiver: mongoose.Types.ObjectId;
    message: String;
    messageType: String;
    readDate: Date;
    chat: mongoose.Types.ObjectId;
    createdAt: Date;
};

type MessageAttrs = {
    sender: String;
    message: String;
    messageType: String;
    receiver: String;
    chat: String;
    createdAt: Date;
};

interface MessageModel extends mongoose.Model<MessageDocument> {
    build(attrs: MessageAttrs): MessageDocument;
}

const messageModel = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, required: true},
    message: { type: String, required: true},
    messageType: { type: String, required: true, default: "text"},
    receiver: { type: mongoose.Schema.Types.ObjectId, required: true},
    chat:{ type: mongoose.Schema.Types.ObjectId, required: true, ref: "Chat", index: true},
    readDate: { type: Date },
},{ timestamps: true });

messageModel.statics.build = (attrs: MessageAttrs) => {
    return new Message(attrs);
}

const Message = mongoose.model<MessageDocument, MessageModel>("Message", messageModel);

export default Message;

