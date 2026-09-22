import {
  useEffect,
  useState,
} from "react";

import {
  buscarDashboard,
} from "../services/api";

function useDashboard(
  inicio,
  fim
) {
  const [total, setTotal] =
    useState(0);

  const [
    dadosMensais,
    setDadosMensais,
  ] = useState([]);

  const [
    dadosPorTipo,
    setDadosPorTipo,
  ] = useState([]);

  const [
    duracaoMedia,
    setDuracaoMedia,
  ] = useState(0);

  const [
    dadosPorDistribuidora,
    setDadosPorDistribuidora,
  ] = useState([]);

  const [
    carregando,
    setCarregando,
  ] = useState(false);

  const [
    erro,
    setErro,
  ] = useState(false);

  useEffect(() => {
    let consultaAtual = true; //Ela é usada para evitar que uma resposta antiga sobrescreva uma resposta mais recente.

    async function carregarDados() {
      try { //Aqui  ocorre a limpeza dos dados anteriores antes de receber os novos.
        setCarregando(true);
        setErro(false);

        setTotal(0);
        setDadosMensais([]);
        setDadosPorTipo([]);
        setDuracaoMedia(0);
        setDadosPorDistribuidora([]);

        const dados = //aqui acontece a comunicação com a API
          await buscarDashboard(
            inicio,
            fim
          );

        if (!consultaAtual) { //Isso impede uma resposta antiga de atualizar a tela
          return;
        }

        setTotal(dados.total);

        setDadosMensais(
          dados.porMes
        );

        setDadosPorTipo(
          dados.porTipo
        );

        setDuracaoMedia(
          dados.duracaoMedia
        );

        setDadosPorDistribuidora(
          dados.porDistribuidora
        );
      } catch (error) {
        if (!consultaAtual) {
          return;
        }

        console.error(
          "Erro ao carregar dados:",
          error
        );

        setErro(true);
      } finally {
        if (consultaAtual) {
          setCarregando(false);
        }
      }
    }

    carregarDados();

    return () => {
      consultaAtual = false;
    };
  }, [inicio, fim]);

  return {
    total,
    dadosMensais,
    dadosPorTipo,
    duracaoMedia,
    dadosPorDistribuidora,
    carregando,
    erro,
  };
}

export default useDashboard;