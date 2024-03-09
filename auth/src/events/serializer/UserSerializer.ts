import { UserDocument } from '../../models'
import { BaseSerializeEvent } from './BaseSerializeEvent'

interface UserSignedUpRestPayload {
	id: string
	email: string
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
			email: this.user.email,
			school: this.user.school,
			verified: this.user.verified,
			type: this.user.type,
		}
	}
}
