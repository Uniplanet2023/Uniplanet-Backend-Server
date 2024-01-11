import { Publisher, Subjects, TicketCreatedEvent } from '@uniplanet-lib/common'

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
	readonly subject = Subjects.TicketCreated
}
