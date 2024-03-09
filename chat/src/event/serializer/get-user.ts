import { BaseSerializeEvent } from "@uniplanet-lib/common"
import { GetUserRestPayload } from "./type-def"
import { UserModel } from "../../models/user"



export default class GetUserInfo extends BaseSerializeEvent<GetUserRestPayload> {
	private user: UserModel

	private statusCode = 201

	constructor(user: UserModel) {
		super()
		this.user = user
	}

	getStatusCode(): number {
		return this.statusCode
	}

	serializeRest(): GetUserRestPayload {
		return {
			id: this.user.id,
			name: this.user.name,
            email: this.user.email,
            profileImage: this.user.profileImage,
            school: this.user.school,
		}
	}
}
