function TabelaDistribuidoras({ data }) {
  return (
    <div className="tabela">
      <h2>
        Top 10 distribuidoras por interrupções
      </h2>

      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Distribuidora</th>
            <th>Total de interrupções</th>
          </tr>
        </thead>

        <tbody>
          {data.length > 0 ? (
            data.map((item, index) => (
              <tr
                key={`${item.distribuidora}-${index}`}
              >
                <td>{index + 1}</td> {/* Como o índice do map começa em 0, somo 1 para a numeração começar em 1. */}

                <td>
                  {item.distribuidora}
                </td>

                <td>
                  {Number(item.total).toLocaleString(
                    "pt-BR"
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="3"
                className="sem-dados"
              >
                Nenhum dado encontrado para o
                período selecionado.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default TabelaDistribuidoras;