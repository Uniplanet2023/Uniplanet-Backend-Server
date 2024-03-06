import { UserDocument } from "../models"
import jwt from 'jsonwebtoken'
export async function enforceTokenUniqueness(user: UserDocument) {
	const token = jwt.sign(
		{
			id: user.id,
			email: user.email,
			name: user.name,
			school: user.school,
		},
		process.env.JWT_TOKEN_SECRET!,
		{
			issuer: 'UniPlanet',
			subject: 'userInfo',
		},
	)

	return token
}