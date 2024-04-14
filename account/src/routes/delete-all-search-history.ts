import express, { Request, Response } from 'express'
import { DELETE_ALL_SEARCH_HISTORY } from './routes-def'
import { redisClient, tokenValidation } from '@uniplanet-lib/common'

const deleteAllSearchHistoryRouter = express.Router()

deleteAllSearchHistoryRouter.delete(DELETE_ALL_SEARCH_HISTORY, tokenValidation, async (req: Request, res: Response) => {

    await redisClient.redis.del(`Search Record: ${req.user!.id}`);
    
    res.status(200).send({
        success: true,
        message: 'Search history deleted successfully'
    });
});

export default deleteAllSearchHistoryRouter
