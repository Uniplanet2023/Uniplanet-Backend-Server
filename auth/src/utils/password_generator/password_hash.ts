import { scryptSync, randomBytes } from 'crypto'

export type PasswordHashToHashSyncArgs = {
	password: string
}
export type PassswordHashCompareSynArgs = {
	providedPassword: string
	storedPassword: string
}

const PASSWORD_HASH_KEYLEN = 64
export default class PasswordHash {
	static toHashSync(args: PasswordHashToHashSyncArgs): string {
		const { password } = args

		const salt = randomBytes(16).toString('hex')
		const buffer = scryptSync(password, salt, PASSWORD_HASH_KEYLEN)

		return `${buffer.toString('hex')}.${salt}`
	}

	static compareSync(args: PassswordHashCompareSynArgs): boolean {
		const { providedPassword, storedPassword } = args

		// storedPassword = erwkah3f3fajkr3h3.rjkhwr33 (hash.salt)
		const [hash, salt] = storedPassword.split('.')

		const buffer = scryptSync(providedPassword, salt, PASSWORD_HASH_KEYLEN)

		return buffer.toString('hex') === hash
	}
}
