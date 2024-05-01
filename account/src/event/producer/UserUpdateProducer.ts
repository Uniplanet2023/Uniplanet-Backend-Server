import { Topics, BaseProducer, UserUpdateEvent } from '@uniplanet-lib/common'


export class UserUpdateProducer extends BaseProducer<UserUpdateEvent> {
	topic: Topics.UserUpdated = Topics.UserUpdated
}
