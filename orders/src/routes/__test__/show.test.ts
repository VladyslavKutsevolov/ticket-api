import request from "supertest";
import { app } from "../../app";

it("fetches orders for a particular user", async () => {
  const ticket = await global.createTicket();

  const cookie = global.getAuthCookie();

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", cookie)
    .send({ ticketId: ticket.id })
    .expect(201);

  const response = await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", cookie)
    .send({})
    .expect(200);

  expect(response.body.id).toEqual(order.id);
  expect(response.body.ticket.id).toEqual(ticket.id);
});

it("returns an error if one user tries to fetch another user's order", async () => {
  const ticket = await global.createTicket();

  const cookie = global.getAuthCookie();

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", cookie)
    .send({ ticketId: ticket.id })
    .expect(201);

  await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", global.getAuthCookie())
    .send({})
    .expect(401);
});
