import { createClient, RedisClientType } from 'redis'

export let pubClient: RedisClientType

const redisInit = async (): Promise<void> => {
	pubClient = createClient({
		password: process.env.REDIS_PASSWORD, // Use environment variable
		socket: {
			host: process.env.REDIS_HOST,
			port: parseInt(process.env.REDIS_PORT || '6379', 10),
		},
	})

	// Redis DB Setting
	pubClient.on('error', () => {
		// TODO: Handle error
	})
	pubClient.on('connect', () => {
		// TODO: Handle connect
	})

	// DB, Redis Connections

	await pubClient.connect()
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const set = async (key: string, value: any): Promise<void> => {
	try {
		if (!pubClient) {
			throw new Error('Redis client is not initialized')
		}
		await pubClient.set(key, JSON.stringify(value), {
			EX: 36000,
			NX: true,
		})
	} catch (e) {
		console.error(e)
	}
}

export const get = async (key: string): Promise<string | false> => {
	try {
		if (!pubClient) {
			throw new Error('Redis client is not initialized')
		}
		const value = await pubClient.get(key)
		return value === null ? false : value
	} catch (e) {
		console.error(e)
		return false
	}
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const setJson = async (key: string, path: string, listValue: any[]): Promise<void> => {
	try {
		if (!pubClient) {
			throw new Error('Redis client is not initialized')
		}
		if (!listValue || !Array.isArray(listValue) || listValue.length === 0) {
			await pubClient.json.set(key, path, [])
			console.log('Invalid List Or Empty Products')
		} else {
			await pubClient.json.set(key, path, listValue)
		}
	} catch (e) {
		console.error(e)
	}
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const addJson = async (key: string, value: any): Promise<void> => {
	try {
		if (!pubClient) {
			throw new Error('Redis client is not initialized')
		}
		await pubClient.json.arrAppend(key, '$', value)
	} catch (e) {
		console.error(e)
	}
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getJson = async (key: string): Promise<any> => {
	let jsonProducts
	try {
		if (!pubClient) {
			throw new Error('Redis client is not initialized')
		}
		jsonProducts = await pubClient.json.get(key)
	} catch (e) {
		console.error(e)
	}
	return jsonProducts
}

export default redisInit
