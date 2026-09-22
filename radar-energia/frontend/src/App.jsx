import { useState } from "react";

import "./App.css";

import Header from "./components/Header";
import Filtros from "./components/Filtros";
import Cards from "./components/Cards";
import GraficoMensal from "./components/GraficoMensal";
import GraficoTipos from "./components/GraficoTipos";
import TabelaDistribuidoras from "./components/TabelaDistribuidoras";

import useDashboard from "./hooks/useDashboard";

function App() {
  const [inicio, setInicio] = useState("2026-01");
  const [fim, setFim] = useState("2026-12");

  const {
    total,
    dadosMensais,
    dadosPorTipo,
    duracaoMedia,
    dadosPorDistribuidora,
    carregando,
    erro,
  } = useDashboard(inicio, fim);

  return (
    <div className="dashboard">
      <Header />

      <Filtros
        inicio={inicio}
        fim={fim}
        setInicio={setInicio}
        setFim={setFim}
      />

      {carregando && (
        <div className="carregando">
          Carregando dados...
        </div>
      )}

      {erro && !carregando && (
        <div className="erro">
          Não foi possível carregar os dados.
          <br />
          Verifique se o backend está funcionando.
        </div>
      )}

      {!carregando && !erro && (
        <>
          <Cards
            total={total}
            dadosPorTipo={dadosPorTipo}
            duracaoMedia={duracaoMedia}
          />

          <div className="graficos">
            <GraficoMensal
              data={dadosMensais}
            />

            <GraficoTipos
              data={dadosPorTipo}
            />
          </div>

          <TabelaDistribuidoras
            data={dadosPorDistribuidora}
          />
        </>
      )}
    </div>
  );
}

export default App;