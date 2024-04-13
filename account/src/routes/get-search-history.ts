import express, { Request, Response } from 'express'
import { GET_SEARCH_HISTORY } from './routes-def'
import { redisClient, tokenValidation } from '@uniplanet-lib/common'

const searchHistoryRouter = express.Router()

searchHistoryRouter.get(GET_SEARCH_HISTORY, tokenValidation, async (req: Request, res: Response) => {

    const searchHistory = await redisClient.redis.lRange(`Search Record: ${req.user!.id}`, 0, 10);
    res.status(200).send({
        success: true,
        data: searchHistory
    });
    
});

export default searchHistoryRouter
