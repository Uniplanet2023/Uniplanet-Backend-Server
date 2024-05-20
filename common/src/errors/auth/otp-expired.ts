import { Signup } from '../../api-status'
import { BaseCustomError } from '../base-custom-error'
import { SerializedErrorOutput } from '../type/serialized-error-output'

export class OTPExpiredError extends BaseCustomError {
	private statusCode = 410 // 410 Gone might be appropriate for expired resources, or 400 Bad Request

	private defaultErrorMessage = Signup.OTP_EXPIRED

	constructor() {
		super(Signup.OTP_EXPIRED)
		Object.setPrototypeOf(this, OTPExpiredError.prototype)
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
