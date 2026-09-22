function Filtros({
  inicio,
  fim,
  setInicio,
  setFim,
}) {
  return (
    <div className="filtros">
      <div>
        <label>Período inicial</label>

        <input
          type="month"
          value={inicio}
          max={fim}
          onChange={(e) => setInicio(e.target.value)}
        />
      </div>

      <div>
        <label>Período final</label>

        <input
          type="month"
          value={fim}
          min={inicio}
          onChange={(e) => setFim(e.target.value)}
        />
      </div>
    </div>
  );
}

export default Filtros;