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
	EmailSender,
} from '@uniplanet-lib/common'

const signUpRouter = express.Router()

// Function to send the sign-up verification email
async function sendVerificationEmail(name:string,email:string) {
	const emailSender = EmailSender.getInstance();
	const { status, hash } = await emailSender.sendSignUpVerificationEmail({
	  name,
	  toEmail: email,
	});
	return { status, hash };
  }
  
signUpRouter.post(
	SIGNUP_ROUTE,
	[...emailValidation, nameValidation, profileImageValidation, schoolValidation, ...passwordValidation],
	validateRequest,
	async (req: Request, res: Response) => {
	  try {
		const { name, email, password, profileImage, school, type } = req.body;
		const existingUser = await User.findOne({ email });
  
		if (existingUser) {
		  if (existingUser.verified) {
			throw new DuplicatedEmail();
		  }
		  // User exists but not verified, resend verification email
		  const { hash } = await sendVerificationEmail(existingUser.name,existingUser.email);
		  const userSerialized = new UserSerializer(existingUser);
		  return res.status(userSerialized.getStatusCode()).json({ hash, ...userSerialized.serializeRest() });
		}
  
		// Create and save new user
		const newUser = User.build({ email, password, name, profileImage, school, type });
		await newUser.save();
		console.log('new User Created');
  
		// Send verification email to new user
		const { hash } = await sendVerificationEmail(newUser.name,newUser.email);
		const userSignedUp = new UserSerializer(newUser);
		return res.status(userSignedUp.getStatusCode()).json({ hash, ...userSignedUp.serializeRest()});
	  } catch (error) {
		// Handle errors gracefully
		console.error('Error during sign up:', error);
		return res.status(500).json({ error: 'Internal server error' });
	  }
	},
  );
  
  export default signUpRouter;