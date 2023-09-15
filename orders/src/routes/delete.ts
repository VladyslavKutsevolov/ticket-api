import express, { Request, Response } from "express";
import {
  NonFoundError,
  NotAuthorizedError,
  OrderStatus,
  requireAuth,
} from "@vticketing/common";
import { Order } from "../models/order";

const router = express.Router();

router.delete(
  "/api/orders/:orderId",
  requireAuth,
  async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.orderId).populate("ticket");

    if (!order) {
      throw new NonFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    order.status = OrderStatus.Cancelled;

    await order.save();

    res.status(204).send(order);
  }
);

export { router as deleteOrderRouter };
