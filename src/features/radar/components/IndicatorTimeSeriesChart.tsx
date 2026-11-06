import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type IndicatorTimeSeriesChartProps = {
  rows: Record<string, unknown>[];
  periodKey: string;
  valueKey: string;
  valueLabel: string;
  unit: string;
};

function numericValue(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value !== "string") return null;
  const normalized = value.trim();
  if (!/^-?\\d+(?:\\.\\d+)?$/.test(normalized)) return null;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

export function IndicatorTimeSeriesChart({
  rows,
  periodKey,
  valueKey,
  valueLabel,
  unit,
}: IndicatorTimeSeriesChartProps) {
  const points = rows
    .map((row) => {
      const period = row[periodKey] ?? row.periodo ?? row.Periodo ?? row.fecha ?? row.anio;
      const value = numericValue(row[valueKey]);
      if (period === null || period === undefined || value === null) return null;
      return { period: String(period), value };
    })
    .filter((point): point is { period: string; value: number } => point !== null)
    .sort((a, b) => a.period.localeCompare(b.period, "es", { numeric: true }));

  const skipped = rows.length - points.length;

  if (points.length < 2) {
    return (
      <div className="rounded-xl border border-dashed border-ink-foreground/15 bg-ink-2/30 px-5 py-8 text-center">
        <p className="text-sm font-medium">Todavía no hay observaciones suficientes para graficar.</p>
        <p className="mt-2 text-xs text-ink-muted">
          Se necesitan al menos dos períodos con valores numéricos publicados. Los marcadores estadísticos se conservan en la tabla.
        </p>
      </div>
    );
  }

  return (
    <section aria-label={`Evolución temporal: ${valueLabel}`} className="rounded-xl border border-ink-foreground/10 bg-ink-2/35 p-4 sm:p-5">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="eyebrow text-lime">SERIE TEMPORAL</p>
          <h4 className="mt-1 text-base font-semibold">Evolución del indicador</h4>
          <p className="mt-1 text-xs text-ink-muted">{valueLabel} · {unit}</p>
        </div>
        <span className="text-xs text-ink-muted">{points.length} observaciones graficadas</span>
      </div>
      <div className="h-[280px] w-full" role="img" aria-label={`Gráfico de líneas de ${valueLabel} a lo largo de ${points.length} períodos`}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={points} margin={{ top: 8, right: 12, left: 0, bottom: 4 }}>
            <CartesianGrid stroke="currentColor" opacity={0.12} vertical={false} />
            <XAxis
              dataKey="period"
              tick={{ fill: "currentColor", fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: "currentColor", opacity: 0.2 }}
              minTickGap={28}
            />
            <YAxis
              width={64}
              tick={{ fill: "currentColor", fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value: number) => new Intl.NumberFormat("es-AR", { notation: "compact", maximumFractionDigits: 1 }).format(value)}
              domain={["auto", "auto"]}
            />
            <Tooltip
              contentStyle={{ background: "#101713", border: "1px solid rgba(255,255,255,.16)", borderRadius: 10, color: "#f4f7f3" }}
              labelStyle={{ color: "#c5d0c7" }}
              formatter={(value) => [new Intl.NumberFormat("es-AR", { maximumFractionDigits: 2 }).format(Number(value)), valueLabel]}
            />
            <Line
              type="monotone"
              dataKey="value"
              name={valueLabel}
              stroke="#b7e36a"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 5, strokeWidth: 0 }}
              connectNulls={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      {skipped > 0 ? (
        <p className="mt-3 text-[11px] leading-relaxed text-ink-muted">
          {skipped} observaciones no se incluyeron en el gráfico porque no contienen un valor numérico interpretable. Se mantienen en la tabla original.
        </p>
      ) : null}
    </section>
  );
}
