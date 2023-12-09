import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import { EmailSender } from '../utils'

let mongoMemoryServer: MongoMemoryServer

beforeAll(async () => {
	mongoMemoryServer = await MongoMemoryServer.create()
	const mongoUri = mongoMemoryServer.getUri()
	await mongoose.connect(mongoUri, { minPoolSize: 1, maxPoolSize: 5 })
})
beforeEach(async () => {
	const allCollections = await mongoose.connection.db.collections()
	allCollections.forEach(async collection => {
		await collection.deleteMany({})
	})
	EmailSender.getInstance()
	EmailSender.resetEmailSenderInstance()
})
afterAll(async () => {
	await mongoMemoryServer.stop()
	await mongoose.connection.close()
})
