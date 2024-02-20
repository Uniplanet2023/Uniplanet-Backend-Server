import express, { Request, Response } from 'express'
import { User } from '../models/index'
import { tokenValidation } from '@uniplanet-lib/common'
import { TOKEN_LOGIN_ROUTE } from './routes-def'
import UserSerializer from '../events/serializer/UserSerializer'

const tokenLoginRouter = express.Router()
tokenLoginRouter.post(
	TOKEN_LOGIN_ROUTE,
    tokenValidation,
	async (req: Request, res: Response) => {
        
        if(!req.user || req.user!.verified){
            return res.status(401).send({aceess:false});
        }
		console.log(req.user);
		const user = await User.findOne({ email:req.user.email })
		if (!user || !user.verified) throw new Error('Invalid Credential')

		const currentUser = new UserSerializer(user)
		res.status(currentUser.getStatusCode()).send(currentUser.serializeRest())
	},
)

export default tokenLoginRouter
