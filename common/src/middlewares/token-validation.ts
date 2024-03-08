import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import { redisClient } from '../redis-client'

interface UserPayload {
	id: string
	name: string
	email: string
	school: string
	verified: string
}
declare global {
	// eslint-disable-next-line @typescript-eslint/no-namespace
	namespace Express {
		interface Request {
			user?: UserPayload
		}
	}
}

export const tokenValidation = async (req: Request, res: Response, next: NextFunction) => {
	if (!req.session?.jwt) {
		return res.status(401).send({ access: false })
	}
	const payload = jwt.verify(req.session.jwt, process.env.JWT_TOKEN_SECRET as string) as UserPayload
	req.user = payload
	next()
}

export const getingUserData = async (req: Request, res: Response, next: NextFunction) => {
	const seller = await redisClient.redis.get(req.user?.id as string);
	if (!seller) {
		return res.status(404).send({ message: 'User in not found in Session Storage' })
	}
	const sellerObj = JSON.parse(seller); // Fallback to an empty object if seller is not found
	req.user = { ...req.user, ...sellerObj }
	next()
}