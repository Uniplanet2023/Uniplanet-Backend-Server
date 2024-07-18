import express, { Request, Response } from 'express'
import { GET_AD_INTERACTION } from './routes-def'
import { tokenValidation } from '@uniplanet-lib/common'
import Advertiser from '../models/advertiser'
import AdInteraction from '../models/ad-interaction'
import GetAccountInfo from '../event/serializer/get-account'

const adInteractionRouter = express.Router()

adInteractionRouter.get(GET_AD_INTERACTION, tokenValidation, async (req: Request, res: Response) => {
	const { page } = req.params // Using query instead of params for pagination
	const pageNumber = parseInt(page as string, 10) || 1 // Default to page 1 if not provided or invalid
	if (pageNumber < 1) {
		return res.status(400).send({ message: 'Invalid page number' })
	}
	const limit = 10
	const skip = (pageNumber - 1) * limit

	const advertiser = await Advertiser.findOne({ account: req.user!.id })
	if (!advertiser) {
		return res.status(404).send({ message: 'Advertiser not found' })
	}

	const adInteractionList = await AdInteraction.find({ advertiser: advertiser._id })
		.skip(skip)
		.limit(limit)
		.populate('account')
		.sort('updatedAt') // Sorting in descending order of update time

	const adInteractionListSerializedList = adInteractionList.map(adInteraction => {
		return {
			account: new GetAccountInfo(adInteraction.account).serializeRest(),
			advertisement: adInteraction.advertisement,
		}
	})

	res.status(200).send(JSON.stringify(adInteractionListSerializedList))
})

export default adInteractionRouter
