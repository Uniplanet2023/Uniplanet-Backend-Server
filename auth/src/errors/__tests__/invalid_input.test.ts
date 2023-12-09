import { InvalidInput } from '../index'
import { InvalidInputConstructorErrorsParam } from '../invalid_input'

it('should have a status code 422', () => {
	const invalidInputError = new InvalidInput()
	expect(invalidInputError.getStatusCode()).toEqual(422)
})
it('should return the erros in the serialized format', () => {
	const errors: InvalidInputConstructorErrorsParam = [
		{
			type: 'field',
			value: 'Valid12',
			msg: 'Password must be between 8 and 32 characters',
			path: 'password',
			location: 'body',
		},
		{
			type: 'field',
			value: 'Valid12',
			msg: 'Password must contain an uppercase letter',
			path: 'password',
			location: 'body',
		},
	]

	const invalidInputError = new InvalidInput(errors)
	const serializedErrors = invalidInputError.serializeErrorOutput()

	expect(serializedErrors.errors).toHaveLength(1)

	const { fields = {} } = serializedErrors.errors[0]

	expect(serializedErrors.errors[0].message).toEqual('The input provided is invalid.')
	expect(Object.keys(fields)).toHaveLength(1)
	expect(Object.keys(fields)).toEqual(['password'])
	expect(fields.password).toContain('Password must be between 8 and 32 characters')
	expect(fields.password).toContain('Password must contain an uppercase letter')
})
