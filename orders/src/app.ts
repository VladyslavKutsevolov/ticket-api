import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";

import { NonFoundError, errorHandler, currentUser } from "@vticketing/common";
import { indexOrderRouter } from "./routes";
import { showOrderRouter } from "./routes/show";
import { createOrderRouter } from "./routes/new";
import { deleteOrderRouter } from "./routes/delete";

const app = express();

app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false, // disable encryption
    secure: process.env.NODE_ENV !== "test",
  })
);

app.use(currentUser);
app.use(indexOrderRouter);
app.use(createOrderRouter);
app.use(showOrderRouter);
app.use(deleteOrderRouter);

app.all("*", async () => {
  throw new NonFoundError();
});

app.use(errorHandler);

export { app };
