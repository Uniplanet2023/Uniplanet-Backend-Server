import express, { Request, Response } from 'express'
import { User } from '../models/index'
import { tokenValidation } from '@uniplanet-lib/common'
import { TOKEN_LOGIN_ROUTE } from './routes-def'
import UserSerializer from '../events/serializer/UserSerializer'
import { redisClient } from '../redis-client'

const tokenLoginRouter = express.Router()
tokenLoginRouter.post(
	TOKEN_LOGIN_ROUTE,
    tokenValidation,
	async (req: Request, res: Response) => {
        
        if(!req.session || !req.session.jwt || !req.user || !req.user!.verified){
            return res.status(401).send({access:false});
        }
		const result = await redisClient.redis.get(req.session.jwt);

		if (!result || !JSON.parse(result).verified){
			return res.status(401).send({aceess:false});
		}
		
		
		const user = await User.findOne({ email:req.user.email })
		if (!user || !user.verified) throw new Error('Invalid Credential')
		res.status(201).send({access:true})
	},
)

export default tokenLoginRouter
