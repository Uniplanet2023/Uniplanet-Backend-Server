import express from 'express'
import signUpRouter from './signup'
import signInRouter from './signin'
import deleteUserRouter from './delete-user'
import forgottenPasswordRouter from './forgotten-password'
import passwordUpdateRouter from './password-update-user'
import signOutRouter from './signout'
import requestOTPRouter from './request-opt'
import otpValidationRouter from './otp-verification'
import tokenLoginRouter from './token-login'
const userRouter = express.Router()

userRouter.use(signOutRouter)
userRouter.use(passwordUpdateRouter)
userRouter.use(deleteUserRouter)
userRouter.use(signUpRouter)
userRouter.use(signInRouter)
userRouter.use(forgottenPasswordRouter)
userRouter.use(requestOTPRouter)
userRouter.use(otpValidationRouter)
userRouter.use(tokenLoginRouter)

export default userRouter
