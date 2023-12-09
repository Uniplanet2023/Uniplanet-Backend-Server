import express from 'express'
import signUpRouter from './signup'
import verifyRouter from './verify'
import signInRoute from './signin'
import deleteUserRoute from './delete_user'
import updateUserRoute from './password_update_user'
import forgottenPassword from './forgotten_password'
import passwordUpdateRouter from './password_update_user'

const authRouter = express.Router()

authRouter.use(passwordUpdateRouter)
authRouter.use(verifyRouter)
authRouter.use(deleteUserRoute)
authRouter.use(signUpRouter)
authRouter.use(signInRoute)
authRouter.use(updateUserRoute)
authRouter.use(forgottenPassword)

export default authRouter
