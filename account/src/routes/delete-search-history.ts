import express, { Request, Response } from 'express'
import { DELETE_SEARCH_HISTORY } from './routes-def'
import { redisClient, tokenValidation } from '@uniplanet-lib/common'

const deleteSearchHistoryRouter = express.Router()

deleteSearchHistoryRouter.delete(DELETE_SEARCH_HISTORY, tokenValidation, async (req: Request, res: Response) => {

    const { searchHistory } = req.params;
    await redisClient.redis.lRem(`Search Record: ${req.user!.id}`, 1, searchHistory);

    res.status(200).send({
        success: true,
        message: 'Search history deleted successfully'
    });
});

export default deleteSearchHistoryRouter
