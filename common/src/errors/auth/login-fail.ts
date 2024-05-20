import { SignIn } from '../../api-status/signin'
import { BaseCustomError } from '../base-custom-error'
import { SerializedErrorOutput } from '../type/serialized-error-output'

export class LoginFailedError extends BaseCustomError {
	private statusCode = 401 // 401 Unauthorized

	private defaultErrorMessage = SignIn.LOGIN_FAILED

	constructor() {
		super(SignIn.LOGIN_FAILED)
		Object.setPrototypeOf(this, LoginFailedError.prototype)
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
