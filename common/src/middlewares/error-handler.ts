import { Response, Request, NextFunction } from 'express'
import { BaseCustomError } from '../errors'

export const errorHandler = (err: Error, req: Request, res: Response, _next: NextFunction): Response => {
	if (err instanceof BaseCustomError) {
		return res.status(err.getStatusCode()).send(err.serializeErrorOutput())
	}

	console.log(err)

	return res.sendStatus(500)
}
