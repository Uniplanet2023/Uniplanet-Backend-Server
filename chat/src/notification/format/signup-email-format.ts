export type BuildMessageEmailTextArgs = {
	email: string
	senderName: string
	receiverName: string
}

export const buildMessageEmailTextBody = (args: BuildMessageEmailTextArgs): string => {
	return `Hi ${args.receiverName}
    You have a new message from ${args.receiverName} on UniPlanet!
    \nTo view and respond to the message, simply open the UniPlanet app and navigate to your inbox.
	\nIf you have any questions or need assistance, feel free to reach out to our support team at uniplanet.info@gmail.com.
	\nThank you for being a part of the UniPlanet community!
	`
}

export const buildMessageEmailHtmlBody = (args: BuildMessageEmailTextArgs): string => {
    return `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h2 style="color: #4CAF50;">Hi ${args.receiverName},</h2>
            <p>You have a new message from <strong>${args.senderName}</strong> on UniPlanet!</p>
            <p>To view and respond to the message, simply open the <a href="https://uniplanet.shop" style="color: #4CAF50; text-decoration: none;">UniPlanet app</a> and navigate to your inbox.</p>
            <p>If you have any questions or need assistance, feel free to reach out to our support team at <a href="mailto:uniplanet.info@gmail.com" style="color: #4CAF50; text-decoration: none;">uniplanet.info@gmail.com</a>.</p>
            <p>Thank you for being a part of the UniPlanet community!</p>
            <br>
            <p style="font-size: 12px; color: #777;">&copy; ${new Date().getFullYear()} UniPlanet LLC. All rights reserved.</p>
        </div>
    `;
};
export const buildMessageEmailSubject = (): string => {
	return `You Have a New Message on UniPlanet!`
}
