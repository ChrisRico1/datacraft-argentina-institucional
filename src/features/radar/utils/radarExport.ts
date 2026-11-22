import Papa from "papaparse";

export function createRadarCsv(rows: Record<string, unknown>[]): string {
  if (rows.length === 0) return "";

  const normalizedRows = rows.map((row) =>
    Object.fromEntries(
      Object.entries(row).map(([key, value]) => [
        key,
        value !== null && typeof value === "object" ? JSON.stringify(value) : value,
      ]),
    ),
  );

  return `\\uFEFF${Papa.unparse(normalizedRows, { header: true, skipEmptyLines: true })}`;
}
