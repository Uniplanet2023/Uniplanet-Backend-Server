export type BuildMessageEmailTextArgs = {
	email: string
	senderName: string
	receiverName: string
}

export const buildMessageEmailTextBody = (args: BuildMessageEmailTextArgs): string => {
	return `Hi ${args.senderName}
    You have a new message from ${args.receiverName} on UniPlanet!
    \nTo view and respond to the message, simply open the UniPlanet app and navigate to your inbox.
	\nIf you have any questions or need assistance, feel free to reach out to our support team at uniplanet.info@gmail.com.
	\nThank you for being a part of the UniPlanet community!
	`
}

export const buildMessageEmailHtmlBody = (args: BuildMessageEmailTextArgs): string => {
	return `<h2>Hi ${args.senderName}</h2>
    <br> You have a new message from ${args.receiverName} on UniPlanet!
    <br/>
    \nTo view and respond to the message, simply open the UniPlanet app and navigate to your inbox.
	\nIf you have any questions or need assistance, feel free to reach out to our support team at uniplanet.info@gmail.com.
	\nThank you for being a part of the UniPlanet community!`
}
export const buildMessageEmailSubject = (): string => {
	return `You Have a New Message on UniPlanet!`
}
