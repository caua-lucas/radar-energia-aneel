function Cards({
  total,
  dadosPorTipo,
  duracaoMedia,
}) {
  const naoProgramadas = Number(
    dadosPorTipo.find(
      (item) => item.tipo === "Não Programada"
    )?.total || 0
  );

  const programadas = Number(
    dadosPorTipo.find(
      (item) => item.tipo === "Programada"
    )?.total || 0
  );

  return (
    <div className="cards">
      <div className="card">
        <h2>Total de interrupções</h2>

        <p>
          {Number(total).toLocaleString("pt-BR")}
        </p>
      </div>

      <div className="card">
        <h2>Não programadas</h2>

        <p>
          {naoProgramadas.toLocaleString("pt-BR")}
        </p>
      </div>

      <div className="card">
        <h2>Programadas</h2>

        <p>
          {programadas.toLocaleString("pt-BR")}
        </p>
      </div>

      <div className="card">
        <h2>Duração média</h2>

        <p>
          {duracaoMedia > 0
            ? `${Number(duracaoMedia).toLocaleString(
                "pt-BR"
              )} min`
            : "Sem dados"}
        </p>
      </div>
    </div>
  );
}

export default Cards;