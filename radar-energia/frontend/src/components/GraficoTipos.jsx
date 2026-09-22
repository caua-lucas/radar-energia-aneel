import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function formatarNumero(valor) {
  return Number(valor).toLocaleString("pt-BR");
}

function GraficoTipos({ data }) {
  return (
    <div className="grafico">
      <h2>Interrupções</h2>

      <ResponsiveContainer
        width="100%"
        height={300}
      >
        <BarChart
          data={data}
          margin={{
            top: 10,
            right: 20,
            left: 20,
            bottom: 10,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="tipo" />

          <YAxis
            width={100}
            tickFormatter={formatarNumero}
          />

          <Tooltip
            formatter={formatarNumero}
          />

          <Bar
            dataKey="total"
            name="Interrupções"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default GraficoTipos;