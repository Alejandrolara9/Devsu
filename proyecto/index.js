const express = require("express");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const app = express();
// Configuración de la API Key
const API_KEY = "2f5ae96c-b558-4c7b-a590-a501ae1c3f6c";
// Middleware para parsear JSON en las solicitudes
app.use(bodyParser.json());
// Endpoint DevOps
app.post("/DevOps", (req, res) => {
  const apiKey = req.headers["x-parse-rest-api-key"];
  const jwtKey = req.headers["x-jwt-kwy"];
  const { to } = req.body;
  const secretKey = req.headers["x-secret-key"]; // extraer la clave secreta de la solicitud
  // Verificar si la API Key es válido
  if (apiKey !== API_KEY) {
    return res.status(401).send("API Key invalida");
  }
  // Verificar si el token JWT es válido
  jwt.verify(jwtKey, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).send("Token JWT invalido");
    }
    // Enviar la respuesta con el mensaje de confirmación y el token JWT generado previamente
    res.json({ message: `hello ${to} your message will be send` });
  });
});
// Generar token JWT
app.post("/token", async (req, res) => {
  const { name } = req.body;
  // Verificar si se proporcionó un nombre
  if (!name) {
    return res.status(400).send("Nombre requerido para generar token JWT");
  }
  // Generar la clave secreta única por transacción
  const randomString =
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);
  const secretKey = name.toString() + randomString;
  // Generar token JWT utilizando la clave secreta única por transacción
  const token = jwt.sign({ name }, secretKey,{expiresIn: 45});
  // Enviar la clave secreta junto con el token JWT
  return res.json({ token, secretKey });
});
// Iniciar servidor
app.listen(3000, () => {
  console.log("Servidor iniciado en el puerto 3000");
});
