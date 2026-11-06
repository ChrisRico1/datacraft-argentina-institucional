export type LatestMetricSummary =
  | { status: "select-context"; contextCount: number }
  | { status: "no-period" }
  | { status: "duplicate-period"; period: string }
  | { status: "latest-unavailable"; period: string; note: string }
  | {
      status: "ready";
      latestPeriod: string;
      latestValue: number;
      previousPeriod: string | null;
      previousValue: number | null;
      change: number | null;
      note: string;
      provisional: boolean;
    };

function parseNumericValue(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value !== "string") return null;
  const normalized = value.trim();
  const localized = /^-?(?:\\d+|\\d{1,3}(?:\\.\\d{3})+)(?:,\\d+)?$/.test(normalized);
  const decimal = /^-?\\d+(?:\\.\\d+)?$/.test(normalized);
  if (!localized && !decimal) return null;
  const parsed = normalized.includes(",")
    ? Number(normalized.replace(/\\./g, "").replace(",", "."))
    : /^-?\\d{1,3}(?:\\.\\d{3})+$/.test(normalized)
      ? Number(normalized.replace(/\\./g, ""))
      : Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

export function formatEphPeriodLabel(value: string): string {
  const match = /^(\\d{4})([1-4])([ST])$/.exec(value);
  if (!match) return value;
  const [, year, period, kind] = match;
  return kind === "S"
    ? `${period === "1" ? "1.er" : "2.º"} semestre ${year}`
    : `${period}.º trimestre ${year}`;
}

export function buildLatestMetricSummary(
  rows: Record<string, unknown>[],
  periodKey: string,
  valueKey: string,
  contextKey?: string,
  contextValue = "",
): LatestMetricSummary {
  const contexts = contextKey
    ? [...new Set(rows
        .map((row) => row[contextKey])
        .filter((value) => value !== null && value !== undefined && String(value).trim() !== "")
        .map(String))]
    : [];
  if (contexts.length > 1 && !contextValue) {
    return { status: "select-context", contextCount: contexts.length };
  }

  const selectedRows = contextKey && contextValue
    ? rows.filter((row) => String(row[contextKey]) === contextValue)
    : rows;
  const observations = selectedRows
    .map((row) => {
      const period = row[periodKey] ?? row.periodo ?? row.Periodo ?? row.fecha ?? row.anio;
      if (period === null || period === undefined || String(period).trim() === "") return null;
      return {
        period: String(period),
        value: parseNumericValue(row[valueKey]),
        note: row.observaciones == null ? "" : String(row.observaciones),
      };
    })
    .filter((item): item is { period: string; value: number | null; note: string } => item !== null)
    .sort((a, b) => a.period.localeCompare(b.period, "es", { numeric: true }));

  if (observations.length === 0) return { status: "no-period" };

  const latest = observations[observations.length - 1]!;
  const duplicates = observations.filter((item) => item.period === latest.period);
  if (duplicates.length > 1) return { status: "duplicate-period", period: latest.period };
  if (latest.value === null) {
    return { status: "latest-unavailable", period: latest.period, note: latest.note };
  }

  const previous = observations.length > 1 ? observations[observations.length - 2]! : null;
  const previousValue = previous?.value ?? null;
  const note = latest.note;
  return {
    status: "ready",
    latestPeriod: latest.period,
    latestValue: latest.value,
    previousPeriod: previous?.period ?? null,
    previousValue,
    change: previousValue === null ? null : latest.value - previousValue,
    note,
    provisional: /provisorio|preliminar|estimado/i.test(note),
  };
}
