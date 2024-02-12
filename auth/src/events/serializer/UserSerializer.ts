import { UserDocument } from '../../models'
import { BaseSerializeEvent } from './BaseSerializeEvent'

interface UserSignedUpRestPayload {
	id: string
	name: string
	email: string
	profileImage: string
	school: string
	verified: boolean
	type: string
}

export default class UserSerializer extends BaseSerializeEvent<UserSignedUpRestPayload> {
	private user: UserDocument

	private statusCode = 201

	constructor(user: UserDocument) {
		super()
		this.user = user
	}

	getStatusCode(): number {
		return this.statusCode
	}

	serializeRest(): UserSignedUpRestPayload {
		return {
			id: this.user._id,
			name: this.user.name,
			email: this.user.email,
			profileImage: this.user.profileImage,
			school: this.user.school,
			verified: this.user.verified,
			type: this.user.type,
		}
	}
}
