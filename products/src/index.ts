import mongoose from 'mongoose'

import app from './app'

const PORT = process.env.PORT || 3001
app.listen(PORT, async () => {
	console.log(`BackEnd Connection : BackEnd Server connected at port ${PORT}`)
	if (!process.env.JWT_TOKEN_SECRET) {
		throw new Error('JWT_TOKEN_SECRET tocken have to be define')
	}
	console.log(process.env.JWT_TOKEN_SECRET)
	await mongoose.connect(`${process.env.MONGO_DB_HOST as string}/${process.env.MONGO_DB_NAME}`).then(() => {
		console.log('DB connection!!!')
	})
})
