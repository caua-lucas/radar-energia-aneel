const DATASET_URL =
  "https://dadosabertos.aneel.gov.br/api/3/action/package_show?id=ccb25653-f07b-4f28-84c2-62a89d1f5a56";

export async function buscarRecursosANEEL() {
  const resposta = await fetch(DATASET_URL);

  if (!resposta.ok) {
    throw new Error(
      `Erro ao consultar os dados da ANEEL: ${resposta.status}`
    );
  }

  const dados = await resposta.json();

  if (!dados.success) {
    throw new Error("A ANEEL não retornou os dados esperados.");
  }

  return dados.result.resources;
}

export async function buscarRecursoPorAno(ano) {
  const recursos = await buscarRecursosANEEL();

  const recurso = recursos.find((item) => {
    return item.name?.includes(String(ano));
  });

  if (!recurso) {
    throw new Error(
      `Nenhum recurso da ANEEL encontrado para o ano ${ano}.`
    );
  }

  return recurso;
}