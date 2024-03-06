import express from "express";
import createChatRouter from "./create-chat";
import getChatRouter from "./get-chat";


const chatRouter = express.Router();

chatRouter.use(createChatRouter);
chatRouter.use(getChatRouter);

export default chatRouter;