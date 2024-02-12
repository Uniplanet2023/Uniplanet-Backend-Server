import { BaseCustomError } from './base-custom-error'
import { SerializedErrorOutput } from './type/serialized-error-output'

export class NotFoundError extends BaseCustomError {
	statusCode = 404

	constructor() {
		super('Route not found')
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

