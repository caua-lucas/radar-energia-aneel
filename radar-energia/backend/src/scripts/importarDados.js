import fs from "fs";
import path from "path";
import unzipper from "unzipper";
import csvParser from "csv-parser";
import pool from "../config/database.js";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/*
 * O ano vem do comando:
 *
 * node importarDados.js 2026
 *
 * Portanto:
 * process.argv[2] = 2026
 */

const ANO = process.argv[2];

if (!ANO) {
  console.error(
    "Erro: nenhum ano foi informado."
  );

  process.exit(1);
}

console.log("=================================");
console.log(" IMPORTADOR DA ANEEL");
console.log("=================================");
console.log(
  `Ano recebido: ${ANO}`
);
console.log();

/*
 * ==========================================
 * CAMINHOS
 * ==========================================
 */

const pastaData = path.resolve(
  __dirname,
  "../../..",
  "data"
);

const caminhoZip = path.join(
  pastaData,
  `interrupcoes-energia-eletrica-${ANO}.zip`
);

const caminhoCsvTemporario = path.join(
  pastaData,
  `interrupcoes-${ANO}-importacao.csv`
);

/*
 * ==========================================
 * CONEXÃO COM POSTGRESQL
 * ==========================================
 */

const client = await pool.connect();

/*
 * ==========================================
 * FUNÇÕES AUXILIARES
 * ==========================================
 */

function escaparCsv(valor) {
  if (
    valor === null ||
    valor === undefined ||
    valor === ""
  ) {
    return "";
  }

  const texto = String(valor)
    .replace(/"/g, '""');

  return `"${texto}"`;
}

function converterData(data) {
  if (!data) {
    return "";
  }

  return data;
}

/*
 * ==========================================
 * EXTRAIR CSV DO ZIP
 * ==========================================
 */

async function extrairCsv() {
  return new Promise((resolve, reject) => {
    const arquivoSaida =
      fs.createWriteStream(
        caminhoCsvTemporario,
        {
          encoding: "utf8"
        }
      );

    let encontrouCsv = false;
    let cabecalhoEscrito = false;
    let quantidade = 0;

    fs.createReadStream(caminhoZip)
      .pipe(unzipper.Parse())

      .on("entry", (entry) => {
        if (
          !entry.path
            .toLowerCase()
            .endsWith(".csv")
        ) {
          entry.autodrain();
          return;
        }

        encontrouCsv = true;

        console.log(
          `Lendo: ${entry.path}`
        );

        entry
          .pipe(
            csvParser({
              separator: ";",
              skipLines: 0,

              mapHeaders: ({ header }) =>
                header
                  .replace(/^"|"$/g, "")
                  .trim()
            })
          )

          .on("data", (linha) => {
            if (!cabecalhoEscrito) {
              arquivoSaida.write(
                [
                  "dat_geracao_conjunto_dados",
                  "ide_conjunto_unidade_consumidora",
                  "dsc_conjunto_unidade_consumidora",
                  "dsc_alimentador_subestacao",
                  "dsc_subestacao_distribuicao",
                  "num_ordem_interrupcao",
                  "dsc_tipo_interrupcao",
                  "ide_motivo_interrupcao",
                  "dat_inicio_interrupcao",
                  "dat_fim_interrupcao",
                  "dsc_fato_gerador_interrupcao",
                  "num_nivel_tensao",
                  "num_unidade_consumidora",
                  "num_consumidor_conjunto",
                  "num_ano",
                  "nom_agente_regulado",
                  "sig_agente",
                  "num_cpf_cnpj"
                ].join(";") + "\n"
              );

              cabecalhoEscrito = true;
            }

            const valores = [
              converterData(
                linha.DatGeracaoConjuntoDados
              ),

              linha.CodConjUnidadeConsumidora,

              linha.DscConjuntoUnidadeConsumidora,

              linha.CodAlimentador,

              linha.CodSubestacao,

              linha.CodInterrupcao,

              linha.DscFatoGeradorTipo,

              linha.CodEvento,

              converterData(
                linha.DatInicioInterrupcao
              ),

              converterData(
                linha.DatFimInterrupcao
              ),

              linha.DscFatoGeradorDetalhe,

              linha.NumNivelTensao,

              linha.QtdConsumidoresAtivos,

              linha.QtdConsumidoresAfetados,

              linha.AnoCompetencia,

              linha.NomAgente,

              linha.SigAgente,

              linha.NumCNPJDistribuidora
            ];

            arquivoSaida.write(
              valores
                .map(escaparCsv)
                .join(";") + "\n"
            );

            quantidade++;

            if (
              quantidade % 100000 === 0
            ) {
              console.log(
                `Processados: ${quantidade.toLocaleString("pt-BR")} registros`
              );
            }
          })

          .on("end", () => {
            arquivoSaida.end();
          })

          .on("error", reject);
      })

      .on("close", () => {
        arquivoSaida.on(
          "finish",
          () => {
            if (!encontrouCsv) {
              reject(
                new Error(
                  "Nenhum arquivo CSV encontrado dentro do ZIP."
                )
              );

              return;
            }

            console.log(
              `✓ ${quantidade.toLocaleString("pt-BR")} registros preparados para importação.`
            );

            resolve();
          }
        );
      })

      .on("error", reject);
  });
}

/*
 * ==========================================
 * IMPORTAR PARA POSTGRESQL
 * ==========================================
 */

async function importar() {
  try {
    console.log(
      "Importando ano:",
      ANO
    );

    console.log(
      "Arquivo:",
      caminhoZip
    );

    /*
     * Verifica se o ZIP correto existe.
     */

    if (!fs.existsSync(caminhoZip)) {
      throw new Error(
        `Arquivo não encontrado: ${caminhoZip}`
      );
    }

    console.log(
      "\n1. Convertendo CSV da ANEEL..."
    );

    await extrairCsv();

    console.log(
      "\n2. Importando dados no PostgreSQL..."
    );

    const comandoCopy = `
      COPY interrupcoes (
        dat_geracao_conjunto_dados,
        ide_conjunto_unidade_consumidora,
        dsc_conjunto_unidade_consumidora,
        dsc_alimentador_subestacao,
        dsc_subestacao_distribuicao,
        num_ordem_interrupcao,
        dsc_tipo_interrupcao,
        ide_motivo_interrupcao,
        dat_inicio_interrupcao,
        dat_fim_interrupcao,
        dsc_fato_gerador_interrupcao,
        num_nivel_tensao,
        num_unidade_consumidora,
        num_consumidor_conjunto,
        num_ano,
        nom_agente_regulado,
        sig_agente,
        num_cpf_cnpj
      )
      FROM STDIN
      WITH (
        FORMAT csv,
        HEADER true,
        DELIMITER ';',
        QUOTE '"',
        ENCODING 'UTF8',
        NULL ''
      )
    `;

    const copyFrom =
      await import("pg-copy-streams");

    const copyStream =
      client.query(
        copyFrom.default.from(
          comandoCopy
        )
      );

    await new Promise(
      (resolve, reject) => {
        copyStream.on(
          "finish",
          resolve
        );

        copyStream.on(
          "error",
          reject
        );

        fs.createReadStream(
          caminhoCsvTemporario
        ).pipe(copyStream);
      }
    );

    console.log(
      `\n✓ Dados de ${ANO} importados com sucesso!`
    );

    /*
     * Remove CSV temporário.
     */

    if (
      fs.existsSync(
        caminhoCsvTemporario
      )
    ) {
      fs.unlinkSync(
        caminhoCsvTemporario
      );

      console.log(
        "✓ Arquivo temporário removido."
      );
    }

    /*
     * Verifica quantidade importada.
     */

    const resultado =
      await client.query(
        `
        SELECT COUNT(*) AS total
        FROM interrupcoes
        WHERE num_ano = $1
        `,
        [ANO]
      );

    console.log(
      `✓ Registros de ${ANO} no banco: ${Number(
        resultado.rows[0].total
      ).toLocaleString("pt-BR")}`
    );

    console.log(
      "\n================================="
    );

    console.log(
      " IMPORTAÇÃO CONCLUÍDA!"
    );

    console.log(
      "================================="

    );

  } catch (error) {
    console.error(
      "\n================================="
    );

    console.error(
      " ERRO NA IMPORTAÇÃO"
    );

    console.error(
      "================================="
    );

    console.error(
      error.message
    );

    process.exitCode = 1;

  } finally {
    client.release();

    await pool.end();
  }
}

importar();