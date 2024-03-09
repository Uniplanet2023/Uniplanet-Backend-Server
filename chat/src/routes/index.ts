import express from "express";
import createChatRouter from "./create-chat";
import getChatRouter from "./get-chat";
import getMessagesRouter from "./get-messages";

const chatRouter = express.Router();
chatRouter.use(getMessagesRouter);
chatRouter.use(createChatRouter);
chatRouter.use(getChatRouter);

export default chatRouter;