import express, { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { User, UserDocument } from '../models/index'
import { validateRequest, PasswordHash, emailValidation, passwordValidation } from '@uniplanet-lib/common'
import { SIGNIN_ROUTE } from './routes-def'
import UserSerializer from '../events/serializer/UserSerializer'
import { redisClient } from '../redis-client'


async function enforceTokenUniqueness(user:UserDocument) {
	let token;
	let tokenExists;
  
	do {
	  // Regenerate the token here. This is a placeholder operation.
	  // For JWTs, you might adjust the payload or add a nonce to ensure uniqueness.
	  token = jwt.sign({
		id: user.id,
		email: user.email,
		verified: user.verified,
		// Additional payload data
		nonce: Math.random() // Example nonce to alter the JWT
	  }, process.env.JWT_TOKEN_SECRET!, {
		issuer: 'UniPlanet',
		subject: 'userInfo',
	  });
  
	  // Check again if the new token exists in Redis
	  tokenExists = await redisClient.redis.exists(token);
	} while (tokenExists)
  
	// Once a unique token is generated, set it in Redis
	await redisClient.redis.set(token,JSON.stringify({verified:true}));
  
	return token;
  }
const signInRouter = express.Router()
signInRouter.post(
	SIGNIN_ROUTE,
	[...emailValidation, ...passwordValidation],
	validateRequest,
	async (req: Request, res: Response) => {
		const { email, password } = req.body

		const user = await User.findOne({ email })
		if (!user || !user.verified) throw new Error('Invalid Credential')

		const isMatch = PasswordHash.compareSync({ providedPassword: password, storedPassword: user.password })
		if (!isMatch) throw new Error('Invalid Credential')
		
		// Generate JWT
		const userJwt = await enforceTokenUniqueness(user);

		// Store it on session object
		req.session = { jwt: userJwt };

		const currentUser = new UserSerializer(user)
		res.status(202).send({'access':true})
	},
)

export default signInRouter
