import { buildLatestMetricSummary, formatEphPeriodLabel } from "./latestMetricSummary";

type LatestMetricSummaryProps = {
  rows: Record<string, unknown>[];
  periodKey: string;
  valueKey: string;
  valueLabel: string;
  unit: string;
  contextKey?: string;
  contextValue?: string;
};

const numberFormat = new Intl.NumberFormat("es-AR", { maximumFractionDigits: 2 });

export function LatestMetricSummary({
  rows,
  periodKey,
  valueKey,
  valueLabel,
  unit,
  contextKey,
  contextValue = "",
}: LatestMetricSummaryProps) {
  const summary = buildLatestMetricSummary(rows, periodKey, valueKey, contextKey, contextValue);
  const percentage = /porcentaje|%/i.test(unit);
  const percentagePoints = /puntos/i.test(unit);
  const formatValue = (value: number) => `${numberFormat.format(value)}${percentage ? "%" : percentagePoints ? " pp" : ""}`;
  const changeSuffix = percentage || percentagePoints ? " p.p." : /índice/i.test(unit) ? " pts. índice" : "";

  if (summary.status === "select-context") {
    return (
      <div className="mb-5 rounded-xl border border-dashed border-ink-foreground/15 bg-ink-2/30 p-4 text-sm text-ink-muted">
        Seleccioná una desagregación para identificar el último dato sin mezclar universos.
      </div>
    );
  }
  if (summary.status === "no-period") return null;
  if (summary.status === "duplicate-period") {
    return (
      <div className="mb-5 rounded-xl border border-dashed border-amber-300/25 bg-amber-300/5 p-4 text-sm text-ink-muted">
        No se calcula un resumen: la serie contiene más de una observación para el mismo período ({formatEphPeriodLabel(summary.period)}).
      </div>
    );
  }
  if (summary.status === "latest-unavailable") {
    return (
      <div className="mb-5 rounded-xl border border-dashed border-ink-foreground/15 bg-ink-2/30 p-4 text-sm text-ink-muted">
        El último período ({formatEphPeriodLabel(summary.period)}) no contiene un valor numérico publicable. Se conserva la observación original en la tabla.
      </div>
    );
  }



  return (
    <section aria-label={`Resumen del indicador: ${valueLabel}`} className="mb-5">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="eyebrow text-lime">LECTURA RÁPIDA</p>
          <h4 className="mt-1 text-base font-semibold">Último dato publicado</h4>
        </div>
        {summary.provisional ? (
          <span className="rounded-full border border-amber-300/25 bg-amber-300/10 px-3 py-1 text-[11px] font-medium text-amber-200">
            Dato provisorio
          </span>
        ) : null}
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <article className="rounded-xl border border-lime/25 bg-lime/5 p-4">
          <p className="text-xs text-ink-muted">{valueLabel}</p>
          <p className="mt-2 font-display text-3xl font-semibold text-lime">{formatValue(summary.latestValue)}</p>
          <p className="mt-2 text-xs text-ink-muted">{formatEphPeriodLabel(summary.latestPeriod)}</p>
        </article>
        <article className="rounded-xl border border-ink-foreground/10 bg-ink-2/35 p-4">
          <p className="text-xs text-ink-muted">Período anterior</p>
          {summary.previousValue === null || summary.previousPeriod === null ? (
            <p className="mt-3 text-sm text-ink-muted">Sin dato comparable</p>
          ) : (
            <>
              <p className="mt-2 font-display text-3xl font-semibold">{formatValue(summary.previousValue)}</p>
              <p className="mt-2 text-xs text-ink-muted">{formatEphPeriodLabel(summary.previousPeriod)}</p>
            </>
          )}
        </article>
        <article className="rounded-xl border border-ink-foreground/10 bg-ink-2/35 p-4">
          <p className="text-xs text-ink-muted">Cambio absoluto respecto del período anterior</p>
          {summary.change === null ? (
            <p className="mt-3 text-sm text-ink-muted">No disponible</p>
          ) : (
            <>
              <p className="mt-2 font-display text-3xl font-semibold">{summary.change > 0 ? "+" : ""}{numberFormat.format(summary.change)}{changeSuffix}</p>
              <p className="mt-2 text-xs text-ink-muted">Entre períodos consecutivos</p>
            </>
          )}
        </article>
      </div>
      <p className="mt-3 text-xs leading-relaxed text-ink-muted">El signo indica la dirección del cambio, no si representa una mejora o un deterioro: eso depende del indicador.</p>
      {summary.note ? (
        <p className="mt-3 text-xs leading-relaxed text-ink-muted">
          Nota del INDEC: {summary.note}. La diferencia se calcula sobre los valores publicados y puede revisarse si el organismo actualiza el dato.
        </p>
      ) : null}
    </section>
  );
}
