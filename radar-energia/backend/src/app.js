import express from "express";  //responsável por configurar a aplicação Express
import cors from "cors"; //quais origens podem fazer requisições para o seu backend

import routes from "./routes/index.js";
import errorMiddleware from "./middlewares/errorMiddleware.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
  })
); // Restrição do CORS para permitir que apenas o meu frontend faça requisições ao backend. Antes, qualquer origem poderia fazer requisições CORS

app.use(express.json());

app.use(routes);


app.use(errorMiddleware);

export default app;