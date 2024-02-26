import { Common } from '../api-status/common'
import { BaseCustomError } from './base-custom-error'
import { SerializedErrorOutput } from './type/serialized-error-output'

export class NotFoundError extends BaseCustomError {
	statusCode = 404

	constructor() {
		super(Common.NOT_FOUND)
		Object.setPrototypeOf(this, NotFoundError.prototype)
	}

	getStatusCode(): number {
		return this.statusCode
	}

	serializeErrorOutput(): SerializedErrorOutput {
		return {
			errors: [{ message: 'Not Found' }],
		}
	}
}

