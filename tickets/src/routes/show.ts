import express, { Request, Response } from "express";
import { Ticket } from "../models/ticket";
import { NonFoundError } from "@vticketing/common";

const router = express.Router();

router.get("/api/tickets/:id", async (req: Request, res: Response) => {
  const ticket = await Ticket.findById(req.params.id);

  if (!ticket) {
    throw new NonFoundError();
  }

  res.send(ticket);
});

export { router as showTicketRouter };
