//codigo responsavel pela  ligação entre o Controller e o Model.
import {
  buscarTotalInterrupcoes,
  buscarInterrupcoesPorMes,
  buscarInterrupcoesPorTipo,
  buscarDuracaoMedia,
  buscarInterrupcoesPorDistribuidora,
  buscarDashboard
} from "../models/interrupcaoModel.js";

export async function obterTotalInterrupcoes(inicio, fim) {
  return await buscarTotalInterrupcoes(inicio, fim);
}

export async function obterInterrupcoesPorMes(inicio, fim) {
  return await buscarInterrupcoesPorMes(inicio, fim);
}

export async function obterInterrupcoesPorTipo(inicio, fim) {
  return await buscarInterrupcoesPorTipo(inicio, fim);
}

export async function obterDuracaoMedia(inicio, fim) {
  return await buscarDuracaoMedia(inicio, fim);
}

export async function obterInterrupcoesPorDistribuidora(
  inicio,
  fim
) {
  return await buscarInterrupcoesPorDistribuidora(
    inicio,
    fim
  );
}

// Dashboard completo
export async function obterDashboard(inicio, fim) {
  return await buscarDashboard(inicio, fim);
}