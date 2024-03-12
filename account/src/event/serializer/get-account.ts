import { BaseSerializeEvent } from '@uniplanet-lib/common'
import { GetAccountRestPayload, UserRestPayload } from './type-def'
import { AccountDocument } from '../../models/account'

export default class GetAccountInfo extends BaseSerializeEvent<GetAccountRestPayload> {
	private account: AccountDocument
	private user: UserRestPayload

	private statusCode = 201

	constructor(account: AccountDocument, user: UserRestPayload) {
		super()
		this.user = user
		this.account = account
	}

	getStatusCode(): number {
		return this.statusCode
	}

	serializeRest(): GetAccountRestPayload {
		return {
			id: this.account._id,
			name: this.user.name,
			email: this.user.email,
			profileImage: this.user.profileImage,
			school: this.user.school,
			unreadNotification: this.account.unreadNotification,
			unreadMessage: this.account.unreadMessage,
			searchHistory: this.account.searchHistory,
			recentViewHistory: this.account.recentViewHistory,
		}
	}
}
