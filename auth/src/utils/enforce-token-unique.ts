import { UserDocument } from "../models"
import { redisClient } from "../redis-client"
import jwt from 'jsonwebtoken'
export async function enforceTokenUniqueness(user: UserDocument) {
	let token
	let tokenExists

	do {
		// Regenerate the token here. This is a placeholder operation.
		// For JWTs, you might adjust the payload or add a nonce to ensure uniqueness.
		token = jwt.sign(
			{
				id: user.id,
				email: user.email,
                name: user.name,
				verified: user.verified,
				school: user.school,
			},
			process.env.JWT_TOKEN_SECRET!,
			{
				issuer: 'UniPlanet',
				subject: 'userInfo',
			},
		)

		// Check again if the new token exists in Redis
		const tempToken = await redisClient.redis.get(user.id)
		tokenExists = tempToken === token
	} while (tokenExists)

	// Once a unique token is generated, set it in Redis
	await redisClient.redis.set(user.id, token);

	return token
}