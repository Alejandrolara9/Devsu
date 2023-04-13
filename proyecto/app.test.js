const request = require("supertest");
const express = require("express");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.json());

// Pruebas unitarias

describe("POST /token", () => {
  test("Generar token JWT con un nombre proporcionado", async () => {
    const response = await request(app)
      .post("/token")
      .send({ name: "John Doe" });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
    expect(response.body).toHaveProperty("secretKey");
  });

  test("Error al generar token JWT sin proporcionar un nombre", async () => {
    const response = await request(app).post("/token").send({});

    expect(response.status).toBe(400);
    expect(response.text).toBe("Nombre requerido para generar token JWT");
  });
});

describe("POST /DevOps", () => {
  test("Acceso exitoso con API Key y JWT válidos", async () => {
    const name = "John Doe";
    const secretKey = name + "randomstring";
    const token = jwt.sign({ name }, secretKey, { expiresIn: 45 });

    const response = await request(app)
      .post("/DevOps")
      .set("x-parse-rest-api-key", "2f5ae96c-b558-4c7b-a590-a501ae1c3f6c")
      .set("x-jwt-kwy", token)
      .set("x-secret-key", secretKey)
      .send({ to: "Jane Doe" });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toBe("hello Jane Doe your message will be send");
  });

  test("Error con API Key inválida", async () => {
    const response = await request(app)
      .post("/DevOps")
      .set("x-parse-rest-api-key", "invalid-api-key")
      .send({});

    expect(response.status).toBe(401);
    expect(response.text).toBe("API Key invalida");
  });

  test("Error con token JWT inválido", async () => {
    const response = await request(app)
      .post("/DevOps")
      .set("x-parse-rest-api-key", "2f5ae96c-b558-4c7b-a590-a501ae1c3f6c")
      .set("x-jwt-kwy", "invalid-jwt-token")
      .send({});

    expect(response.status).toBe(401);
    expect(response.text).toBe("Token JWT invalido");
  });
});