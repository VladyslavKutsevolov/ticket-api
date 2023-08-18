import supertest from "supertest";
import { app } from "../../app";

it("returns a 201 on successful signup", async () => {
  await supertest(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);
});

it("fails when an incorrect password is provide", async () => {
  await supertest(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);

  await supertest(app).post("/api/users/signin").send({
    email: "test@tes.com",
    password: "password",
  });
});

it("should responds with a cookie when given valid credentials", async () => {
  await supertest(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);

  const response = await supertest(app)
    .post("/api/users/signin")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(200);

  expect(response.get("Set-Cookie")).toBeDefined();
});
