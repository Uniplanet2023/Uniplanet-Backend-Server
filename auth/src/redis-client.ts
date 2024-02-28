import { RedisClientType, createClient } from 'redis'

class RedisClient {
	private _redisClient?: RedisClientType

	async create(host: string, port: number) {
		// eslint-disable-next-line no-underscore-dangle
		this._redisClient = await createClient({
			socket: {
				host,
				port,
			},
		})
	}

	get redis() {
		//eslint-disable-next-line no-underscore-dangle
		if (!this._redisClient) {
			throw new Error('Cannot access Redis client before creating it ')
		}
		//eslint-disable-next-line no-underscore-dangle
		return this._redisClient
	}
}

export const redisClient = new RedisClient()
