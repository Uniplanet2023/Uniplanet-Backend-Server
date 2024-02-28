import { Common } from '../../api-status/common'
import { BaseCustomError } from '../index'
import { SerializedErrorOutput } from '../type/serialized-error-output'

export class NotAuthorizedError extends BaseCustomError {
	private statusCode = 422

	private defaultErrorMessage = Common.NOT_AUTHORIZED

	constructor() {
		super(Common.NOT_AUTHORIZED)

		Object.setPrototypeOf(this, NotAuthorizedError.prototype)
	}

	getStatusCode(): number {
		return this.statusCode
	}

	serializeErrorOutput(): SerializedErrorOutput {
		return {
			errors: [
				{
					message: this.defaultErrorMessage,
				},
			],
		}
	}
}