import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const MESES = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
]; // esta variavel é utilizada para exibir no grafico os meses

const MESES_COMPLETOS = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
]; //esta variavel é utilizada para exibir no grafico os meses quando esta passando o mouse sobre os meses.

function formatarNumero(valor) {
  return Number(valor).toLocaleString("pt-BR");
}

function formatarMes(valor, completo = false) {
  if (!valor) {
    return "";
  }

  const numeroMes =
    Number(valor.substring(5, 7)) - 1; // Pega o mês da data, por exemplo "03" de "2026-03" e como a posição começa sendo 0,janeiro seria 0 e nao 1,então o valor seria -1 para ser examente o mes que voce escolheu.

  return completo
    ? MESES_COMPLETOS[numeroMes]
    : MESES[numeroMes];
}

function GraficoMensal({ data }) {
  return (
    <div className="grafico">
      <h2>Evolução das interrupções</h2>

      <ResponsiveContainer
        width="100%"
        height={300}
      >
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis
            dataKey="mes"
            tickFormatter={(valor) =>
              formatarMes(valor)
            }
          /> //exibe na tela os meses abreviados para o grafico.

          <YAxis
            width={80}
            tickFormatter={formatarNumero}
          />

          <Tooltip
            formatter={formatarNumero}
            labelFormatter={(valor) =>
              formatarMes(valor, true)
            }
          /> //exibe na tela os meses completos quando passa o mouse.

          <Line
            type="monotone"
            dataKey="total"
            name="Interrupções"
            strokeWidth={2} //define a expressura da linha
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default GraficoMensal;