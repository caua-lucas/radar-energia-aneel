import app from "./app.js";
import pool from "./config/database.js";

const PORT = 3001;

pool.query("SELECT NOW()") // Este select serve para realizar um teste simples de conexão para ver a hora atual e se o postgresql esta funcionando corretamente.
  .then(() => {
    console.log("PostgreSQL conectado!");

    app.listen(PORT, () => {
      console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Erro ao conectar ao PostgreSQL:", error.message);
  });