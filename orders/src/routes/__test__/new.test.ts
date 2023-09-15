import request from "supertest";
import { app } from "../../app";

it("has a route handler listening to /api/orders for post requests", async () => {
  const response = await request(app).post("/api/orders").send({});

  expect(response.status).not.toEqual(404);
});

it("can only be accessed if the user is signed in", async () => {
  await request(app).post("/api/orders").send({}).expect(401);
});

it("returns a status other than 401 if the user is signed in", async () => {
  const response = await request(app)
    .post("/api/orders")
    .set("Cookie", global.getAuthCookie())
    .send({});

  expect(response.status).not.toEqual(401);
});

it("returns an error if an invalid ticketId is provided", async () => {
  await request(app)
    .post("/api/orders")
    .set("Cookie", global.getAuthCookie())
    .send({
      ticketId: "",
    })
    .expect(400);

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.getAuthCookie())
    .send({})
    .expect(400);
});

it("returns an error if the ticket does not exist", async () => {
  const ticketId = global.generateId();

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.getAuthCookie())
    .send({
      ticketId,
    })
    .expect(404);
});

it("returns an error if the ticket is already reserved", async () => {
  const ticket = await global.createTicket();

  await global.createOrder(ticket);

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.getAuthCookie())
    .send({
      ticketId: ticket.id,
    })
    .expect(400);
});

it("reserves a ticket", async () => {
  const ticket = await global.createTicket();

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.getAuthCookie())
    .send({
      ticketId: ticket.id,
    })
    .expect(201);
});

it.todo("emits an order created event");
