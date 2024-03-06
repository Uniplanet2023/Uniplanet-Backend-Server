import { BaseSerializeEvent } from "@uniplanet-lib/common"
import { GetUserRestPayload } from "./type-def"
import { UserDocument } from "../../models/user"


export default class GetUserInfo extends BaseSerializeEvent<GetUserRestPayload> {
	private user: UserDocument

	private statusCode = 201

	constructor(user: UserDocument) {
		super()
		this.user = user
	}

	getStatusCode(): number {
		return this.statusCode
	}

	serializeRest(): GetUserRestPayload {
		return {
			id: this.user._id,
			name: this.user.name,
            email: this.user.email,
            profileImage: this.user.profileImage,
            school: this.user.school,
		}
	}
}
