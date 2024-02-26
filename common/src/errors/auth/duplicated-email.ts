import { Signup } from '../../api-status/signup'
import { BaseCustomError } from '../index'
import { SerializedErrorOutput } from '../type/serialized-error-output'
// TODO: rethink naming
export class DuplicatedEmail extends BaseCustomError {
	private statusCode = 422

	private defaultErrorMessage = Signup.DUPLICATE_EMAIL

	constructor() {
		super(Signup.DUPLICATE_EMAIL)

		Object.setPrototypeOf(this, DuplicatedEmail.prototype)
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
