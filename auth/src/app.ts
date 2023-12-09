import express from 'express'
import 'express-async-errors'
import http, { Server } from 'http'
// import redisInit from './redis_controller/redis_controller'
import { errorHandler } from './middlewares'
import cors from 'cors'
import dotenv from 'dotenv-safe'

const parsedNodeEnv = process.env.NODE_ENV || 'example'

console.log(parsedNodeEnv.trim() === 'production' ? '.env.production' : 'development' ? '.env.dev' : '.env.example')
dotenv.config({
	path: parsedNodeEnv.trim() === 'production' ? '.env.production' : 'development' ? '.env.dev': '.env.example',
})

// IMPORTS FROM OTHER FILES
import { authRouter, productRouter } from './routes'
import userRouter from './routes/user/user'
import likeRouter from './routes/like/like'
import chatRouter from './routes/chat/chat'

const app = express()

// middleware
app.use(express.json())
app.use(cors())
app.use(authRouter)
app.use(chatRouter)
app.use(userRouter)
app.use(productRouter)
app.use(likeRouter)
app.use(errorHandler)

const server: Server = http.createServer(app)

export default server
