import express, { Request, Response } from 'express'
import { tokenValidation } from '@uniplanet-lib/common'
import { TOKEN_LOGIN_ROUTE } from './routes-def'
import { redisClient } from '../redis-client'

const tokenLoginRouter = express.Router()
tokenLoginRouter.post(
	TOKEN_LOGIN_ROUTE,
    tokenValidation,
	async (req: Request, res: Response) => {
        
        if(!req.user!.verified){
            return res.status(401).send({access:false});
        }
		const result = await redisClient.redis.get(req.session!.jwt);

		if (!result){
			return res.status(401).send({aceess:false});
		}

		res.status(201).send({access:true})
	},
)

export default tokenLoginRouter
