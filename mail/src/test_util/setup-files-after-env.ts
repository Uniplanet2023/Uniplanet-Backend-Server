import { EmailSender } from '../email-sender'

beforeEach(async () => {
	EmailSender.getInstance()
	EmailSender.resetEmailSenderInstance()
})
