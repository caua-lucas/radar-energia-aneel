import { Router } from "express";

import {
  totalInterrupcoes,
  interrupcoesPorMes,
  interrupcoesPorTipo,
  duracaoMedia,
  interrupcoesPorDistribuidora,
  dashboard,
} from "../controllers/interrupcoesController.js";

const routes = Router();

routes.get("/", (req, res) => {
  res.json({
    mensagem:
      "Radar de Energia API funcionando!",
  });
});

routes.get("/api/saude", (req, res) => {
  res.json({
    status: "OK",
  });
});

routes.get("/api/interrupcoes/total",totalInterrupcoes);
routes.get("/api/interrupcoes/por-mes",interrupcoesPorMes);
routes.get("/api/interrupcoes/por-tipo",interrupcoesPorTipo);
routes.get("/api/interrupcoes/duracao-media",duracaoMedia);
routes.get("/api/interrupcoes/por-distribuidora",interrupcoesPorDistribuidora);
routes.get("/api/interrupcoes/dashboard",dashboard);

export default routes;