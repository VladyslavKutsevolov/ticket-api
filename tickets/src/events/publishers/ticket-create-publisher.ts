import { Publisher, Subjects, TicketCreatedEvent } from "@vticketing/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
