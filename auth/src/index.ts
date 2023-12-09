import mongoose from 'mongoose'

import server from './app'
import { EmailSender, NodemailerEmailApi } from './utils'
import redisInit from './redis_controller/redis_controller'
import socketInit from './socket/socket_router'
import { UserDeleteScheduler } from './scheduler'

const PORT = process.env.PORT || 3000

const emailSender = EmailSender.getInstance()

emailSender.activate()
emailSender.setEmailApi(new NodemailerEmailApi())
new UserDeleteScheduler().taskInitializer()

redisInit()
socketInit(server)
server.listen(PORT, async () => {
	console.log(`BackEnd Connection : BackEnd Server connected at port ${PORT}`)

	await mongoose.connect(process.env.MONGO_DB_HOST as string).then(() => {
		console.log('DB connection')
	})
})
