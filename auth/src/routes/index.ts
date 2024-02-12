import express from 'express'
import signUpRouter from './signup'
import signInRouter from './signin'
import deleteUserRouter from './delete-user'
import forgottenPasswordRouter from './forgotten-password'
import passwordUpdateRouter from './password-update-user'
import signOutRouter from './logout'
import sendingTokenRouter from './send-token'
import tokenValidationRouter from './token-verification'

const userRouter = express.Router()

userRouter.use(signOutRouter)
userRouter.use(passwordUpdateRouter)
userRouter.use(deleteUserRouter)
userRouter.use(signUpRouter)
userRouter.use(signInRouter)
userRouter.use(forgottenPasswordRouter)
userRouter.use(sendingTokenRouter)
userRouter.use(tokenValidationRouter)

export default userRouter
