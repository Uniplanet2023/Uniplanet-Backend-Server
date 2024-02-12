const secretCheck = () => {
	if (!process.env.JWT_TOKEN_SECRET) {
		throw new Error('JWT_TOKEN_SECRET tocken have to be define`')
	}
	if (!process.env.SMTP_HOST) {
		throw new Error('SMTP_HOST tocken have to be define')
	}
	if (!process.env.SMTP_PORT) {
		throw new Error('SMTP_PORT tocken have to be define')
	}
	if (!process.env.MONGO_DB_HOST) {
		throw new Error('MONGO_DB_HOST tocken have to be define')
	}
	if (process.env.NODE_ENV == 'production') {
		if (!process.env.KAFKA_BROKER) {
			throw new Error('KAFKA_BROKER have to be define')
		}
	}
}

export { secretCheck }
