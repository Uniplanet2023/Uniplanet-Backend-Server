import { Request, Response, NextFunction } from 'express'
import { validationResult } from 'express-validator'
import { InvalidInput } from '../errors'

export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
	const errors = validationResult(req)

	if (!errors.isEmpty()) {
		throw new InvalidInput(errors.array())
	}

	next()
}
