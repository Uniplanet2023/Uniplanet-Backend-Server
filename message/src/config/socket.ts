import { Server as SocketIOServer, Server } from 'socket.io'
import { URL_LIST_PROD } from '@uniplanet-lib/common'
import server from '../app'

export let io: SocketIOServer
declare module 'socket.io' {
	interface Socket {
		userId: string
		chatRoomId: string[]
		firebaseToken: string
	}
}
io = new SocketIOServer(server, {
	pingTimeout: 60000,
	pingInterval: 25000,
	cookie: false,
	cors: {
		origin: URL_LIST_PROD,
		credentials: true,
	},
})