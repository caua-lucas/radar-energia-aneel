import {
  obterTotalInterrupcoes,
  obterInterrupcoesPorMes,
  obterInterrupcoesPorTipo,
  obterDuracaoMedia,
  obterInterrupcoesPorDistribuidora,
  obterDashboard
} from "../services/interrupcaoService.js";

async function executar(
  req,
  res,
  next,
  service, //é a função do Service que será executada.
  transformar = (resultado) => resultado //opcionalmente modifica o resultado antes de enviar.
) {
  try {
    const { inicio, fim } = req.query;

    const resultado = await service(inicio, fim);

    res.json(transformar(resultado));
  } catch (error) {
    next(error);
  }
}

export function totalInterrupcoes(req, res, next) {
  return executar(
    req,
    res,
    next,
    obterTotalInterrupcoes,
    (resultado) => ({
      total: resultado
    })
  );
}

export function interrupcoesPorMes(req, res, next) {
  return executar(
    req,
    res,
    next,
    obterInterrupcoesPorMes
  );
}

export function interrupcoesPorTipo(req, res, next) {
  return executar(
    req,
    res,
    next,
    obterInterrupcoesPorTipo
  );
}

export function duracaoMedia(req, res, next) {
  return executar(
    req,
    res,
    next,
    obterDuracaoMedia,
    (resultado) => ({
      duracaoMediaMinutos: resultado
    })
  );
}

export function interrupcoesPorDistribuidora(req, res, next) {
  return executar(
    req,
    res,
    next,
    obterInterrupcoesPorDistribuidora
  );
}

export async function dashboard(req, res, next) {
  try {
    const { inicio, fim } = req.query;

    const resultado = await obterDashboard(inicio, fim);

    res.json(resultado);
  } catch (error) {
    next(error);
  }
}