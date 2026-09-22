
import pg from "pg"; //Aqui você importa a biblioteca pg, que permite que o Node.js se comunique com o PostgreSQL.

const { Pool } = pg; //O pool é um gerenciador de conexões com o banco.

const pool = new Pool({ //cria uma instância do Pool e informa como o Node deve acessar o PostgreSQL.
  host: "localhost",
  port: 5432,
  database: "radar_energia",
  user: "postgres",
  password: "postgres"
});

export default pool; //exporto o pool para que os models possam utilizá-lo nas consultas ao banco.

