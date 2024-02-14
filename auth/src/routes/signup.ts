import express, { Request, Response } from 'express'
import { User } from '../models'
import UserSerializer from '../events/serializer/UserSerializer'
import { SIGNUP_ROUTE } from './routes-def'
import {
	emailValidation,
	nameValidation,
	passwordValidation,
	profileImageValidation,
	schoolValidation,
	DuplicatedEmail,
	validateRequest,
} from '@uniplanet-lib/common'
import { UserCreatedProducer } from '../events'
import { kafkaClient } from '../kafka-client'

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
			if (process.env.NODE_ENV == 'production') {
				const message = {
					name: user.name,
					email: user.email,
				}
				const userCreateProducer = new UserCreatedProducer(kafkaClient.kafka)
				await userCreateProducer.connect()
				await userCreateProducer.sendMessage(message)
			}
			const userSignedUp = await new UserSerializer(user)
			
			return res.status(userSignedUp.getStatusCode()).json(userSignedUp.serializeRest())
		}

		const newUser = User.build({ email, password, name, profileImage, school, type })
		await newUser.save()
		console.log('new User Created')
		const userSignedUp = await new UserSerializer(newUser)
		const message = {
			name: newUser.name,
			email: newUser.email,
		}
		if (process.env.NODE_ENV == 'production') {
			const userCreateProducer = new UserCreatedProducer(kafkaClient.kafka)
			await userCreateProducer.connect()
			await userCreateProducer.sendMessage(message)
		}

		return res.status(userSignedUp.getStatusCode()).json(userSignedUp.serializeRest())
	},
)

export default signUpRouter
