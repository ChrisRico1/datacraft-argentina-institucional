export type ChildcareMetricOption = {
  valueKey: string;
  label: string;
};

export const childcareMetricOptions: ChildcareMetricOption[] = [
  { valueKey: "tot_men1", label: "Total · menores de 1 año" },
  { valueKey: "bys_men1", label: "Bienes y servicios · menores de 1 año" },
  { valueKey: "cuid_men1", label: "Tiempo de cuidado · menores de 1 año" },
  { valueKey: "tot_1a3", label: "Total · de 1 a 3 años" },
  { valueKey: "bys_1a3", label: "Bienes y servicios · de 1 a 3 años" },
  { valueKey: "cuid_1a3", label: "Tiempo de cuidado · de 1 a 3 años" },
  { valueKey: "tot_4a5", label: "Total · de 4 a 5 años" },
  { valueKey: "bys_4a5", label: "Bienes y servicios · de 4 a 5 años" },
  { valueKey: "cuid_4a5", label: "Tiempo de cuidado · de 4 a 5 años" },
  { valueKey: "tot_6a12", label: "Total · de 6 a 12 años" },
  { valueKey: "bys_6a12", label: "Bienes y servicios · de 6 a 12 años" },
  { valueKey: "cuid_6a12", label: "Tiempo de cuidado · de 6 a 12 años" },
];

export const childcareAgeGroups = [
  { key: "men1", label: "Menor de 1 año", goodsKey: "bys_men1", careKey: "cuid_men1", totalKey: "tot_men1" },
  { key: "1a3", label: "1 a 3 años", goodsKey: "bys_1a3", careKey: "cuid_1a3", totalKey: "tot_1a3" },
  { key: "4a5", label: "4 a 5 años", goodsKey: "bys_4a5", careKey: "cuid_4a5", totalKey: "tot_4a5" },
  { key: "6a12", label: "6 a 12 años", goodsKey: "bys_6a12", careKey: "cuid_6a12", totalKey: "tot_6a12" },
] as const;

export type ChildcareBreakdownRow = {
  age: string;
  goods: number;
  care: number;
  total: number;
};

export type ChildcareBreakdownResult =
  | { status: "ready"; period: string; rows: ChildcareBreakdownRow[] }
  | { status: "no-data" }
  | { status: "duplicate-period"; period: string }
  | { status: "incomplete"; period: string; missing: string[] };

function parsePublishedAmount(value: unknown): number | null {
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

export function buildChildcareCostBreakdown(
  rows: Record<string, unknown>[],
): ChildcareBreakdownResult {
  const periods = [...new Set(
    rows
      .map((row) => row["Periodo"] ?? row["periodo"])
      .filter((value) => value !== null && value !== undefined && String(value).trim() !== "")
      .map(String),
  )].sort((a, b) => a.localeCompare(b, "es", { numeric: true }));

  const period = periods.at(-1);
  if (!period) return { status: "no-data" };

  const latestRows = rows.filter((row) => String(row["Periodo"] ?? row["periodo"] ?? "") === period);
  if (latestRows.length !== 1) return { status: "duplicate-period", period };

  const latest = latestRows[0]!;
  const missing: string[] = [];
  const resultRows = childcareAgeGroups.map((group) => {
    const goods = parsePublishedAmount(latest[group.goodsKey]);
    const care = parsePublishedAmount(latest[group.careKey]);
    const total = parsePublishedAmount(latest[group.totalKey]);
    if (goods === null) missing.push(group.goodsKey);
    if (care === null) missing.push(group.careKey);
    if (total === null) missing.push(group.totalKey);
    return goods === null || care === null || total === null
      ? null
      : { age: group.label, goods, care, total };
  });

  if (missing.length > 0) return { status: "incomplete", period, missing };
  return {
    status: "ready",
    period,
    rows: resultRows as ChildcareBreakdownRow[],
  };
}
