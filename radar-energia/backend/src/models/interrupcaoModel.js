import pool from "../config/database.js";

// Adiciona o filtro de período
function adicionarFiltroPeriodo(query, valores, inicio, fim) {
  if (inicio && fim) {
    query += `
      WHERE dat_inicio_interrupcao >= $1::date // A parte da função $1::date, $1 representa o primeiro parâmetro e ::date informa ao PostgreSQL que ele deve ser tratado como uma data.
      AND dat_inicio_interrupcao < ($2::date + INTERVAL '1 month')
    `;

    valores.push(`${inicio}-01`, `${fim}-01`);
  }

  return query;
}

// Executa a consulta e mostra o tempo gasto
async function executarConsulta(query, valores) {
  const inicio = Date.now();

  const resultado = await pool.query(query, valores);

  const tempo = Date.now() - inicio;

  console.log(`Consulta executada em ${tempo} ms`);

  return resultado;
}


export async function buscarTotalInterrupcoes(inicio, fim) {
  let query = `
    SELECT COUNT(*) AS total
    FROM interrupcoes
  `;

  const valores = [];

  query = adicionarFiltroPeriodo(query, valores, inicio, fim);

  const resultado = await executarConsulta(query, valores);

  return Number(resultado.rows[0].total);
}

export async function buscarInterrupcoesPorMes(inicio, fim) {
  let query = `
    SELECT
      TO_CHAR(
        DATE_TRUNC('month', dat_inicio_interrupcao),
        'YYYY-MM'
      ) AS mes,
      COUNT(*) AS total
    FROM interrupcoes
  `;

  const valores = [];

  query = adicionarFiltroPeriodo(query, valores, inicio, fim);

  query += `
    GROUP BY DATE_TRUNC('month', dat_inicio_interrupcao)
    ORDER BY DATE_TRUNC('month', dat_inicio_interrupcao)
  `;

  const resultado = await executarConsulta(query, valores);

  return resultado.rows.map((item) => ({
    mes: item.mes,
    total: Number(item.total),
  }));
}


export async function buscarInterrupcoesPorTipo(inicio, fim) {
  let query = `
    SELECT
      dsc_tipo_interrupcao AS tipo,
      COUNT(*) AS total
    FROM interrupcoes
  `;

  const valores = [];

  query = adicionarFiltroPeriodo(query, valores, inicio, fim);

  query += `
    GROUP BY dsc_tipo_interrupcao
    ORDER BY total DESC
  `;

  const resultado = await executarConsulta(query, valores);

  return resultado.rows.map((item) => ({
    tipo: item.tipo,
    total: Number(item.total),
  }));
}


export async function buscarDuracaoMedia(inicio, fim) {
  let query = `
    SELECT
      ROUND(
        AVG(
          EXTRACT(
            EPOCH FROM (
              dat_fim_interrupcao - dat_inicio_interrupcao
            )
          ) / 60
        ),
        2
      ) AS duracao_media_minutos
    FROM interrupcoes
    WHERE dat_fim_interrupcao IS NOT NULL
  `;

  const valores = [];

  if (inicio && fim) {
    query += `
      AND dat_inicio_interrupcao >= $1::date
      AND dat_inicio_interrupcao < ($2::date + INTERVAL '1 month')
    `;

    valores.push(`${inicio}-01`, `${fim}-01`);
  }

  const resultado = await executarConsulta(query, valores);

  return Number(
    resultado.rows[0].duracao_media_minutos || 0
  );
}

export async function buscarInterrupcoesPorDistribuidora(
  inicio,
  fim
) {
  let query = `
    SELECT
      nom_agente_regulado AS distribuidora,
      COUNT(*) AS total
    FROM interrupcoes
  `;

  const valores = [];

  query = adicionarFiltroPeriodo(query, valores, inicio, fim);

  query += `
    GROUP BY nom_agente_regulado
    ORDER BY total DESC
    LIMIT 10
  `;

  const resultado = await executarConsulta(query, valores);

  return resultado.rows.map((item) => ({
    distribuidora: item.distribuidora,
    total: Number(item.total),
  }));
}



export async function buscarDashboard(inicio, fim) {
  const inicioTempo = Date.now();

  const valores = [`${inicio}-01`, `${fim}-01`];

  /*
    Todas as informações do dashboard são obtidas
    em uma única consulta ao PostgreSQL.
  */

  const query = `
    WITH filtradas AS (
      SELECT
        dat_inicio_interrupcao,
        dat_fim_interrupcao,
        dsc_tipo_interrupcao,
        nom_agente_regulado
      FROM interrupcoes
      WHERE dat_inicio_interrupcao >= $1::date
        AND dat_inicio_interrupcao < ($2::date + INTERVAL '1 month')
    ),

    total AS (
      SELECT COUNT(*) AS valor
      FROM filtradas
    ),

    por_mes AS (
      SELECT
        TO_CHAR(
          DATE_TRUNC('month', dat_inicio_interrupcao),
          'YYYY-MM'
        ) AS mes,
        COUNT(*) AS total
      FROM filtradas
      GROUP BY DATE_TRUNC('month', dat_inicio_interrupcao)
      ORDER BY DATE_TRUNC('month', dat_inicio_interrupcao)
    ),

    por_tipo AS (
      SELECT
        dsc_tipo_interrupcao AS tipo,
        COUNT(*) AS total
      FROM filtradas
      GROUP BY dsc_tipo_interrupcao
      ORDER BY total DESC
    ),

    duracao AS (
      SELECT
        ROUND(
          AVG(
            EXTRACT(
              EPOCH FROM (
                dat_fim_interrupcao - dat_inicio_interrupcao
              )
            ) / 60
          ),
          2
        ) AS valor
      FROM filtradas
      WHERE dat_fim_interrupcao IS NOT NULL
    ),

    por_distribuidora AS (
      SELECT
        nom_agente_regulado AS distribuidora,
        COUNT(*) AS total
      FROM filtradas
      GROUP BY nom_agente_regulado
      ORDER BY total DESC
      LIMIT 10
    )

    SELECT
      (SELECT valor FROM total) AS total,
      COALESCE(
        (SELECT json_agg(por_mes) FROM por_mes),
        '[]'
      ) AS por_mes,
      COALESCE(
        (SELECT json_agg(por_tipo) FROM por_tipo),
        '[]'
      ) AS por_tipo,
      COALESCE(
        (SELECT valor FROM duracao),
        0
      ) AS duracao_media,
      COALESCE(
        (SELECT json_agg(por_distribuidora)
         FROM por_distribuidora),
        '[]'
      ) AS por_distribuidora;
  `;

  const resultado = await executarConsulta(
    query,
    valores
  );

  const dados = resultado.rows[0];

  console.log(
    `Dashboard completo carregado em ${
      Date.now() - inicioTempo
    } ms`
  );

  return {
    total: Number(dados.total) || 0,

    porMes: dados.por_mes.map((item) => ({
      mes: item.mes,
      total: Number(item.total) || 0,
    })),

    porTipo: dados.por_tipo.map((item) => ({
      tipo: item.tipo,
      total: Number(item.total) || 0,
    })),

    duracaoMedia: Number(dados.duracao_media) || 0,

    porDistribuidora: dados.por_distribuidora.map(
      (item) => ({
        distribuidora: item.distribuidora,
        total: Number(item.total) || 0,
      })
    ),
  };
}