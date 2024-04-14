import express, { Request, Response } from 'express'
import { GET_SEARCH_HISTORY } from './routes-def'
import { redisClient, tokenValidation } from '@uniplanet-lib/common'

const searchHistoryRouter = express.Router()

searchHistoryRouter.get(GET_SEARCH_HISTORY, tokenValidation, async (req: Request, res: Response) => {
    const { page } = req.params;
    const pageNumber = parseInt(page as string);
    if (pageNumber < 0) {
        throw new Error('Invalid page number');
    }
    const limit = 10;
    const skip = (pageNumber - 1) * limit;

    const searchHistory = await redisClient.redis.getRange(`Search Record: ${req.user!.id}`, skip, limit);
    
        res.status(200).send({
            success: true,
            data: searchHistory
        });
    
});

export default searchHistoryRouter
