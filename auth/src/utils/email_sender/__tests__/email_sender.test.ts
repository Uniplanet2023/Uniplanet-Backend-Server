import { EmailSender } from '../../index'
import { MockEmailApi, mockSendSignUpVerificationEmail } from '../../../test_util/mock_email_api'

const sendSignUpVerificationArgs = {
	name: 'sije',
	toEmail: 'test@test.com',
	emailVerificationToken: 'whatever',
}

it('should throw an error when sending an email if the EmailSender is deactivated', async () => {
	const emailSender = EmailSender.getInstance()
	emailSender.deactivate()
	await expect(emailSender.sendSignUpVerificationEmail(sendSignUpVerificationArgs)).rejects.toThrow(
		'EmailSender is not active',
	)
})

it('should throw an error when sending an email if the EmailApi is not set', async () => {
	const emailSender = EmailSender.getInstance()
	emailSender.activate()
	await expect(emailSender.sendSignUpVerificationEmail(sendSignUpVerificationArgs)).rejects.toThrow(
		'EmailApi is not set',
	)
})

it('should send the signup verification email if the sender is active and the EmailApi is set ', async () => {
	const emailSender = EmailSender.getInstance()
	const mockEmailApi = new MockEmailApi()

	emailSender.activate()
	emailSender.setEmailApi(mockEmailApi)

	const res = await emailSender.sendSignUpVerificationEmail(sendSignUpVerificationArgs)
	expect(res.toEmail).toEqual('test@test.com')
	expect(mockSendSignUpVerificationEmail).toHaveBeenCalledTimes(1)
})
