import pool from "../config/database.js";

async function configurarBanco() {
    try {
        console.log("=================================");
        console.log(" CONFIGURANDO BANCO DE DADOS");
        console.log("=================================");

        await pool.query(`
            CREATE TABLE IF NOT EXISTS interrupcoes (
                id SERIAL PRIMARY KEY,
                dat_geracao_conjunto_dados DATE,
                ide_conjunto_unidade_consumidora VARCHAR(100),
                dsc_conjunto_unidade_consumidora VARCHAR(255),
                dsc_alimentador_subestacao VARCHAR(255),
                dsc_subestacao_distribuicao VARCHAR(255),
                num_ordem_interrupcao VARCHAR(100),
                dsc_tipo_interrupcao VARCHAR(255),
                ide_motivo_interrupcao VARCHAR(100),
                dat_inicio_interrupcao TIMESTAMP,
                dat_fim_interrupcao TIMESTAMP,
                dsc_fato_gerador_interrupcao VARCHAR(255),
                num_nivel_tensao NUMERIC,
                num_unidade_consumidora INTEGER,
                num_consumidor_conjunto INTEGER,
                num_ano INTEGER,
                nom_agente_regulado VARCHAR(255),
                sig_agente VARCHAR(50),
                num_cpf_cnpj VARCHAR(50)
            );
        `);

        console.log("✓ Banco configurado com sucesso!");

    } catch (erro) {
        console.error("ERRO AO CONFIGURAR BANCO:");
        console.error(erro.message);
    } finally {
        await pool.end();
    }
}

configurarBanco();