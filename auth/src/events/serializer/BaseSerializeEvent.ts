export abstract class BaseSerializeEvent<TRest = unknown> {
	abstract getStatusCode(): number
	abstract serializeRest(): TRest
}
