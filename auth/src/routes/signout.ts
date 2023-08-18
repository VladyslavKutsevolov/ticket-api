import express from "express";

const router = express.Router();

router.post("/api/users/signout", (req, res) => {
  req.session = null;

  res.status(204).send({});
});

export { router as signoutRouter };
