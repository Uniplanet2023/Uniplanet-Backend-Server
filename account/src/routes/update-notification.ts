import express, { Request, Response } from 'express'
import {  UPDATE_NOTIFICTAION_ROUTE } from './routes-def'
import { tokenValidation } from '@uniplanet-lib/common'
import Account from '../models/account';

const updateNotificationRouter = express.Router()

updateNotificationRouter.put(UPDATE_NOTIFICTAION_ROUTE, tokenValidation, async (req: Request, res: Response) => {
    const { isAllow } = req.query;
    await Account.findByIdAndUpdate(req.user!.id, { isNotificationAllowed: isAllow });
    res.status(200).send({
        success: true,
        message: 'Notification setting updated successfully'
    });
});

export default updateNotificationRouter
