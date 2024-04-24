import { SignIn } from '../../api-status/signin'
import { BaseCustomError } from '../base-custom-error'
import { SerializedErrorOutput } from '../type/serialized-error-output'

export class UserNotFoundError extends BaseCustomError {
	private statusCode = 404 // 404 Not Found
	
	private defaultErrorMessage = SignIn.USER_NOT_FOUND

	constructor() {
		super(SignIn.USER_NOT_FOUND)
		Object.setPrototypeOf(this, UserNotFoundError.prototype)
	}

	getStatusCode(): number {
		return this.statusCode
	}

	serializeErrorOutput(): SerializedErrorOutput {
		return {
			errors: [{ message: this.defaultErrorMessage }],
		}
	}
}
