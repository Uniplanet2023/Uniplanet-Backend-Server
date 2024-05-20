import { Signup } from '../../api-status'
import { BaseCustomError } from '../base-custom-error'
import { SerializedErrorOutput } from '../type/serialized-error-output'

export class VerificationRequiredError extends BaseCustomError {
	private statusCode = 403 // 403 Forbidden is commonly used for lack of user verification

	private defaultErrorMessage = Signup.VERIFICATION_REQUIRED

	constructor() {
		super(Signup.VERIFICATION_REQUIRED)
		Object.setPrototypeOf(this, VerificationRequiredError.prototype)
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
