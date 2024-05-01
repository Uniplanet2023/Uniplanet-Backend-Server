import { Topics, BaseProducer, PostDeletionRequestEvent } from '@uniplanet-lib/common'


export class PostDeletionReqProducer extends BaseProducer<PostDeletionRequestEvent> {
	topic: Topics.PostDeletionRequest = Topics.PostDeletionRequest
}
