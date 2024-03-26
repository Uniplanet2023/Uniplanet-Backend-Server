import { BaseSerializeEvent } from '@uniplanet-lib/common'
import { GetAccountRestPayload, UserRestPayload } from './type-def'
import { AccountDocument } from '../../models/account'

export default class GetAccountInfo extends BaseSerializeEvent<GetAccountRestPayload> {
	private account: AccountDocument

	private statusCode = 201

	constructor(account: AccountDocument) {
		super()
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
			unreadNotification: this.account.unreadNotification,
			unreadMessage: this.account.unreadMessage,
			searchHistory: this.account.searchHistory,
			recentViewHistory: this.account.recentViewHistory,
		}
	}
}
