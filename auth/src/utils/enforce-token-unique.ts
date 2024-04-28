import { UserDocument } from '../models'
import jwt from 'jsonwebtoken'
export async function generateToken(user: UserDocument) {
	const token = jwt.sign(
		{
			id: user.id,
			email: user.email,
			school: user.school,
			type: user.type,
		},
		process.env.JWT_TOKEN_SECRET!,
		{
			issuer: 'UniPlanet',
			subject: 'userInfo',
		},
	)

	return token
}
