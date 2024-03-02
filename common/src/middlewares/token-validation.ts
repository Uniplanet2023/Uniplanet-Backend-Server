import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'

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

