import { Subjects, Publisher, TicketUpdatedEvent } from "@vticketing/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
