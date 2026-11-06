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
  contextKey?: string;
  contextValue?: string;
};

function formatChartPeriod(value: string): string {
  const eph = /^(\\d{4})([1-4])([ST])$/.exec(value);
  if (eph) {
    const [, year, period, kind] = eph;
    return kind === "S"
      ? `${period === "1" ? "1.er" : "2.º"} semestre ${year}`
      : `${period}.º trimestre ${year}`;
  }
  return value;
}

function formatContext(value: string): string {
  return value === "T_31_A" ? "Total de los 31 aglomerados urbanos" : value;
}

function numericValue(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value !== "string") return null;
  const normalized = value.trim();
  const validLocalized = /^-?(?:\d+|\d{1,3}(?:\.\d{3})+)(?:,\d+)?$/.test(normalized);
  const validDecimal = /^-?\d+(?:\.\d+)?$/.test(normalized);
  if (!validLocalized && !validDecimal) return null;
  const parsed = normalized.includes(",")
    ? Number(normalized.replace(/\./g, "").replace(",", "."))
    : /^-?\d{1,3}(?:\.\d{3})+$/.test(normalized)
      ? Number(normalized.replace(/\./g, ""))
      : Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

export function buildTimeSeriesPoints(
  rows: Record<string, unknown>[],
  periodKey: string,
  valueKey: string,
) {
  const points = rows
    .map((row) => {
      const period = row[periodKey] ?? row.periodo ?? row.Periodo ?? row.fecha ?? row.anio;
      if (period === null || period === undefined || String(period).trim() === "") return null;
      return { period: String(period), value: numericValue(row[valueKey]) };
    })
    .filter((point): point is { period: string; value: number | null } => point !== null)
    .sort((a, b) => a.period.localeCompare(b.period, "es", { numeric: true }));

  const periodCounts = new Map<string, number>();
  for (const point of points) {
    periodCounts.set(point.period, (periodCounts.get(point.period) ?? 0) + 1);
  }

  return {
    points,
    duplicatePeriods: [...periodCounts.entries()]
      .filter(([, count]) => count > 1)
      .map(([period]) => period),
    numericCount: points.filter((point) => point.value !== null).length,
    skippedCount: points.filter((point) => point.value === null).length,
  };
}

export function IndicatorTimeSeriesChart({
  rows,
  periodKey,
  valueKey,
  valueLabel,
  unit,
  contextKey,
  contextValue = "",
}: IndicatorTimeSeriesChartProps) {
  const contexts = contextKey
    ? [...new Set(rows
        .map((row) => row[contextKey])
        .filter((value) => value !== null && value !== undefined && String(value).trim() !== "")
        .map(String))]
    : [];
  const requiresContext = contexts.length > 1;
  const selectedRows = requiresContext
    ? contextValue
      ? rows.filter((row) => String(row[contextKey!]) === contextValue)
      : []
    : rows;

  const {
    points: pointsWithMissing,
    duplicatePeriods,
    numericCount,
    skippedCount: skipped,
  } = buildTimeSeriesPoints(selectedRows, periodKey, valueKey);

  if (requiresContext && !contextValue) {
    return (
      <div className="rounded-xl border border-dashed border-ink-foreground/15 bg-ink-2/30 px-5 py-8 text-center">
        <p className="text-sm font-medium">Elegí una desagregación para construir la serie.</p>
        <p className="mt-2 text-xs text-ink-muted">
          El conjunto contiene {contexts.length} categorías. No se mezclan en una única línea porque representan universos distintos.
        </p>
      </div>
    );
  }

  if (duplicatePeriods.length > 0) {
    return (
      <div className="rounded-xl border border-dashed border-amber-300/25 bg-amber-300/5 px-5 py-8 text-center">
        <p className="text-sm font-medium">Esta consulta contiene más de una observación por período.</p>
        <p className="mt-2 text-xs text-ink-muted">
          No se dibuja una línea porque podrían mezclarse categorías o dimensiones distintas. Refiná la desagregación o consultá los registros en la tabla.
        </p>
      </div>
    );
  }

  if (numericCount < 2) {
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
          <p className="mt-1 text-xs text-ink-muted">{valueLabel} · {unit}{contextValue ? ` · ${formatContext(contextValue)}` : ""}</p>
        </div>
        <span className="text-xs text-ink-muted">{numericCount} observaciones graficadas</span>
      </div>
      <div className="h-[280px] w-full" role="img" aria-label={`Gráfico de líneas de ${valueLabel} a lo largo de ${numericCount} períodos`}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={pointsWithMissing} margin={{ top: 8, right: 12, left: 0, bottom: 4 }}>
            <CartesianGrid stroke="currentColor" opacity={0.12} vertical={false} />
            <XAxis
              dataKey="period"
              tickFormatter={formatChartPeriod}
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
              tickFormatter={(value: number) => `${new Intl.NumberFormat("es-AR", { notation: "compact", maximumFractionDigits: 1 }).format(value)}${unit.toLowerCase().includes("porcent") ? (unit.toLowerCase().includes("puntos") ? " pp" : "%") : ""}`}
              domain={["auto", "auto"]}
            />
            <Tooltip
              contentStyle={{ background: "#101713", border: "1px solid rgba(255,255,255,.16)", borderRadius: 10, color: "#f4f7f3" }}
              labelStyle={{ color: "#c5d0c7" }}
              labelFormatter={(label) => formatChartPeriod(String(label))}
              formatter={(value) => [`${new Intl.NumberFormat("es-AR", { maximumFractionDigits: 2 }).format(Number(value))}${unit.toLowerCase().includes("porcent") ? (unit.toLowerCase().includes("puntos") ? " pp" : "%") : ""}`, valueLabel]}
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
          {skipped} observaciones no tienen un valor numérico interpretable. Se conservan como interrupciones de la línea y permanecen en la tabla original.
        </p>
      ) : null}
    </section>
  );
}
