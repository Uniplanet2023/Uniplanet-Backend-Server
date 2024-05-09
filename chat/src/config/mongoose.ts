import mongoose from "mongoose"
import DeleteScheduler from "../scheduler/delete-scheduler"

export async function initializeMongooseWithScheduler(): Promise<void> {
    await mongoose.connect(`${process.env.MONGO_DB_HOST as string}`).then(() => {
		console.log('MongoDB is connected')
		new DeleteScheduler().taskInitializer()
	})
}
