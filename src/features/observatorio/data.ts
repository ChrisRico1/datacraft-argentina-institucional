import Papa from "papaparse";
import { z } from "zod";
import worksJson from "./data/works.json";
import metricsJson from "./data/metrics.json";
import { municipalReferences, sources } from "./catalog";
import type { Filters, Work, Metric } from "./types";

const nullableNumber = z.preprocess(
  (value) =>
    value === "" || value === undefined || value === null
      ? null
      : typeof value === "string"
        ? Number(value)
        : value,
  z.number().finite().nullable(),
);
const validDate = z.preprocess((value) => value === "" || value === undefined ? null : value, z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine((value) => { const date = new Date(`${value}T00:00:00Z`); return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value; }, "Fecha de corte inválida").nullable());
export const workSchema = z
  .object({
    id: z.string().min(1),
    municipality: z.string().refine((value) => municipalReferences.some((m) => m.name === value)),
    jurisdiction: z.enum(["PBA", "CABA"]),
    sector: z.preprocess(
      (value) => (value === "" ? null : value),
      z.enum(["Alta", "Media", "Baja"]).nullable(),
    ),
    name: z.string().min(1),
    service: z.enum(["Cloacal", "Agua potable"]),
    infrastructure: z.string().min(1),
    status: z.preprocess((value) => (value === "" ? null : value), z.string().nullable()),
    progress: nullableNumber.refine((value) => value === null || (value >= 0 && value <= 100)),
    beneficiaries: nullableNumber.refine(
      (value) => value === null || (value >= 0 && Number.isInteger(value)),
    ),
    cutoff: validDate,
    sourceId: z.string().refine((value) => sources.some((source) => source.id === value)),
    territorialScope: z.enum(["Cuenca", "Partido completo", "Jurisdicción informada"]),
    sourceWorkId: z.string().nullable().optional(),
  })
  .refine(
    (work) => (work.municipality === "CABA") === (work.jurisdiction === "CABA"),
    "Jurisdicción incompatible",
  );
const metricSchema = z.object({
  id: z.string(),
  label: z.string(),
  value: z.number().nullable(),
  unit: z.string(),
  year: z.string(),
  scope: z.string(),
  sourceId: z.string().refine((value) => sources.some((source) => source.id === value)),
});
export const works: Work[] = z.array(workSchema).parse(worksJson);
export const metrics: Metric[] = z.array(metricSchema).parse(metricsJson);
export const emptyFilters: Filters = {
  query: "",
  municipality: "",
  sector: "",
  infrastructure: "",
};
export function filterWorks(records: Work[], filters: Filters): Work[] {
  const query = filters.query.trim().toLocaleLowerCase("es-AR");
  return records.filter(
    (work) =>
      work.service === "Cloacal" &&
      (!filters.municipality || work.municipality === filters.municipality) &&
      (!filters.sector || work.sector === filters.sector) &&
      (!filters.infrastructure || work.infrastructure === filters.infrastructure) &&
      (!query ||
        `${work.name} ${work.municipality} ${work.status ?? ""} ${work.infrastructure} ${work.id} ${work.sourceWorkId ?? ""}`
          .toLocaleLowerCase("es-AR")
          .includes(query)),
  );
}
export function parseWorks(text: string, format: "csv" | "json"): Work[] {
  let raw: unknown;
  if (format === "json") raw = JSON.parse(text);
  else {
    const result = Papa.parse(text, { header: true, skipEmptyLines: "greedy" });
    if (result.errors.length) throw new Error("No pudimos interpretar el CSV.");
    raw = result.data;
  }
  const parsed = z.array(workSchema).safeParse(raw);
  if (!parsed.success)
    throw new Error(
      "El archivo no cumple el esquema de obras: revisá fuentes, fechas, servicios y campos obligatorios.",
    );
  const ids = parsed.data.map((work) => work.id);
  if (new Set(ids).size !== ids.length) throw new Error("Hay identificadores de obras duplicados.");
  return parsed.data;
}
// Browser/event-handler entry point for a future public CSV/JSON endpoint.
export async function loadWorks(url: string, format: "csv" | "json"): Promise<Work[]> {
  const response = await fetch(url);
  if (!response.ok) throw new Error("No pudimos obtener el inventario.");
  return parseWorks(await response.text(), format);
}
