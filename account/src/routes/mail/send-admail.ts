import express, { Request, Response } from 'express';
import { firebaseAdmin } from '../..';
import { tokenValidation } from '@uniplanet-lib/common';
import { SEND_USER_MAIL } from '../routes-def';
import Account from '../../models/account';  // Import the Account model

export const sendMailRouter = express.Router();

// Define the interface for the request body
interface MailRequestBody {
  title: string;
  description?: string;  // Optional if using HTML content
  toEmail?: string;  // Optional if you want to send to a specific user
  type: string;
  html?: string;  // Optional if using plain text description
}

// Route to send mail
sendMailRouter.post(SEND_USER_MAIL, tokenValidation, async (req: Request, res: Response) => {
  const { title, description, toEmail, html, } = req.body as MailRequestBody;

  try {
    let emails: string[] = [];

    // If toEmail is provided, send only to that email, otherwise send to all users
    if (toEmail) {
      emails.push(toEmail);
    } else {
      // Fetch all users' emails from the Account collection
      const users = await Account.find({}, 'email');  // Only select the email field
      emails = users.map(user => user.email);
    }
    
    // Send an email to each user
    const emailPromises = emails.map(email => {
      return firebaseAdmin
        .firestore()
        .collection('mail')
        .add({
          to: email,
          message: {
            subject: title,
            html: html || '',  // Default to an empty string if not provided
            text: description || '',  // Default to an empty string if not provided
          },
        });
    });

    // Wait for all emails to be sent
    await Promise.all(emailPromises);

    return res.status(200).json({ message: 'Emails sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({ message: 'Failed to send emails', error });
  }
});

export default sendMailRouter;