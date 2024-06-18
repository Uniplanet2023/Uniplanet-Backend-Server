import { BaseSerializeEvent } from '@uniplanet-lib/common'
import { GetAccountRestPayload } from './type-def'
import { AccountDocument } from '../../models/account'

export default class GetAccountInfo extends BaseSerializeEvent<GetAccountRestPayload> {
	private account: AccountDocument

	private type: string

	private statusCode = 201

	constructor(account: AccountDocument, type: string) {
		super()
		this.type = type
		this.account = account
	}

	getStatusCode(): number {
		return this.statusCode
	}

	serializeRest(): GetAccountRestPayload {
		return {
			id: this.account._id,
			name: this.account.name,
			email: this.account.email,
			profileImage: this.account.profileImage,
			school: this.account.school,
			isBlocked: this.account.isBlocked,
			isBlockedPost: this.account.isBlockedPost,
			isBlockedChat: this.account.isBlockedChat,
			type: this.type,
		}
	}
}
