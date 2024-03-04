import express from 'express'
import accountInfoRouter from './get-account-info';

const accountRouter = express.Router()
accountRouter.use(accountInfoRouter);

export default accountRouter
