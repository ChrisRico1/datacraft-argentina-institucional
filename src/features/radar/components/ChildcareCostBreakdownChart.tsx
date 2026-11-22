import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { buildChildcareCostBreakdown } from "./childcareCostBreakdown";

type ChildcareCostBreakdownChartProps = {
  rows: Record<string, unknown>[];
};

const currency = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});
const compactCurrency = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  notation: "compact",
  maximumFractionDigits: 1,
});

export function ChildcareCostBreakdownChart({ rows }: ChildcareCostBreakdownChartProps) {
  const result = buildChildcareCostBreakdown(rows);

  if (result.status !== "ready") {
    const message =
      result.status === "no-data"
        ? "No hay un período disponible para construir la comparación."
        : result.status === "duplicate-period"
          ? "El último período contiene más de una fila. No se agregan observaciones ambiguas."
          : result.status === "incomplete"
            ? `Faltan valores publicados para construir la comparación: ${result.missing.join(", ")}.`
            : "No se pudo construir la comparación.";

    return (
      <section className="rounded-xl border border-dashed border-ink-foreground/15 bg-ink-2/30 p-5">
        <p className="eyebrow text-lime">COMPOSICIÓN DE LA CANASTA</p>
        <p className="mt-2 text-sm text-ink-muted">{message}</p>
      </section>
    );
  }

  return (
    <section aria-label="Composición de la canasta de crianza por tramo de edad" className="rounded-xl border border-ink-foreground/10 bg-ink-2/35 p-4 sm:p-5">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="eyebrow text-lime">COMPOSICIÓN DE LA CANASTA</p>
          <h4 className="mt-1 text-base font-semibold">Bienes, servicios y tiempo de cuidado</h4>
          <p className="mt-1 text-xs text-ink-muted">Último período disponible: {result.period}</p>
        </div>
        <div className="flex flex-wrap gap-3 text-xs text-ink-muted">
          <span><span className="mr-1 inline-block h-2 w-2 rounded-sm bg-[#b7e36a]" />Bienes y servicios</span>
          <span><span className="mr-1 inline-block h-2 w-2 rounded-sm bg-[#66b8dc]" />Tiempo de cuidado</span>
        </div>
      </div>
      <div className="h-[300px] w-full" role="img" aria-label="Barras horizontales apiladas de bienes y servicios y tiempo de cuidado para cuatro tramos de edad">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={result.rows} layout="vertical" margin={{ top: 4, right: 100, left: 8, bottom: 4 }}>
            <CartesianGrid stroke="currentColor" opacity={0.12} horizontal={false} />
            <XAxis
              type="number"
              tick={{ fill: "currentColor", fontSize: 10 }}
              tickLine={false}
              axisLine={{ stroke: "currentColor", opacity: 0.2 }}
              tickFormatter={(value: number) => compactCurrency.format(value)}
            />
            <YAxis
              type="category"
              dataKey="age"
              width={112}
              tick={{ fill: "currentColor", fontSize: 10 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{ background: "#101713", border: "1px solid rgba(255,255,255,.16)", borderRadius: 10, color: "#f4f7f3" }}
              labelStyle={{ color: "#c5d0c7" }}
              formatter={(value, name) => [currency.format(Number(value)), name]}
            />
            <Bar dataKey="goods" name="Bienes y servicios" stackId="cost" fill="#b7e36a" maxBarSize={28} />
            <Bar dataKey="care" name="Tiempo de cuidado" stackId="cost" fill="#66b8dc" maxBarSize={28}>
              <LabelList dataKey="total" position="right" formatter={(value: unknown) => currency.format(Number(value))} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-3 text-[11px] leading-relaxed text-ink-muted">
        El total mostrado al final de cada barra es el valor publicado por INDEC. No se recalcula: puede diferir levemente de la suma de los componentes por redondeo.
      </p>
    </section>
  );
}
