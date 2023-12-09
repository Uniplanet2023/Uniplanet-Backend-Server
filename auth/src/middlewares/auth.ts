import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'

declare module 'express-serve-static-core' {
	interface Request {
		user?: string
		token?: string
	}
}

const auth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const token = req.header('x-auth-token')
		if (!token) {
			res.status(401).json({ msg: 'No auth token, access denied' })
			return
		}

		const verified = jwt.verify(token, process.env.JWT_TOKEN_SECRET as string) as jwt.JwtPayload
		if (!verified) {
			res.status(401).json({ msg: 'Token verification failed, authorization denied.' })
			return
		}

		req.user = verified.id
		req.token = token
		next()
	} catch (err) {
		console.error('Middleware Auth has issues!!')
		if (err instanceof Error) {
			res.status(500).json({ error: err.message })
		}
	}
}

export default auth
