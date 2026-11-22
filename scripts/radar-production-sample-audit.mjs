import { appendFileSync } from "node:fs";

const API_BASE = process.env.RADAR_API_BASE_URL ?? "https://datacraft-argentina-institucional.digitalperseo.workers.dev/api/radar";
const ORIGIN = process.env.RADAR_PRODUCTION_ORIGIN ?? "https://datacraft-argentina.lovable.app";
const LIMIT = 1000;
const PAUSE_MS = 350;
const MARKERS = new Set(["s", "*", "**", "e", "i", "u", "-", ".", "...", "///"]);

const services = [
  { id: "ipc", period: "periodo", required: ["periodo", "region", "tipo_de_indicador", "valor"], profile: ["tipo_de_indicador", "tipo_de_indicador_descripcion", "unidad_de_medida", "region", "clasificador", "nivel"], values: ["valor"], key: ["periodo", "region", "clasificador", "nivel", "codigo", "tipo_de_indicador"] },
  { id: "salarios", period: "periodo", required: ["periodo", "valor", "tipo_de_indicador"], profile: ["tipo_de_indicador", "tipo_de_indicador_descripcion", "indicador", "clasificador", "nivel"], values: ["valor"], key: ["periodo", "clasificador", "nivel", "codigo", "indicador", "tipo_de_indicador"] },
  { id: "emae", period: "periodo", required: ["periodo", "valor", "tipo_de_indicador_descripcion"], profile: ["tipo_de_indicador", "tipo_de_indicador_descripcion"], values: ["valor"], key: ["periodo", "tipo_de_indicador_descripcion"] },
  { id: "pobreza", period: "periodo", required: ["periodo", "area_geografica_nom", "tasa_pobreza_personas"], profile: ["area_geografica_nom", "area_geografica_cod"], values: ["tasa_pobreza_personas", "tasa_indigencia_personas", "tasa_pobreza_hogares", "tasa_indigencia_hogares"], key: ["periodo", "area_geografica_nom", "area_geografica_cod"] },
  { id: "mercado-laboral", period: "periodo", required: ["periodo", "area_geografica_nom", "tasa_de_actividad", "tasa_de_empleo", "tasa_de_desocupacion"], profile: ["area_geografica_nom", "area_geografica_cod"], values: ["tasa_de_actividad", "tasa_de_empleo", "tasa_de_desocupacion", "tasa_de_ocupacion_demandante", "tasa_de_subocupacion", "tasa_de_subocupacion_demandante", "tasa_de_subocupacion_no_demandante", "tasa_de_empleo_formal", "tasa_de_empleo_informal"], key: ["periodo", "area_geografica_nom", "area_geografica_cod"] },
  { id: "cba-cbt", period: "periodo", required: ["periodo", "region", "indicador", "tipo_de_indicador", "valor"], profile: ["region", "indicador", "tipo_de_indicador", "tipo_de_indicador_descripcion", "unidad_de_medida", "clasificador", "nivel"], values: ["valor"], key: ["periodo", "region", "clasificador", "nivel", "codigo", "indicador", "tipo_de_indicador"] },
  { id: "canasta-crianza", period: "Periodo", required: ["Periodo", "tot_men1", "bys_men1", "cuid_men1"], profile: [], values: ["tot_men1", "bys_men1", "cuid_men1", "tot_1a3", "bys_1a3", "cuid_1a3", "tot_4a5", "bys_4a5", "cuid_4a5", "tot_6a12", "bys_6a12", "cuid_6a12"], key: ["Periodo"] },
  { id: "exportaciones", period: "Periodo", required: ["Periodo", "valor_FOB", "Peso_Neto", "rubro_cod", "subrubro_cod", "pais_cod"], profile: ["rubro_cod", "subrubro_cod", "pais_cod"], values: ["valor_FOB", "Peso_Neto"], key: ["Periodo", "rubro_cod", "subrubro_cod", "pais_cod"] },
  { id: "importaciones", period: "Periodo", required: ["Periodo", "valor_CIF", "uso_economico_cod", "gce_cod", "pais_cod"], profile: ["uso_economico_cod", "gce_cod", "pais_cod"], values: ["valor_CIF"], key: ["Periodo", "uso_economico_cod", "gce_cod", "pais_cod"] },
  { id: "poblacion-departamento", period: "fecha", required: ["fecha", "poblacion", "jurisdiccion_cod", "departamento_cod", "sexo_cod"], profile: ["jurisdiccion_nom", "jurisdiccion_cod", "departamento_nom", "departamento_cod", "sexo_cod", "rmba"], values: ["poblacion"], key: ["fecha", "jurisdiccion_cod", "departamento_cod", "sexo_cod"] },
  { id: "poblacion-jurisdiccion", period: "fecha", required: ["fecha", "poblacion", "jurisdiccion_cod", "sexo_cod", "edad_cod"], profile: ["jurisdiccion_nom", "jurisdiccion_cod", "sexo_cod", "edad_cod", "edad_nom"], values: ["poblacion"], key: ["fecha", "jurisdiccion_cod", "sexo_cod", "edad_cod"] },
  { id: "poblacion-nacional", period: "fecha", required: ["fecha", "poblacion", "edad", "sexo_cod"], profile: ["edad", "sexo_cod", "sexo_nom"], values: ["poblacion"], key: ["fecha", "edad", "sexo_cod"] },
  { id: "ipi-manufacturero", period: "periodo", required: ["periodo", "valor", "serie", "tipo_de_indicador", "unidad_de_medida", "codigo_CLaNAE_2004"], profile: ["indicador", "cuadro_web", "codigo_CLaNAE_2004", "descripcion", "serie", "tipo_de_indicador", "unidad_de_medida"], values: ["valor"], key: ["periodo", "cuadro_web", "codigo_CLaNAE_2004", "descripcion", "serie", "tipo_de_indicador"] },
  { id: "sipm", period: "periodo", required: ["periodo", "valor", "indicador", "tipo_de_indicador", "clasificador", "nivel"], profile: ["indicador", "clasificador", "nivel", "codigo_apertura", "tipo_de_indicador", "tipo_de_indicador_descripcion", "region", "unidad_de_medida"], values: ["valor"], key: ["periodo", "indicador", "clasificador", "nivel", "codigo_apertura", "tipo_de_indicador"] },
  { id: "costo-construccion", period: "periodo", required: ["periodo", "valor", "indicador", "tipo_de_indicador", "codigo_CPC_1"], profile: ["indicador", "codigo_CPC_1", "clasificador", "nivel", "codigo_apertura", "tipo_de_indicador", "tipo_de_indicador_descripcion", "region", "unidad_de_medida"], values: ["valor"], key: ["periodo", "indicador", "codigo_CPC_1", "codigo_apertura", "tipo_de_indicador"] },
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const results = [];
const failures = [];

function rangeTotal(contentRange) {
  if (typeof contentRange !== "string") return null;
  const match = contentRange.match(/\/(\d+)$/);
  return match ? Number(match[1]) : null;
}

function distinctValues(rows, field, max = 10) {
  const values = new Set();
  let missing = 0;
  for (const row of rows) {
    const value = row[field];
    if (value === null || value === undefined || String(value).trim() === "") missing++;
    else values.add(String(value));
  }
  return { count: values.size, values: [...values].slice(0, max), missing, truncated: values.size > max };
}

function profileNumeric(rows, field) {
  let numeric = 0;
  let nulls = 0;
  let markers = 0;
  let nonNumeric = 0;
  for (const row of rows) {
    const value = row[field];
    if (value === null || value === undefined || value === "") {
      nulls++;
    } else if (typeof value === "string" && MARKERS.has(value.trim())) {
      markers++;
    } else if (Number.isFinite(typeof value === "number" ? value : Number(String(value).replace(",", ".")))) {
      numeric++;
    } else {
      nonNumeric++;
    }
  }
  return { numeric, nulls, markers, nonNumeric };
}

function duplicateCount(rows, fields) {
  const seen = new Set();
  let duplicates = 0;
  let skipped = 0;
  for (const row of rows) {
    if (fields.some((field) => row[field] === null || row[field] === undefined || row[field] === "")) {
      skipped++;
      continue;
    }
    const key = fields.map((field) => String(row[field])).join("|");
    if (seen.has(key)) duplicates++;
    else seen.add(key);
  }
  return { duplicates, skipped, checked: rows.length - skipped };
}

async function query(id) {
  const url = new URL(`${API_BASE}/${id}`);
  url.searchParams.set("limit", String(LIMIT));
  const response = await fetch(url, {
    headers: { Accept: "application/json", Origin },
    signal: AbortSignal.timeout(25_000),
  });
  let payload;
  try {
    payload = await response.json();
  } catch {
    throw new Error(`HTTP ${response.status}: respuesta no JSON.`);
  }
  if (!response.ok || ![200, 206].includes(response.status)) {
    throw new Error(`HTTP ${response.status}: ${payload?.error ?? "consulta no satisfactoria"}`);
  }
  if (response.headers.get("access-control-allow-origin") !== ORIGIN) {
    throw new Error("CORS no autoriza el origen institucional.");
  }
  if (payload?.indicator !== id || payload?.source !== "INDEC" || !Array.isArray(payload?.data)) {
    throw new Error("Sobre de respuesta o estructura de datos inválida.");
  }
  if (payload.data.length === 0) throw new Error("El servicio no devolvió observaciones.");
  return {
    payload,
    rows: payload.data,
    total: rangeTotal(payload.contentRange ?? response.headers.get("content-range")),
    contentRange: payload.contentRange ?? response.headers.get("content-range"),
  };
}

const lines = [
  "# Auditoría de muestra — Radar Production",
  "",
  `Fecha: ${new Date().toISOString()}`,
  `Muestra solicitada por servicio: hasta ${LIMIT.toLocaleString("es-AR")} registros.`,
  "",
  "| Servicio | Muestra | Total API | Períodos | Métricas / dimensiones observadas | Nulos | Marcas | No numéricos | Duplicados clave |",
  "|---|---:|---:|---:|---|---:|---:|---:|---:|",
];

console.log(`Radar Production sample audit · ${new Date().toISOString()}`);

for (const service of services) {
  try {
    const { payload, rows, total, contentRange } = await query(service.id);
    const missingRequired = service.required.filter((field) => rows.some((row) => !Object.prototype.hasOwnProperty.call(row, field)));
    const periods = [...new Set(rows.map((row) => row[service.period]).filter((value) => value !== null && value !== undefined).map(String))].sort();
    const profile = Object.fromEntries(service.profile.map((field) => [field, distinctValues(rows, field)]));
    const numericProfile = Object.fromEntries(service.values.map((field) => [field, profileNumeric(rows, field)]));
    const duplicateProfile = duplicateCount(rows, service.key);
    const nullCount = Object.values(numericProfile).reduce((sum, item) => sum + item.nulls, 0);
    const markerCount = Object.values(numericProfile).reduce((sum, item) => sum + item.markers, 0);
    const nonNumericCount = Object.values(numericProfile).reduce((sum, item) => sum + item.nonNumeric, 0);
    const metrics = service.profile
      .filter((field) => /tipo_de_indicador|serie|indicador|unidad_de_medida/.test(field))
      .map((field) => `${field}=${profile[field].count}`)
      .join(", ") || "sin dimensión categórica declarada";
    const duplicateLabel = duplicateProfile.duplicates === 0 ? "0" : `REVISAR ${duplicateProfile.duplicates}`;
    const periodRange = periods.length > 0 ? `${periods[0]}–${periods.at(-1)} (${periods.length})` : "sin período";
    lines.push(`| ${service.id} | ${rows.length} | ${total ?? "s/d"} | ${periodRange} | ${metrics} | ${nullCount} | ${markerCount} | ${nonNumericCount} | ${duplicateLabel} |`);
    lines.push("");
    lines.push(`### ${service.id}`);
    lines.push(`- Content-Range: ${contentRange ?? "no informado"}`);
    lines.push(`- Campos obligatorios ausentes: ${missingRequired.length ? missingRequired.join(", ") : "ninguno"}`);
    lines.push(`- Clave compuesta: ${service.key.join(" + ")}; filas comparables: ${duplicateProfile.checked}; filas omitidas por clave incompleta: ${duplicateProfile.skipped}`);
    lines.push(`- Perfil categórico: ${JSON.stringify(profile)}`);
    lines.push(`- Perfil numérico: ${JSON.stringify(numericProfile)}`);
    console.log(`PASS ${service.id}: ${rows.length}/${total ?? "?"} registros de muestra; períodos ${periodRange}; duplicados clave ${duplicateProfile.duplicates}; Content-Range ${contentRange ?? "no informado"}`);
    if (missingRequired.length > 0) failures.push({ indicator: service.id, error: `Campos ausentes: ${missingRequired.join(", ")}` });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    failures.push({ indicator: service.id, error: message });
    console.error(`FAIL ${service.id}: ${message}`);
    lines.push(`| ${service.id} | — | — | — | ERROR | — | — | — | — |`);
    lines.push(`### ${service.id}`);
    lines.push(`- Error: ${message}`);
  }
  await sleep(PAUSE_MS);
}

lines.push("");
lines.push(`Resultado: ${services.length - failures.length}/${services.length} servicios con perfil de muestra disponible.`);
if (failures.length > 0) lines.push(`Errores: ${JSON.stringify(failures)}`);
console.log(lines.slice(0, 8).join("\n"));
console.log(`Resultado: ${services.length - failures.length}/${services.length} servicios perfilados.`);

if (process.env.GITHUB_STEP_SUMMARY) {
  appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${lines.join("\n")}\n`);
}
if (failures.length > 0) process.exitCode = 1;
