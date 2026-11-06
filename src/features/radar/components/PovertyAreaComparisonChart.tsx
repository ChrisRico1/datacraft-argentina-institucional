import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type PovertyAreaComparisonProps = {
  rows: Record<string, unknown>[];
  periodKey: string;
  valueKey: string;
  areaKey: string;
  valueLabel: string;
};

function parsePublishedNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value !== "string") return null;
  const raw = value.trim();
  if (!/^-?\d+(?:[.,]\d+)?$/.test(raw)) return null;
  const parsed = Number(raw.replace(",", "."));
  return Number.isFinite(parsed) ? parsed : null;
}

export function buildLatestAreaComparison(
  rows: Record<string, unknown>[],
  periodKey: string,
  valueKey: string,
  areaKey: string,
) {
  const latestPeriod = rows
    .map((row) => row[periodKey])
    .filter((value): value is string | number => typeof value === "string" || typeof value === "number")
    .map(String)
    .sort((a, b) => a.localeCompare(b, "es", { numeric: true }))
    .at(-1);

  if (!latestPeriod) return { period: null, data: [] as { area: string; value: number }[] };

  const data = rows
    .filter((row) => String(row[periodKey] ?? "") === latestPeriod)
    .map((row) => {
      const area = row[areaKey];
      const value = parsePublishedNumber(row[valueKey]);
      if (area === null || area === undefined || value === null) return null;
      return { area: String(area), value };
    })
    .filter((item): item is { area: string; value: number } => item !== null)
    .sort((a, b) => b.value - a.value);

  const areaCounts = new Map<string, number>();
  for (const item of data) {
    areaCounts.set(item.area, (areaCounts.get(item.area) ?? 0) + 1);
  }
  const duplicateAreas = [...areaCounts.entries()]
    .filter(([, count]) => count > 1)
    .map(([area]) => area);

  return { period: latestPeriod, data, duplicateAreas };
}

export function PovertyAreaComparisonChart({
  rows,
  periodKey,
  valueKey,
  areaKey,
  valueLabel,
}: PovertyAreaComparisonProps) {
  const comparison = buildLatestAreaComparison(rows, periodKey, valueKey, areaKey);

  if (comparison.duplicateAreas.length > 0) {
    return (
      <div className="rounded-xl border border-dashed border-amber-300/25 bg-amber-300/5 px-5 py-8 text-center">
        <p className="text-sm font-medium">Hay más de un registro para algunas áreas en el último período.</p>
        <p className="mt-2 text-xs text-ink-muted">No se construye la comparación para evitar mezclar desagregaciones. Revisá los registros originales.</p>
      </div>
    );
  }

  if (comparison.data.length < 2) {
    return (
      <div className="rounded-xl border border-dashed border-ink-foreground/15 bg-ink-2/30 px-5 py-8 text-center">
        <p className="text-sm font-medium">No hay suficientes áreas con datos numéricos para comparar.</p>
        <p className="mt-2 text-xs text-ink-muted">Los valores originales y sus marcas estadísticas siguen disponibles en la tabla.</p>
      </div>
    );
  }

  return (
    <section aria-label={`Comparación territorial de ${valueLabel}`} className="rounded-xl border border-ink-foreground/10 bg-ink-2/35 p-4 sm:p-5">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="eyebrow text-lime">COMPARACIÓN TERRITORIAL</p>
          <h4 className="mt-1 text-base font-semibold">Diferencias entre aglomerados</h4>
          <p className="mt-1 text-xs text-ink-muted">{valueLabel} · último período disponible: {comparison.period}</p>
        </div>
        <span className="text-xs text-ink-muted">{comparison.data.length} áreas comparables</span>
      </div>
      <div className="w-full" style={{ height: Math.max(280, comparison.data.length * 30 + 56) }} role="img" aria-label={`Gráfico de barras horizontales de ${valueLabel} por aglomerado`}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={comparison.data} layout="vertical" margin={{ top: 4, right: 24, left: 8, bottom: 4 }}>
            <CartesianGrid stroke="currentColor" opacity={0.12} horizontal={false} />
            <XAxis
              type="number"
              domain={[0, "auto"]}
              tick={{ fill: "currentColor", fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: "currentColor", opacity: 0.2 }}
              tickFormatter={(value: number) => `${value}%`}
            />
            <YAxis
              type="category"
              dataKey="area"
              width={150}
              tick={{ fill: "currentColor", fontSize: 10 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{ background: "#101713", border: "1px solid rgba(255,255,255,.16)", borderRadius: 10, color: "#f4f7f3" }}
              labelStyle={{ color: "#c5d0c7" }}
              formatter={(value) => [`${new Intl.NumberFormat("es-AR", { maximumFractionDigits: 1 }).format(Number(value))}%`, valueLabel]}
            />
            <Bar dataKey="value" name={valueLabel} fill="#b7e36a" radius={[0, 5, 5, 0]} maxBarSize={18} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-3 text-[11px] leading-relaxed text-ink-muted">
        La comparación corresponde a los aglomerados urbanos publicados por la EPH. No representa municipios ni departamentos y no debe interpretarse como un ranking de toda la población argentina.
      </p>
    </section>
  );
}
