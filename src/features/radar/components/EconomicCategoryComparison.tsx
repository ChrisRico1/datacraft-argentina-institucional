import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type EconomicCategoryComparisonProps = {
  rows: Record<string, unknown>[];
  period: string;
  metricLabel: string;
  unit: string;
  loading?: boolean;
  error?: string | null;
  incomplete?: boolean;
};

type ComparisonRow = {
  code: string;
  label: string;
  value: number;
  note: string;
};

const numberFormat = new Intl.NumberFormat("es-AR", { maximumFractionDigits: 2 });

function numericValue(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value !== "string") return null;
  const normalized = value.trim();
  const localized = /^-?(?:\d+|\d{1,3}(?:\.\d{3})+)(?:,\d+)?$/.test(normalized);
  const decimal = /^-?\d+(?:\.\d+)?$/.test(normalized);
  if (!localized && !decimal) return null;
  const parsed = normalized.includes(",")
    ? Number(normalized.replace(/\./g, "").replace(",", "."))
    : /^-?\d{1,3}(?:\.\d{3})+$/.test(normalized)
      ? Number(normalized.replace(/\./g, ""))
      : Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

function formatPeriod(value: string): string {
  const match = /^(\d{4})(0[1-9]|1[0-2])$/.exec(value);
  if (!match) return value;
  return new Intl.DateTimeFormat("es-AR", { month: "long", year: "numeric" })
    .format(new Date(Number(match[1]), Number(match[2]) - 1, 1));
}

function formatValue(value: number, unit: string): string {
  const suffix = /puntos/i.test(unit) ? " pp" : /porcentaje|%/i.test(unit) ? "%" : "";
  return `${numberFormat.format(value)}${suffix}`;
}

export function EconomicCategoryComparison({
  rows,
  period,
  metricLabel,
  unit,
  loading = false,
  error = null,
  incomplete = false,
}: EconomicCategoryComparisonProps) {
  if (loading) {
    return (
      <section className="mb-5 rounded-xl border border-ink-foreground/10 bg-ink-2/35 p-5">
        <p className="eyebrow text-lime">COMPARACIÓN DE APERTURAS</p>
        <p className="mt-2 text-sm text-ink-muted">Consultando las categorías del último período...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mb-5 rounded-xl border border-ink-foreground/10 bg-ink-2/35 p-5">
        <p className="eyebrow text-lime">COMPARACIÓN DE APERTURAS</p>
        <p className="mt-2 text-sm text-ink-muted">{error}</p>
      </section>
    );
  }

  if (incomplete) {
    return (
      <section className="mb-5 rounded-xl border border-ink-foreground/10 bg-ink-2/35 p-5">
        <p className="eyebrow text-lime">COMPARACIÓN DE APERTURAS</p>
        <p className="mt-2 text-sm text-ink-muted">La cantidad de categorías supera el límite de consulta segura. No se muestra un ranking parcial para evitar conclusiones incompletas.</p>
      </section>
    );
  }

  const periodRows = rows.filter((row) => String(row.periodo ?? row.Periodo ?? "") === period);
  if (periodRows.length === 0) {
    return (
      <section className="mb-5 rounded-xl border border-ink-foreground/10 bg-ink-2/35 p-5">
        <p className="eyebrow text-lime">COMPARACIÓN DE APERTURAS</p>
        <p className="mt-2 text-sm text-ink-muted">La consulta del último período no devolvió categorías para esta combinación de filtros.</p>
      </section>
    );
  }

  const levels = new Set(periodRows.map((row) => String(row.nivel ?? "")).filter(Boolean));
  if (levels.size !== 1) {
    return (
      <section className="mb-5 rounded-xl border border-ink-foreground/10 bg-ink-2/35 p-5">
        <p className="eyebrow text-lime">COMPARACIÓN DE APERTURAS</p>
        <p className="mt-2 text-sm text-ink-muted">La respuesta contiene más de un nivel estadístico. Refiná la selección para comparar categorías equivalentes.</p>
      </section>
    );
  }

  const seen = new Set<string>();
  const comparisonRows: ComparisonRow[] = [];
  let hasDuplicates = false;

  for (const row of periodRows) {
    const code = String(row.codigo_apertura ?? "").trim();
    const label = String(row.descripcion ?? "").trim();
    const key = code || label;
    if (!key || seen.has(key)) {
      hasDuplicates = true;
      break;
    }
    seen.add(key);
    const value = numericValue(row.valor);
    if (value === null) continue;
    comparisonRows.push({
      code,
      label: label || code,
      value,
      note: row.observaciones == null ? "" : String(row.observaciones),
    });
  }

  if (hasDuplicates) {
    return (
      <section className="mb-5 rounded-xl border border-amber-300/20 bg-amber-300/5 p-5">
        <p className="eyebrow text-lime">COMPARACIÓN DE APERTURAS</p>
        <p className="mt-2 text-sm text-ink-muted">Hay más de una observación para una misma apertura y período. No se agregan ni promedian registros automáticamente.</p>
      </section>
    );
  }

  if (comparisonRows.length < 2) {
    return (
      <section className="mb-5 rounded-xl border border-ink-foreground/10 bg-ink-2/35 p-5">
        <p className="eyebrow text-lime">COMPARACIÓN DE APERTURAS</p>
        <p className="mt-2 text-sm text-ink-muted">No hay suficientes categorías con valores numéricos para comparar en este período.</p>
      </section>
    );
  }

  const incidence = /incidencia/i.test(metricLabel);
  const ranked = [...comparisonRows].sort((a, b) =>
    incidence ? Math.abs(b.value) - Math.abs(a.value) : b.value - a.value,
  );
  const visible = ranked.slice(0, 12);
  const provisional = comparisonRows.some((row) => /provisorio|preliminar|estimado/i.test(row.note));

  return (
    <section aria-label="Comparación de categorías económicas" className="mb-5 rounded-xl border border-ink-foreground/10 bg-ink-2/35 p-4 sm:p-5">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="eyebrow text-lime">COMPARACIÓN DE APERTURAS</p>
          <h4 className="mt-1 text-base font-semibold">Categorías del último período</h4>
          <p className="mt-1 text-xs text-ink-muted">{metricLabel} · {formatPeriod(period)}</p>
        </div>
        <div className="text-right text-xs text-ink-muted">
          <p>{comparisonRows.length} categorías comparables</p>
          {provisional ? <p className="mt-1 text-amber-200">Incluye datos provisorios</p> : null}
        </div>
      </div>
      <div className="h-[360px] w-full" role="img" aria-label={`Comparación de ${visible.length} categorías para ${formatPeriod(period)}`}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={visible} layout="vertical" margin={{ top: 4, right: 20, left: 8, bottom: 4 }}>
            <CartesianGrid stroke="currentColor" opacity={0.12} horizontal={false} />
            <XAxis
              type="number"
              tick={{ fill: "currentColor", fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: "currentColor", opacity: 0.2 }}
              tickFormatter={(value: number) => new Intl.NumberFormat("es-AR", { notation: "compact", maximumFractionDigits: 1 }).format(value)}
            />
            <YAxis
              type="category"
              dataKey="label"
              width={150}
              tick={{ fill: "currentColor", fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              interval={0}
            />
            <Tooltip
              contentStyle={{ background: "#101713", border: "1px solid rgba(255,255,255,.16)", borderRadius: 10, color: "#f4f7f3" }}
              labelStyle={{ color: "#c5d0c7" }}
              formatter={(value) => [formatValue(Number(value), unit), metricLabel]}
            />
            <Bar dataKey="value" name={metricLabel} fill="#b7e36a" radius={[0, 5, 5, 0]} maxBarSize={22} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-3 text-[11px] leading-relaxed text-ink-muted">
        {incidence
          ? "Ordenadas por magnitud absoluta de incidencia; se conserva el signo de cada aporte."
          : "Ordenadas de mayor a menor valor. Se muestran las primeras 12 categorías; no se suman ni promedian aperturas."}
      </p>
    </section>
  );
}
