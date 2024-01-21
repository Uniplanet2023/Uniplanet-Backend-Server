import { SerializedErrorOutput } from './type/serialized-error-output'

export abstract class BaseCustomError extends Error {
	protected constructor(message?: string) {
		super(message)

		Object.setPrototypeOf(this, BaseCustomError.prototype)
	}
	abstract getStatusCode(): number
	abstract serializeErrorOutput(): SerializedErrorOutput
}
