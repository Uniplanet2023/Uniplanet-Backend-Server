import express from 'express'
import createChatRouter from './create-chat'
import getChatRouter from './get-chat'
import getMessagesRouter from './get-messages'
import sendMessagesRouter from './send-message'
import deleteChatRouter from './delete-chat'

const chatRouter = express.Router()

chatRouter.use(deleteChatRouter)
chatRouter.use(sendMessagesRouter)
chatRouter.use(getMessagesRouter)
chatRouter.use(createChatRouter)
chatRouter.use(getChatRouter)

export default chatRouter
