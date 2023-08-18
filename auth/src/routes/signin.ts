import express, { Response, Request } from "express";
import { body, validationResult } from "express-validator";
import { User } from "../models/user";
import { BadRequestError } from "../errors/bad-request-error";
import { RequestValidationError } from "../errors/request-validation";
import { validateRequest } from "../middleware/validate-request";
import { Password } from "../services/passsword";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post(
  "/api/users/signin",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("You must supply a password"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array());
    }
    const { email, password } = req.body;

    const match = await User.findOne({ email });

    if (!match) {
      throw new BadRequestError("Invalid credentials");
    }

    const passwordMatch = await Password.compare(match.password, password);

    if (!passwordMatch) {
      throw new BadRequestError("Invalid credentials");
    }

    const userJwt = jwt.sign(
      { id: match.id, email: match.email },
      process.env.JWT_KEY!
    );

    req.session = {
      jwt: userJwt,
    };

    res.send({ user: match });
  }
);

export { router as signinRouter };
