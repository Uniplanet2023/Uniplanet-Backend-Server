import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'

interface UserPayload {
	id: string
	email: string
}
declare global {
	// eslint-disable-next-line @typescript-eslint/no-namespace
	namespace Express {
		interface Request {
			user?: UserPayload
		}
	}
}

const tokenValidation = async (req: Request, res: Response, next: NextFunction) => {
	if (!req.session?.jwt) {
		return next()
	}
	const payload = jwt.verify(req.session.jwt, process.env.JWT_TOKEN_SECRET as string) as UserPayload
	req.user = payload
	next()
}

export default tokenValidation
