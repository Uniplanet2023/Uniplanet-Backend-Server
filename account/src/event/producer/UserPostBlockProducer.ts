import { Topics, BaseProducer, UserUpdateEvent, UserPostBlockedEvent } from '@uniplanet-lib/common'


export class UserPostBlockProducer extends BaseProducer<UserPostBlockedEvent> {
	topic: Topics.UserPostBlocked = Topics.UserPostBlocked
}
