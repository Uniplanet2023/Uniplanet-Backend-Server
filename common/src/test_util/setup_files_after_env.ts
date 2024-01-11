import { EmailSender } from '../utils'

beforeEach(async () => {
	EmailSender.getInstance()
	EmailSender.resetEmailSenderInstance()
})
