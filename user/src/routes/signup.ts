import express, { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import { User } from '../models'
import { SEND_OTP_ROUTE, SIGNUP_ROUTE, VERIFY_OTP_ROUTE } from './routes_def'
import {
	UserDocument,
	emailValidation,
	nameValidation,
	passwordValidation,
	profileImageValidation,
	schoolValidation,
	EmailSender,
	verifyOtp,
	DuplicatedEmail,
	InvalidInput,
	validateRequest,
	GetUserInfo,
} from '@uniplanet-lib/common'
// import { natsWrapper } from '../nats_wrapper'
// import { TicketCreatedPublisher } from '../events/publisher/ticket-created-publisher'

// signup -> database is store your user info -> sending verify meesage
// SignIn -> if you are not verify -> go to OTP page.
//
// Function to handle sending verification email
async function sendVerificationEmail(user: UserDocument) {
	const emailSender = EmailSender.getInstance()
	const { status, hash } = await emailSender.sendSignUpVerificationEmail({
		name: user.name,
		toEmail: user.email,
	})
	const userSignedUp = await new GetUserInfo(user)
	return { status, hash, userInfo: userSignedUp.serializeRest(), statusCode: userSignedUp.getStatusCode() }
}

const signUpRouter = express.Router()

signUpRouter.post(
	SIGNUP_ROUTE,
	[...emailValidation, nameValidation, profileImageValidation, schoolValidation, ...passwordValidation],
	validateRequest,
	async (req: Request, res: Response) => {
		const { name, email, password, profileImage, school, type } = req.body
		const user = await User.findOne({ email })

		if (user) {
			if (user.verified) throw new DuplicatedEmail()
			const response = await sendVerificationEmail(user)
			return res.status(response.statusCode).json(response)
		}

		const newUser = User.build({ email, password, name, profileImage, school, type })
		await newUser.save()

		const response = await sendVerificationEmail(newUser)
		return res.status(response.statusCode).json(response)
	},
)

signUpRouter.post(SEND_OTP_ROUTE, [...emailValidation], validateRequest, async (req: Request, res: Response) => {
	const errors = validationResult(req).array()
	if (errors.length > 0) throw new InvalidInput(errors)

	const { email } = req.body
	const user = await User.findOne({ email })
	if (!user) throw new Error('No User')
	if (user.verified) throw new DuplicatedEmail()

	const response = await sendVerificationEmail(user)
	return res.status(response.statusCode).json(response)
})

signUpRouter.post(VERIFY_OTP_ROUTE, async (req: Request, res: Response) => {
	try {
		const { otpHash, email, otpCode } = req.body
		const result = await verifyOtp({ otpHash, email, otpCode })

		switch (result) {
			case 'Success':
				await User.findOneAndUpdate({ email }, { verified: true })
				return res.status(200).json({ message: result })
			case 'OTP expired':
				return res.status(401).json({ message: result })
			case 'Invalid Verification number':
				return res.status(401).json({ message: result })
			default:
				return res.status(400).json({ message: 'Invalid response' })
		}
	} catch (error) {
		res.status(400).json({ message: 'Error while processing OTP', error })
	}
})

export default signUpRouter
