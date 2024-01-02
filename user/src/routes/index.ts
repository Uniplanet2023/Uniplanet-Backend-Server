import express from 'express'
import signUpRouter from './signup'
import signInRoute from './signin'
import deleteUserRoute from './delete_user'
import updateUserRoute from './password_update_user'
import forgottenPassword from './forgotten_password'
import passwordUpdateRouter from './password_update_user'
import signOutRoute from './logout'

const userRouter = express.Router()
userRouter.use(signOutRoute)
userRouter.use(passwordUpdateRouter)
userRouter.use(deleteUserRoute)
userRouter.use(signUpRouter)
userRouter.use(signInRoute)
userRouter.use(updateUserRoute)
userRouter.use(forgottenPassword)

export default userRouter
