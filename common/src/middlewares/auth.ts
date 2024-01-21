import { Request, Response, NextFunction } from 'express'
import { NotAuthorizedError } from '../errors'

export const auth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	if (!req.user) {
		throw new NotAuthorizedError()
	}
	next()
}
