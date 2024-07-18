import { model, Model, Schema } from 'mongoose'
import { Document } from 'mongoose'

export type ReportDocument = Document & {
	reporterId: string
	reportedUserId?: string
	productId?: string
	reportType: string
	description: string
	status: string
	createdAt: Date
	updatedAt: Date
	resolvedBy?: string
	resolutionNotes?: string
	severityLevel?: string
}

type ReportAttrs = {
	reporterId: string
	reportedUserId?: string
	productId?: string
	reportType: string
	description: string
	status?: string
	createdAt?: Date
	updatedAt?: Date
	resolvedBy?: string
	resolutionNotes?: string
	severityLevel?: string
}

interface ReportModel extends Model<ReportDocument> {
	build(attrs: ReportAttrs): ReportDocument
}

const reportSchema: Schema = new Schema(
	{
		reporterId: {
			type: String,
			required: true,
		},
		reportedUserId: {
			type: String,
		},
		productId: {
			type: String,
		},
		reportType: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		status: {
			type: String,
			default: 'pending',
		},
		resolvedBy: {
			type: String,
		},
		resolutionNotes: {
			type: String,
		},
		severityLevel: {
			type: String,
		},
	},
	{
		toJSON: {
			transform(_, ret) {
				ret.id = ret._id
				delete ret._id
				delete ret.__v
			},
		},
		timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
	},
)

reportSchema.statics.build = (attrs: ReportAttrs) => {
	return new Report(attrs)
}

const Report = model<ReportDocument, ReportModel>('Report', reportSchema)

export default Report
