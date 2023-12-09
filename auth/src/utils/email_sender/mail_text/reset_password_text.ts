export const buildResetPasswordEmailSubject = (): string => {
	return `Your New Password`
}

export const buildResetPasswordEmailBody = (password: string): string => {
	return `
    We've received a request to reset your password for your Uniplanet Marketplace account.
    To make it easier for you, we've generated a temporary password that you can use to log in immediately.

    Temporary Password: ${password}

    Please use this temporary password to log in to your Uniplanet Marketplace account. We highly recommend changing this temporary password to your preferred one after you log in for security reasons.
    `
}

export const buildResetPasswordEmailHtml = (password: string): string => {
	return `
    We've received a request to reset your password for your Uniplanet Marketplace account.
    To make it easier for you, we've generated a temporary password that you can use to log in immediately.
    <br/>
    <h4>Temporary Password: ${password}</h4>
    <br/>
    Please use this temporary password to log in to your Uniplanet Marketplace account. We highly recommend changing this temporary password to your preferred one after you log in for security reasons.
    `
}
