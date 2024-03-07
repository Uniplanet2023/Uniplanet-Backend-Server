export type BuildEmailVerificationLinkArgs = {
	emailVerificationToken: string
}
export type BuildSignUpVerificationEmailTextArgs = {
	otpCode: string
}

export const buildSignUpVerificationEmailTextBody = (args: BuildSignUpVerificationEmailTextArgs): string => {
	const { otpCode } = args
	return `Welcome to UniPlanet the coolest resell market platform!
    Please verify your email address using the following verification code: ${otpCode}.
    \nThe verification code is valid for 5 minutes. Please complete the verification as soon as possible.`
}

export const buildSignUpVerificationEmailHtmlBody = (args: BuildSignUpVerificationEmailTextArgs): string => {
	const {  otpCode } = args
	return `<h2>Welcome to UniPlanet the coolest resell market platform!</h2>
    <br> Please verify your email address using the following verification code: ${otpCode}.
    <br/><br/>
    The verification code is valid for 5 minutes. Please complete the verification as soon as possible.`
}
export const buildSignUpVerificationEmailSubject = (): string => {
	return `Welcome to Uniplanet! Please verify your email address`
}
