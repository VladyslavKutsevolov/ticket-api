import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { Ticket, TicketDoc } from "../models/ticket";
import { Order } from "../models/order";
import { OrderStatus } from "@vticketing/common";

declare global {
  var getAuthCookie: () => string[];
  var generateId: () => string;
  var createTicket: () => Promise<TicketDoc>;
  var createOrder: (ticket: any) => Promise<any>;
}

jest.mock("../nats-wrapper");

let mongo: any;

beforeAll(async () => {
  process.env.JWT_KEY = "asdfasdf";

  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }

  await mongoose.connection.close();
});

global.getAuthCookie = () => {
  const payload = {
    id: global.generateId(),
    email: "test@test.com",
  };

  const token = jwt.sign(payload, process.env.JWT_KEY!);

  const session = { jwt: token };

  const sessionJSON = JSON.stringify(session);

  const base64 = Buffer.from(sessionJSON).toString("base64");

  return [`session=${base64}`];
};

global.generateId = () => new mongoose.Types.ObjectId().toHexString();

global.createTicket = async () => {
  const ticket = Ticket.build({
    title: "concert",
    price: 20,
  });

  await ticket.save();

  return ticket;
};

global.createOrder = async (ticket: TicketDoc) => {
  const order = Order.build({
    userId: "asdadsadsads",
    status: OrderStatus.Created,
    expiresAt: new Date(),
    ticket,
  });

  await order.save();

  return order;
};
