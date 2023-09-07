import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";

import { NonFoundError, errorHandler } from "@vticketing/common";

const app = express();

app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false, // disable encryption
    secure: process.env.NODE_ENV !== "test",
  })
);


app.all("*", async () => {
  throw new NonFoundError();
});

app.use(errorHandler);

export { app };
