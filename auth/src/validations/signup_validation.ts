import { body } from 'express-validator'
import { urlInfo } from '../utils/domain_check'

export const emailValidation = [
	body('email')
		.isEmail()
		.custom(async value => {
			if (/.+@[A-Z]/g.test(value)) {
				throw new Error('Email is not normalized')
			}
		})
		.withMessage('Email is not normalized')
		.normalizeEmail(),
	body('email')
		.custom(async value => {
			const info = urlInfo(value)
			console.log(`${value}  D=${info.domain}  S=${info.subdomain ? info.subdomain : 'None'}  TLD:${info.tld}`)
			if (info.tld !== 'edu') {
				throw new Error('It should be .edu email')
			}
		})
		.withMessage('It should be .edu email'),
]
export const nameValidation = body('name').isString().withMessage('Name should be String')
export const profileImageValidation = body('profileImage').isURL().withMessage('Profile Image should be URL')
export const schoolValidation = body('school').isString().withMessage('School should be String')
export const verifiedValidation = body('verified').isBoolean().withMessage('verified should be boolean value')
export const passwordValidation = [
	body('password').trim().isLength({ min: 8, max: 32 }).withMessage('Password must be between 8 and 32 characters'),
	body('password')
		.matches(/^(.*[a-z].*)$/)
		.withMessage('Password must contain at least one lowercase letter'),
	body('password')
		.matches(/^(.*[A-Z].*)$/)
		.withMessage('Password must contain at least one uppercase letter'),
	body('password')
		.matches(/^(.*\d.*)$/)
		.withMessage('Password must contain at least one digit'),
	body('password').isStrongPassword().withMessage('Password should be Strong Enough'),
	body('password').trim(),
]
