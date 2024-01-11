import { BaseCustomError } from './index'
import { SerializedErrorOutput } from './type/serialized_error_output'

class NotAuthorizedError extends BaseCustomError {
	private statusCode = 422

	private defaultErrorMessage = 'Not authorized'

	constructor() {
		super('The email is already in the database')

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
export default NotAuthorizedError
