import { SignIn } from '../../api-status/signin'
import { BaseCustomError } from '../base-custom-error'
import { SerializedErrorOutput } from '../type/serialized-error-output'

export class PasswordMismatchError extends BaseCustomError {
	private statusCode = 401
	
	private defaultErrorMessage = SignIn.PASSWORD_DOES_NOT_MATCH

	constructor() {
		super(SignIn.PASSWORD_DOES_NOT_MATCH)
		Object.setPrototypeOf(this, PasswordMismatchError.prototype)
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
