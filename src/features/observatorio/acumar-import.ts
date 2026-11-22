import Papa from "papaparse";

export type AcumarService = "Agua potable" | "Cloacal" | "Desconocido";

export interface AcumarImportRow {
  raw: Record<string, string>;
  sourceWorkId: string | null;
  provinceCode: string | null;
  provinceName: string | null;
  departmentCode: string | null;
  departmentName: string | null;
  service: AcumarService;
  serviceRaw: string | null;
  workName: string | null;
  workType: string | null;
  beneficiaries: number | null;
  fundingResponsible: string | null;
  executionResponsible: string | null;
  executionStatus: string | null;
  subStatus: string | null;
  contractor: string | null;
  deadlineDays: number | null;
  progressPercent: number | null;
  startDate: string | null;
  inspector: string | null;
  inspectionDate: string | null;
  report: string | null;
}

function repairHeaderEncoding(value: string): string {
  return value
    .replace(/Ã¡/g, "á")
    .replace(/Ã©/g, "é")
    .replace(/Ã­/g, "í")
    .replace(/Ã³/g, "ó")
    .replace(/Ãº/g, "ú")
    .replace(/Ã±/g, "ñ")
    .replace(/Ã‘/g, "Ñ")
    .replace(/Ã“/g, "Ó");
}

export function normalizeAcumarHeader(value: string): string {
  const repaired = repairHeaderEncoding(value.trim());
  const normalized = repaired
    .toLocaleLowerCase("es-AR")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

  // The published files contain inconsistent spacing and mojibake in this header.
  if (normalized.startsWith("fecha_de_inspecci")) return "fecha_de_inspeccion";
  return normalized;
}

function textValue(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed === "" || trimmed === "-" ? null : trimmed;
}

/**
 * ACUMAR exports use integer values with optional dot thousands separators.
 * Ambiguous decimal/grouping formats are intentionally left null.
 */
export function parseAcumarInteger(value: unknown): number | null {
  const text = textValue(value);
  if (!text) return null;
  if (/^\d+$/.test(text)) return Number(text);
  if (/^\d{1,3}(?:\.\d{3})+$/.test(text)) return Number(text.replace(/\./g, ""));
  return null;
}

export function parseAcumarPercent(value: unknown): number | null {
  const text = textValue(value);
  if (!text) return null;
  const match = /^(\d{1,3})(?:,(\d+))?%$/.exec(text);
  if (!match) return null;
  const result = Number(match[1] + (match[2] ? `.${match[2]}` : ""));
  return result >= 0 && result <= 100 ? result : null;
}

/** The supplied ACUMAR samples use M/D/YYYY. Invalid or ambiguous values stay null. */
export function parseAcumarDate(value: unknown): string | null {
  const text = textValue(value);
  if (!text) return null;
  const match = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(text);
  if (!match) return null;
  const month = Number(match[1]);
  const day = Number(match[2]);
  const year = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) return null;
  return `${year.toString().padStart(4, "0")}-${match[1].padStart(2, "0")}-${match[2].padStart(2, "0")}`;
}

function mapService(value: string | null): AcumarService {
  const normalized = value?.trim().toLocaleUpperCase("es-AR");
  if (normalized === "AGUA") return "Agua potable";
  if (normalized === "CLOACA" || normalized === "CLOACAS") return "Cloacal";
  return "Desconocido";
}

function read(record: Record<string, string>, key: string): string | null {
  return textValue(record[key]);
}

export function parseAcumarCsv(csv: string): AcumarImportRow[] {
  const result = Papa.parse<Record<string, string>>(csv, {
    header: true,
    skipEmptyLines: "greedy",
    dynamicTyping: false,
    transformHeader: normalizeAcumarHeader,
  });

  if (result.errors.length > 0) {
    throw new Error(`No se pudo interpretar el CSV de ACUMAR: ${result.errors[0]?.message ?? "error de formato"}`);
  }

  const required = [
    "obra_id", "provincia_id", "provincia_nombre", "departamento_id",
    "departamento_nombre", "tipo_fluido", "obra_nombre", "obra_tipo",
    "cantidad_beneficiarios", "responsable_financiamiento",
    "responsable_ejecucion", "obra_estado", "obra_sub_estado",
    "obra_contratista", "obra_plazo", "obra_porcentaje_avance",
    "obra_fecha_inicio",
  ];
  const fields = result.meta.fields ?? [];
  const missing = required.filter((field) => !fields.includes(field));
  if (missing.length) {
    throw new Error(`Faltan columnas obligatorias de ACUMAR: ${missing.join(", ")}`);
  }

  return result.data.map((record) => {
    const serviceRaw = read(record, "tipo_fluido");
    return {
      raw: record,
      sourceWorkId: read(record, "obra_id"),
      provinceCode: read(record, "provincia_id"),
      provinceName: read(record, "provincia_nombre"),
      departmentCode: read(record, "departamento_id"),
      departmentName: read(record, "departamento_nombre"),
      service: mapService(serviceRaw),
      serviceRaw,
      workName: read(record, "obra_nombre"),
      workType: read(record, "obra_tipo"),
      beneficiaries: parseAcumarInteger(record.cantidad_beneficiarios),
      fundingResponsible: read(record, "responsable_financiamiento"),
      executionResponsible: read(record, "responsable_ejecucion"),
      executionStatus: read(record, "obra_estado"),
      subStatus: read(record, "obra_sub_estado"),
      contractor: read(record, "obra_contratista"),
      deadlineDays: parseAcumarInteger(record.obra_plazo),
      progressPercent: parseAcumarPercent(record.obra_porcentaje_avance),
      startDate: parseAcumarDate(record.obra_fecha_inicio),
      inspector: read(record, "inspector"),
      inspectionDate: parseAcumarDate(record.fecha_de_inspeccion),
      report: read(record, "informe"),
    };
  });
}
