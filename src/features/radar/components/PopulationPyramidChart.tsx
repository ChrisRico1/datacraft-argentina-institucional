import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type PopulationPyramidChartProps = {
  rows: Record<string, unknown>[];
  periodKey: string;
  valueKey: string;
};

type PyramidRow = {
  age: string;
  female: number;
  male: number;
};

function numberValue(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value !== "string" || !value.trim()) return null;
  const normalized = value.trim();
  const parsed = normalized.includes(",")
    ? Number(normalized.replace(/\./g, "").replace(",", "."))
    : Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

function periodLabel(value: string): string {
  const match = /^(\d{4})-?(\d{2})-?(\d{2})?$/.exec(value);
  if (!match) return value;
  const [, year, month, day] = match;
  if (month && day) return `1 de julio de ${year}`;
  return year;
}

export function buildPopulationPyramid(
  rows: Record<string, unknown>[],
  periodKey: string,
  valueKey: string,
): { period: string; rows: PyramidRow[] } | null {
  const periods = [...new Set(rows.map((row) => String(row[periodKey] ?? row["fecha"] ?? "").trim()).filter(Boolean))].sort();
  const period = periods.at(-1);
  if (!period) return null;

  const byAge = new Map<string, { female: number; male: number }>();
  for (const row of rows) {
    if (String(row[periodKey] ?? row["fecha"] ?? "").trim() !== period) continue;
    const age = String(row["edad"] ?? "").trim();
    const sex = String(row["sexo_cod"] ?? "").trim();
    const value = numberValue(row[valueKey]);
    if (!age || value === null || (sex !== "1" && sex !== "2")) continue;
    const current = byAge.get(age) ?? { female: 0, male: 0 };
    if (sex === "1") current.female += value;
    else current.male += value;
    byAge.set(age, current);
  }

  if (byAge.size < 2) return null;
  const pyramidRows = [...byAge.entries()]
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([age, values]) => ({ age, female: -values.female, male: values.male }));
  if (!pyramidRows.some((row) => row.female < 0) || !pyramidRows.some((row) => row.male > 0)) return null;
  return { period, rows: pyramidRows };
}

const compact = new Intl.NumberFormat("es-AR", { notation: "compact", maximumFractionDigits: 1 });
const full = new Intl.NumberFormat("es-AR", { maximumFractionDigits: 0 });

export function PopulationPyramidChart({ rows, periodKey, valueKey }: PopulationPyramidChartProps) {
  const result = useMemo(() => buildPopulationPyramid(rows, periodKey, valueKey), [rows, periodKey, valueKey]);

  if (!result) {
    return (
      <section className="rounded-xl border border-ink-foreground/10 bg-ink-2/35 p-5">
        <p className="eyebrow text-lime">ESTRUCTURA DEMOGRÁFICA</p>
        <p className="mt-2 text-sm text-ink-muted">Para construir la pirámide se necesitan edades y ambos sexos para una misma fecha de referencia. Quitá los filtros de edad y sexo.</p>
      </section>
    );
  }

  const maxValue = Math.max(...result.rows.flatMap((row) => [Math.abs(row.female), row.male]));
  return (
    <section aria-label="Pirámide poblacional por edad y sexo" className="rounded-xl border border-ink-foreground/10 bg-ink-2/35 p-4 sm:p-5">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="eyebrow text-lime">ESTRUCTURA DEMOGRÁFICA</p>
          <h4 className="mt-1 text-base font-semibold">Pirámide poblacional</h4>
          <p className="mt-1 text-xs text-ink-muted">Población por edad y sexo · {periodLabel(result.period)}</p>
        </div>
        <div className="flex gap-4 text-xs text-ink-muted">
          <span><span className="mr-1 inline-block h-2 w-2 rounded-full bg-[#b7e36a]" />Mujeres</span>
          <span><span className="mr-1 inline-block h-2 w-2 rounded-full bg-[#66b8dc]" />Varones</span>
        </div>
      </div>
      <div className="h-[440px] w-full" role="img" aria-label="Pirámide poblacional: mujeres a la izquierda y varones a la derecha, agrupados por edad">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={result.rows} layout="vertical" margin={{ top: 4, right: 12, left: 8, bottom: 4 }}>
            <CartesianGrid stroke="currentColor" opacity={0.12} horizontal={false} />
            <XAxis
              type="number"
              domain={[-maxValue, maxValue]}
              tick={{ fill: "currentColor", fontSize: 10 }}
              tickLine={false}
              axisLine={{ stroke: "currentColor", opacity: 0.2 }}
              tickFormatter={(value: number) => compact.format(Math.abs(value))}
            />
            <YAxis
              type="category"
              dataKey="age"
              width={42}
              tick={{ fill: "currentColor", fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              interval={Math.max(0, Math.ceil(result.rows.length / 24) - 1)}
            />
            <ReferenceLine x={0} stroke="currentColor" opacity={0.35} />
            <Tooltip
              contentStyle={{ background: "#101713", border: "1px solid rgba(255,255,255,.16)", borderRadius: 10, color: "#f4f7f3" }}
              labelStyle={{ color: "#c5d0c7" }}
              labelFormatter={(label) => `${label} años`}
              formatter={(value, name) => [full.format(Math.abs(Number(value))), name === "female" ? "Mujeres" : "Varones"]}
            />
            <Bar dataKey="female" name="Mujeres" fill="#b7e36a" stackId="population" maxBarSize={14} />
            <Bar dataKey="male" name="Varones" fill="#66b8dc" stackId="population" maxBarSize={14} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-3 text-[11px] leading-relaxed text-ink-muted">Las barras se orientan a lados opuestos para facilitar la comparación. La fecha de referencia y los valores provienen de la serie publicada por INDEC; no se agrupan edades ni se extrapolan registros.</p>
    </section>
  );
}
