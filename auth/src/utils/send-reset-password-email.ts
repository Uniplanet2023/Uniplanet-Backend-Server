import { generatePassword } from '@uniplanet-lib/common';
import firebaseAdmin from 'firebase-admin';
import { buildResetPasswordEmailBody, buildResetPasswordEmailHtml, buildResetPasswordEmailSubject } from '../config/reset-password-email-format';

export function sendResetPasswordEmail(email: string):string {
  const tempPassword = generatePassword();
  const subject = buildResetPasswordEmailSubject();
  const textBody = buildResetPasswordEmailBody(tempPassword);
  const htmlBody = buildResetPasswordEmailHtml(tempPassword);

  firebaseAdmin
    .firestore()
    .collection('mail')
    .add({
      to: email,
      message: {
        subject: subject,
        text: textBody,
        html: htmlBody,
      },
    })
    .then(() => console.log('Queued email for delivery!'))
    .catch((error) => console.error('Error queuing email:', error));
    return tempPassword;
}