import { io } from "../.."


export function initMiddleWare(){
    io.use((socket, next) => {
        const { userId } = socket.handshake.query
        console.log('middle ware called '+ userId)
        if (!userId) {
            return next(new Error('Authentication error'))
        }
        socket.userId = userId as string
        // socket.chatRoomId = []
        next()
    })
}