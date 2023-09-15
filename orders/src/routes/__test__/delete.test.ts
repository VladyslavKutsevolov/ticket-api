import request from "supertest";
import { app } from "../../app";
import { OrderStatus } from "@vticketing/common";

it("marks an order as cancelled", async () => {
  const ticket = await global.createTicket();

  const user = global.getAuthCookie();

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .send({})
    .expect(204);

  const updatedOrder = await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", user);

  expect(updatedOrder.body.status).toEqual(OrderStatus.Cancelled);
});

it("returns an error if one user tries to delete another user's order", async () => {
  const ticket = await global.createTicket();

  const user = global.getAuthCookie();

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set("Cookie", global.getAuthCookie())
    .send({})
    .expect(401);
});

it.todo("emits an order cancelled event");
