const API =
  "http://localhost:3001/api/interrupcoes";

async function buscarDados(endpoint, inicio, fim) {
  // Faz uma requisição para a API usando o endpoint e o período selecionado.
  const resposta = await fetch(
    `${API}/${endpoint}?inicio=${inicio}&fim=${fim}`
  );

  if (!resposta.ok) {
    throw new Error("Erro ao buscar dados.");
  }

  return resposta.json();
}

export async function buscarDashboard(inicio, fim) {
  const dados = await buscarDados(
    "dashboard",
    inicio,
    fim
  );

  return {
    total: Number(dados.total) || 0,

    porMes: dados.porMes.map((item) => ({
      ...item,
      total: Number(item.total) || 0,
    })),

    porTipo: dados.porTipo.map((item) => ({
      ...item,
      total: Number(item.total) || 0,
    })),

    duracaoMedia:
      Number(dados.duracaoMedia) || 0,

    porDistribuidora:
      dados.porDistribuidora.map((item) => ({
        ...item,
        total: Number(item.total) || 0,
      })),
  };
}