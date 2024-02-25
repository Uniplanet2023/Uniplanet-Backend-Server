const secretCheck = () => {
	// COMMON ENV
	if (!process.env.SMTP_HOST) {
		throw new Error('SMTP_HOST tocken have to be define')
	}
	if (!process.env.SMTP_PORT) {
		throw new Error('SMTP_PORT tocken have to be define')
	}
	if (!process.env.MONGO_DB_HOST) {
		throw new Error('MONGO_DB_HOST tocken have to be define')
	}
	if (!process.env.JWT_TOKEN_SECRET) {
		throw new Error('JWT_TOKEN_SECRET tocken have to be define`')
	}
	if (!process.env.CLIENT_ID || !process.env.CLIENT_SECRET) {
		throw new Error('CLIENT_ID or CLIENT_SECRET have to be define')
	}
	if (!process.env.SMTP_MODE) {
		throw new Error('SMTP_MODE have to be define')
	}
	if(!process.env.REDIS_HOST){
		throw new Error('REDIS_HOST have to be define')
	}
	if(!process.env.REDIS_PORT){
		throw new Error('REDIS_PORT have to be define')
	}
	// Production , Development, Test, Example

	if (process.env.NODE_ENV! === 'production') {
		if (!process.env.KAFKA_BROKER) {
			throw new Error('KAFKA_BROKER have to be define')
		}
		if(process.env.SMTP_MODE! == 'gmail'){
			if (!process.env.REDIRECT_URI) {
				throw new Error('REDIRECT_URI have to be define')
			}
			if (!process.env.REFRESH_TOKEN) {
				throw new Error('REFRESH_TOKEN have to be define')
			}
		}
	}
}

export { secretCheck }
