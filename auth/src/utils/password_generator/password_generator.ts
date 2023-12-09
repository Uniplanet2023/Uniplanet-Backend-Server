import passwordGenerator from 'generate-password'

export const generatePassword = () => {
	const password = passwordGenerator.generate({
		length: 10,
		numbers: true,
		uppercase: true,
		symbols: true,
		lowercase: true,
		strict: true,
		exclude: '@#$%^&*()_+{}();\'"<>/',
	})
	return password
}
