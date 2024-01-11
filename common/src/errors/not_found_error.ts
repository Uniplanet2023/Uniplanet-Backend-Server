import BaseCustomError from './base_custom_error'
import { SerializedErrorOutput } from './type/serialized_error_output'

class NotFoundError extends BaseCustomError {
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
export default NotFoundError
