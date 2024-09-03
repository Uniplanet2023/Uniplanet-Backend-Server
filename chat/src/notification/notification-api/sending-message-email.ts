import { otpGenerate } from '@uniplanet-lib/common'

import { firebaseAdmin } from '../..';
import { buildMessageEmailHtmlBody, buildMessageEmailSubject, BuildMessageEmailTextArgs, buildMessageEmailTextBody, } from '../format/signup-email-format';


// Function to send the sign-up verification email
export async function sendNewMessageEmail(args: BuildMessageEmailTextArgs): Promise<void> {

	const subject = buildMessageEmailSubject()
	const textBody = buildMessageEmailTextBody(args)
	const htmlBody = buildMessageEmailHtmlBody(args)
	firebaseAdmin
    .firestore()
    .collection('mail')
    .add({
      to: args.email,
      message: {
        subject: subject,
        text: textBody,
        html: htmlBody,
      },
    })
    .then(() => console.log('Queued email for delivery!'))
    .catch((error) => console.error('Error queuing email:', error));
	
}
