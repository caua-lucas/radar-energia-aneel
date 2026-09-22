import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";
import pool from "../config/database.js";

console.log("=================================");
console.log(" ATUALIZAR DADOS DA ANEEL");
console.log("=================================\n");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATASET_ID =
  "ccb25653-f07b-4f28-84c2-62a89d1f5a56";

const pastaData = path.resolve(
  __dirname,
  "../../..",
  "data"
);

async function atualizarDados() {
  try {
    /*
     * ==========================================
     * 1. BUSCAR DADOS DA ANEEL
     * ==========================================
     */

    console.log(
      "1. Buscando dados atualizados da ANEEL..."
    );

    const url =
      `https://dadosabertos.aneel.gov.br/api/3/action/package_show?id=${DATASET_ID}`;

    const resposta = await fetch(url);

    if (!resposta.ok) {
      throw new Error(
        `Erro ao consultar a ANEEL: ${resposta.status}`
      );
    }

    const dados = await resposta.json();

    if (
      !dados.success ||
      !dados.result ||
      !Array.isArray(dados.result.resources)
    ) {
      throw new Error(
        "A resposta da ANEEL não possui os recursos esperados."
      );
    }

    const recursos = dados.result.resources;

    /*
     * ==========================================
     * 2. ENCONTRAR RECURSOS ANUAIS
     * ==========================================
     */

    const recursosAnuais = recursos
      .map((recurso) => {
        if (!recurso.name || !recurso.url) {
          return null;
        }

        const correspondencia =
          recurso.name.match(/(\d{4})/);

        if (!correspondencia) {
          return null;
        }

        const ano = Number(
          correspondencia[1]
        );

        if (
          ano < 2000 ||
          ano > new Date().getFullYear()
        ) {
          return null;
        }

        return {
          ano,
          nome: recurso.name,
          url: recurso.url,
          id: recurso.id
        };
      })
      .filter(Boolean)
      .sort((a, b) => b.ano - a.ano);

    if (recursosAnuais.length === 0) {
      throw new Error(
        "Nenhum recurso anual da ANEEL foi encontrado."
      );
    }

    console.log("\nAnos encontrados:");

    recursosAnuais.forEach((recurso) => {
      console.log(
        `- ${recurso.ano} | ${recurso.nome}`
      );
    });

    /*
     * ==========================================
     * 3. ESCOLHER O ANO MAIS RECENTE
     * ==========================================
     */

    const recursoEscolhido =
      recursosAnuais[0];

    const ano = recursoEscolhido.ano;
    const nomeRecurso =
      recursoEscolhido.nome;
    const urlRecurso =
      recursoEscolhido.url;

    console.log("\n=================================");
    console.log(` ANO ESCOLHIDO: ${ano}`);
    console.log("=================================");

    console.log(
      `Recurso: ${nomeRecurso}`
    );

    console.log(
      `URL: ${urlRecurso}`
    );

    /*
     * ==========================================
     * 4. BAIXAR ZIP
     * ==========================================
     */

    console.log(
      `\n2. Baixando arquivo de ${ano}...`
    );

    const respostaArquivo =
      await fetch(urlRecurso);

    if (!respostaArquivo.ok) {
      throw new Error(
        `Erro ao baixar arquivo: ${respostaArquivo.status}`
      );
    }

    const buffer = Buffer.from(
      await respostaArquivo.arrayBuffer()
    );

    if (buffer.length === 0) {
      throw new Error(
        "O arquivo baixado está vazio."
      );
    }

    fs.mkdirSync(
      pastaData,
      {
        recursive: true
      }
    );

    const arquivoZip = path.join(
      pastaData,
      `${nomeRecurso}.zip`
    );

    fs.writeFileSync(
      arquivoZip,
      buffer
    );

    console.log(
      `✓ Arquivo de ${ano} baixado com sucesso.`
    );

    console.log(
      `✓ Arquivo salvo em: ${arquivoZip}`
    );

    console.log(
      `✓ Tamanho: ${(buffer.length / 1024 / 1024).toFixed(2)} MB`
    );

    /*
     * ==========================================
     * 5. REMOVER DADOS ANTIGOS
     * ==========================================
     */

    console.log(
      `\n3. Removendo dados antigos de ${ano}...`
    );

    const resultado =
      await pool.query(
        `
        DELETE FROM interrupcoes
        WHERE num_ano = $1
        `,
        [ano]
      );

    console.log(
      `✓ ${resultado.rowCount} registros antigos removidos.`
    );

    /*
     * ==========================================
     * 6. IMPORTAR O ANO ESCOLHIDO
     * ==========================================
     */

    console.log(
      `\n4. Importando dados de ${ano}...`
    );

    const caminhoImportador =
      path.resolve(
        __dirname,
        "importarDados.js"
      );

    console.log(
      `Importador: ${caminhoImportador}`
    );

    console.log(
      `Ano enviado para o importador: ${ano}`
    );

    /*
     * IMPORTANTE:
     * Chamamos diretamente o Node.
     * Não dependemos do "npm run import".
     */

    execSync(
      `"${process.execPath}" "${caminhoImportador}" ${ano}`,
      {
        stdio: "inherit",
        cwd: path.resolve(
          __dirname,
          "../.."
        )
      }
    );

    /*
     * ==========================================
     * 7. VERIFICAR BANCO
     * ==========================================
     */

    console.log(
      `\n5. Verificando dados de ${ano} no PostgreSQL...`
    );

    const verificacao =
      await pool.query(
        `
        SELECT COUNT(*) AS total
        FROM interrupcoes
        WHERE num_ano = $1
        `,
        [ano]
      );

    const totalImportado =
      Number(
        verificacao.rows[0].total
      );

    if (totalImportado === 0) {
      throw new Error(
        `Nenhum registro de ${ano} foi encontrado no PostgreSQL após a importação.`
      );
    }

    console.log(
      `✓ ${totalImportado.toLocaleString("pt-BR")} registros encontrados no banco.`
    );

    /*
     * ==========================================
     * 8. FINALIZAÇÃO
     * ==========================================
     */

    console.log("\n=================================");
    console.log(" ATUALIZAÇÃO CONCLUÍDA!");
    console.log("=================================");

    console.log(
      `Ano atualizado: ${ano}`
    );

    console.log(
      `Registros no banco: ${totalImportado.toLocaleString("pt-BR")}`
    );

    console.log(
      `Arquivo utilizado: ${nomeRecurso}.zip`
    );

  } catch (error) {
    console.error("\n=================================");
    console.error(" ERRO NA ATUALIZAÇÃO");
    console.error("=================================");

    console.error(
      error.message
    );

    process.exitCode = 1;

  } finally {
    await pool.end();
  }
}

atualizarDados();