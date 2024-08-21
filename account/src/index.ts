import mongoose from 'mongoose'
import app from './app'

// import { secretCheck } from './secret-check'
import UserCreatedConsumer from './event/consumer/user-created'
import { kafkaClient, redisClient, Topics } from '@uniplanet-lib/common'
import { UserUpdateProducer } from './event/producer/UserUpdateProducer'
import UserDeletedConsumer from './event/consumer/user-deleted'
import UserUpdatedConsumer from './event/consumer/user-updated'
import { UserPostBlockProducer } from './event/producer/UserPostBlockProducer'
import { PostDeletionReqProducer } from './event/producer/PostDeletionReqProducer'
import ClickIncreaseConsumer from './event/consumer/product-click-increase'
import ProductIncreaseConsumer from './event/consumer/product-increase'
import { initializeFirebase } from './config/firebase'
import AccountDeleteScheduler from './scheduler/account-delete-schedule'
import UpdateFreeUserScheduler from './scheduler/update-free-user'
import DecNumberOfFreeItem from './event/consumer/dec-num-of-freeItem-click'

const PORT = process.env.PORT || 3002
kafkaClient.create('my-app', [process.env.KAFKA_BROKER! as string])

initializeFirebase()

export const userUpdateProducer = new UserUpdateProducer(kafkaClient.kafka)
export const userPostBlockProducer = new UserPostBlockProducer(kafkaClient.kafka)
export const postDeletionReqProducer = new PostDeletionReqProducer(kafkaClient.kafka)

app.listen(PORT, async () => {
	console.log(`BackEnd Connection : BackEnd Server connected at port ${PORT}`)

	// secretCheck()
	if (process.env.NODE_ENV == 'production') {
		const clickIncreaseConsumer = new ClickIncreaseConsumer(kafkaClient.kafka, 'click-increase')
		const userCreatedConsumer = new UserCreatedConsumer(kafkaClient.kafka, 'usercreated')
		const userDeletedConsumer = new UserDeletedConsumer(kafkaClient.kafka, 'userdeleted-account')
		const userUpdatedConsumer = new UserUpdatedConsumer(kafkaClient.kafka, 'userupdated-account')
		const productIncreaseConsumer = new ProductIncreaseConsumer(kafkaClient.kafka, 'product-increase')
		const DecreaseNumberOfFreeItemEvent = new DecNumberOfFreeItem(kafkaClient.kafka, Topics.DecNumberOfFreeItemClick);

		await productIncreaseConsumer.connect()
		await userUpdatedConsumer.connect()
		await userCreatedConsumer.connect()
		await userDeletedConsumer.connect()
		await clickIncreaseConsumer.connect()
		await DecreaseNumberOfFreeItemEvent.connect()

		await userUpdateProducer.connect()
		await userPostBlockProducer.connect()
		await postDeletionReqProducer.connect()
	}

	await mongoose.connect(`${process.env.MONGO_DB_HOST as string}`).then(async () => {
		console.log('MongoDB is connected')
		new AccountDeleteScheduler().taskInitializer()
		new UpdateFreeUserScheduler().taskInitializer()
		await redisClient.create(process.env.REDIS_HOST!, parseInt(process.env.REDIS_PORT!))
		redisClient.redis.on('error', err => console.log('Redis Client Error', err))
		await redisClient.redis.connect().then(() => {
			console.log('Redis is connected')
		})
	})
})
