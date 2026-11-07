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

export function formatEphPeriodLabel(value: string): string {
  const month = /^(\d{4})(0[1-9]|1[0-2])$/.exec(value);
  if (month) {
    const [, year, monthNumber] = month;
    return new Intl.DateTimeFormat("es-AR", { month: "short", year: "numeric" })
      .format(new Date(Number(year), Number(monthNumber) - 1, 1));
  }
  const match = /^(\d{4})([1-4])([ST])$/.exec(value);
  if (!match) return value;
  const [, year, period, kind] = match;
  return kind === "S"
    ? `${period === "1" ? "1.er" : "2.º"} semestre ${year}`
    : `${period}.º trimestre ${year}`;
}

function areConsecutivePeriods(previous: string, latest: string): boolean {
  const previousMonth = /^(\d{4})(0[1-9]|1[0-2])$/.exec(previous);
  const latestMonth = /^(\d{4})(0[1-9]|1[0-2])$/.exec(latest);
  if (previousMonth && latestMonth) {
    const previousIndex = Number(previousMonth[1]) * 12 + Number(previousMonth[2]);
    const latestIndex = Number(latestMonth[1]) * 12 + Number(latestMonth[2]);
    return latestIndex - previousIndex === 1;
  }
  const previousMatch = /^(\d{4})([1-4])([ST])$/.exec(previous);
  const latestMatch = /^(\d{4})([1-4])([ST])$/.exec(latest);
  if (!previousMatch || !latestMatch || previousMatch[3] !== latestMatch[3]) return false;
  const previousIndex = Number(previousMatch[1]) * (previousMatch[3] === "S" ? 2 : 4) + Number(previousMatch[2]);
  const latestIndex = Number(latestMatch[1]) * (latestMatch[3] === "S" ? 2 : 4) + Number(latestMatch[2]);
  return latestIndex - previousIndex === 1;
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
  const duplicate = observations.find((item, index) => index > 0 && item.period === observations[index - 1]!.period);
  if (duplicate) return { status: "duplicate-period", period: duplicate.period };
  if (latest.value === null) {
    return { status: "latest-unavailable", period: latest.period, note: latest.note };
  }

  const previous = observations.length > 1 ? observations[observations.length - 2]! : null;
  const consecutive = previous ? areConsecutivePeriods(previous.period, latest.period) : false;
  const previousValue = consecutive ? previous?.value ?? null : null;
  const note = latest.note;
  return {
    status: "ready",
    latestPeriod: latest.period,
    latestValue: latest.value,
    previousPeriod: consecutive ? previous?.period ?? null : null,
    previousValue,
    change: previousValue === null ? null : Number((latest.value - previousValue).toFixed(2)),
    note,
    provisional: /provisorio|preliminar|estimado/i.test(note),
  };
}
