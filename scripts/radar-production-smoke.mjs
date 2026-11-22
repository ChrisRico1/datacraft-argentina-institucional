const API_BASE = process.env.RADAR_API_BASE_URL ?? "https://datacraft-argentina-institucional.digitalperseo.workers.dev/api/radar";
const ORIGIN = process.env.RADAR_PRODUCTION_ORIGIN ?? "https://datacraft-argentina.lovable.app";
const PAUSE_MS = 350;

const services = [
  { id: "ipc", period: "periodo", required: ["valor", "tipo_de_indicador", "region"], filters: { region: "region", indicatorType: "tipo_de_indicador", classification: "clasificador", level: "nivel", openingCode: "codigo", category: "descripcion" } },
  { id: "salarios", period: "periodo", required: ["valor", "tipo_de_indicador", "clasificador"], filters: { indicatorType: "tipo_de_indicador" }, dimensions: ["clasificador", "nivel", "codigo", "indicador"] },
  { id: "emae", period: "periodo", required: ["valor", "tipo_de_indicador_descripcion"], filters: { indicatorType: "tipo_de_indicador" } },
  { id: "pobreza", period: "periodo", required: ["tasa_pobreza_personas", "tasa_indigencia_personas", "tasa_pobreza_hogares", "tasa_indigencia_hogares"], filters: { region: "area_geografica_nom" } },
  { id: "mercado-laboral", period: "periodo", required: ["tasa_de_actividad", "tasa_de_empleo", "tasa_de_desocupacion"], filters: { region: "area_geografica_nom" } },
  { id: "cba-cbt", period: "periodo", required: ["valor", "tipo_de_indicador", "region"], filters: { region: "region", indicatorType: "tipo_de_indicador" }, dimensions: ["clasificador", "nivel", "codigo", "indicador"] },
  { id: "canasta-crianza", period: "Periodo", required: ["bys_men1", "cuid_men1", "tot_men1"], seriesFields: ["tot_men1","bys_men1","cuid_men1","tot_1a3","bys_1a3","cuid_1a3","tot_4a5","bys_4a5","cuid_4a5","tot_6a12","bys_6a12","cuid_6a12"] },
  { id: "exportaciones", period: "Periodo", required: ["valor_FOB", "Peso_Neto", "rubro_cod", "subrubro_cod", "pais_cod"], dimensions: ["rubro_cod", "subrubro_cod", "pais_cod"] },
  { id: "importaciones", period: "Periodo", required: ["valor_CIF", "uso_economico_cod", "gce_cod", "pais_cod"], dimensions: ["uso_economico_cod", "gce_cod", "pais_cod"] },
  { id: "poblacion-departamento", period: "fecha", required: ["poblacion", "jurisdiccion_cod", "departamento_cod", "sexo_cod"], dimensions: ["jurisdiccion_nom", "jurisdiccion_cod", "departamento_cod", "sexo_cod", "rmba"] },
  { id: "poblacion-jurisdiccion", period: "fecha", required: ["poblacion", "jurisdiccion_cod", "sexo_cod", "edad_cod"], dimensions: ["jurisdiccion_nom", "jurisdiccion_cod", "sexo_cod", "edad_cod"] },
  { id: "poblacion-nacional", period: "fecha", required: ["poblacion", "edad", "sexo_cod"], dimensions: ["edad", "sexo_cod"] },
  { id: "ipi-manufacturero", period: "periodo", required: ["valor", "serie", "tipo_de_indicador", "unidad_de_medida", "codigo_CLaNAE_2004"], filters: { indicator: "indicador", series: "serie", indicatorType: "tipo_de_indicador" }, dimensions: ["cuadro_web", "codigo_CLaNAE_2004", "unidad_de_medida"] },
  { id: "sipm", period: "periodo", required: ["valor", "indicador", "tipo_de_indicador", "clasificador", "nivel"], filters: { region: "region", indicator: "indicador", classification: "clasificador", level: "nivel", openingCode: "codigo_apertura", metric: "tipo_de_indicador" } },
  { id: "costo-construccion", period: "periodo", required: ["valor", "indicador", "tipo_de_indicador", "codigo_CPC_1"], filters: { region: "region", indicator: "indicador", classification: "clasificador", level: "nivel", openingCode: "codigo_apertura", metric: "tipo_de_indicador" }, dimensions: ["codigo_CPC_1"] },
];

const metricCases = [
  { id: "ipc", param: "metric", field: "tipo_de_indicador", values: ["Indice", "v_m", "v_ia", "v_acum", "Incidencia_m", "Incidencia_ia", "Incidencia_acum"], extra: { region: "GBA" } },
  { id: "salarios", param: "metric", field: "tipo_de_indicador", values: ["Indice", "v_m", "v_ia", "v_acum"] },
  { id: "emae", param: "metric", field: "tipo_de_indicador_descripcion", values: ["Var % interanual serie original", "Var % mensual serie desestacionalizada", "Var % mensual serie tendencia-ciclo", "Índice serie desestacionalizada", "Índice serie original", "Índice serie tendencia-ciclo"] },
  { id: "cba-cbt", param: "indicatorType", field: "tipo_de_indicador", values: ["CBA", "CBT", "ICE", "Hogar 1", "Hogar 2", "Hogar 3", "v_m", "v_ia"], extra: { region: "GBA" } },
  { id: "sipm", param: "metric", field: "tipo_de_indicador", values: ["Indice", "incidencia", "v_acum", "v_ia", "v_m"], extra: { indicator: "IPIB", region: "Total del país" } },
  { id: "costo-construccion", param: "metric", field: "tipo_de_indicador", values: ["Indice", "incidencia", "v_acum", "v_ia", "v_m"], extra: { indicator: "ICC", region: "GBA" } },
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const failures = [];

async function queryService(id, params) {
  const url = new URL(`${API_BASE}/${id}`);
  for (const [key, value] of params.entries()) url.searchParams.set(key, value);
  const response = await fetch(url, {
    headers: { Accept: "application/json", Origin: ORIGIN },
    signal: AbortSignal.timeout(25_000),
  });
  let payload;
  try {
    payload = await response.json();
  } catch {
    throw new Error(`HTTP ${response.status}: la respuesta no contiene JSON válido.`);
  }
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${payload?.error ?? "respuesta no satisfactoria"}`);
  }
  if (![200, 206].includes(response.status)) {
    throw new Error(`Estado HTTP inesperado: ${response.status}.`);
  }
  if (response.headers.get("access-control-allow-origin") !== ORIGIN) {
    throw new Error("La respuesta no autoriza el origen de producción mediante CORS.");
  }
  if (!Array.isArray(payload?.data) || payload.data.length === 0) {
    throw new Error("La consulta no devolvió observaciones.");
  }
  if (payload.indicator !== id || payload.source !== "INDEC" || typeof payload.fetchedAt !== "string") {
    throw new Error("El sobre de respuesta no coincide con el contrato esperado.");
  }
  const contentRange = response.headers.get("content-range") ?? payload.contentRange ?? null;
  return { payload, contentRange, status: response.status };
}

function buildFilterParams(service, row, periodValue) {
  const params = new URLSearchParams({ limit: "1", period: String(periodValue) });
  for (const [queryKey, field] of Object.entries(service.filters ?? {})) {
    const value = row[field];
    if (value !== null && value !== undefined && String(value).trim() !== "") {
      params.set(queryKey, String(value));
    }
  }
  const dimensions = {};
  for (const field of service.dimensions ?? []) {
    const value = row[field];
    if (value !== null && value !== undefined && String(value).trim() !== "") {
      dimensions[field] = String(value);
    }
  }
  if (Object.keys(dimensions).length > 0) params.set("dimensions", JSON.stringify(dimensions));
  return params;
}

function buildSingleFilterParams(service, row, periodValue, field) {
  const params = new URLSearchParams({ limit: "1", period: String(periodValue) });
  const filterEntry = Object.entries(service.filters ?? {}).find(([, filterField]) => filterField === field);
  if (filterEntry) params.set(filterEntry[0], String(row[field]));
  else params.set("dimensions", JSON.stringify({ [field]: String(row[field]) }));
  return params;
}

function hasNumericValue(value) {
  if (value === null || value === undefined || String(value).trim() === "") return false;
  return Number.isFinite(Number(value));
}
console.log(`Radar Production smoke · ${new Date().toISOString()}`);
console.log(`API: ${API_BASE}`);
console.log(`Origen CORS esperado: ${ORIGIN}`);

for (const service of services) {
  const baseParams = new URLSearchParams({ limit: "1" });
  try {
    const initial = await queryService(service.id, baseParams);
    const row = initial.payload.data[0];
    const missing = service.required.filter((field) => !Object.prototype.hasOwnProperty.call(row, field));
    if (missing.length > 0) throw new Error(`Faltan campos del contrato: ${missing.join(", ")}.`);

    const periodValue = row[service.period];
    if (periodValue === null || periodValue === undefined || String(periodValue).trim() === "") {
      throw new Error(`La primera observación no contiene el período ${service.period}.`);
    }

    await sleep(PAUSE_MS);
    const filtered = await queryService(service.id, buildFilterParams(service, row, periodValue));
    const filteredRow = filtered.payload.data[0];
    if (String(filteredRow[service.period] ?? "") !== String(periodValue)) {
      throw new Error(`El filtro de período devolvió ${String(filteredRow[service.period] ?? "sin período")} en lugar de ${periodValue}.`);
    }

    const filterFields = [...new Set([
      ...Object.values(service.filters ?? {}),
      ...(service.dimensions ?? []),
    ])];
    let individualFilterChecks = 0;
    for (const field of filterFields) {
      const value = row[field];
      if (value === null || value === undefined || String(value).trim() === "") continue;
      await sleep(PAUSE_MS);
      const individual = await queryService(service.id, buildSingleFilterParams(service, row, periodValue, field));
      const actual = individual.payload.data[0]?.[field];
      if (String(actual ?? "") !== String(value)) {
        throw new Error(`El filtro individual ${field}=${value} devolvió ${String(actual ?? "sin valor")}.`);
      }
      individualFilterChecks++;
    }

    if (service.seriesFields) {
      const invalidSeries = service.seriesFields.filter((field) => !hasNumericValue(row[field]));
      if (invalidSeries.length > 0) {
        throw new Error(`Series de canasta sin valor numérico en la observación de muestra: ${invalidSeries.join(", ")}.`);
      }
      console.log(`PASS ${service.id} · ${service.seriesFields.length} series numéricas.`);
    }

    console.log(`PASS ${service.id}: HTTP ${initial.status}; filtro combinado y período: HTTP ${filtered.status}; ${individualFilterChecks}/${filterFields.length} filtros individuales comprobados.`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    failures.push({ indicator: service.id, error: message });
    console.error(`FAIL ${service.id}: ${message}`);
  }
  await sleep(PAUSE_MS);
}

let metricChecks = 0;
let metricFailures = 0;
for (const metricCase of metricCases) {
  for (const value of metricCase.values) {
    const params = new URLSearchParams({ limit: "1", [metricCase.param]: value, ...(metricCase.extra ?? {}) });
    try {
      const result = await queryService(metricCase.id, params);
      const actual = String(result.payload.data[0]?.[metricCase.field] ?? "");
      if (actual !== value) {
        throw new Error(`La métrica solicitada ${value} devolvió ${actual || "sin valor"}.`);
      }
      metricChecks++;
      console.log(`PASS ${metricCase.id} · métrica ${value}`);
    } catch (error) {
      metricFailures++;
      const message = error instanceof Error ? error.message : String(error);
      failures.push({ indicator: metricCase.id, metric: value, error: message });
      console.error(`FAIL ${metricCase.id} · métrica ${value}: ${message}`);
    }
    await sleep(700);
  }
}

console.log(`Resultado: ${services.length - failures.filter((item) => !item.metric).length}/${services.length} servicios superaron el smoke test de Production.`);
console.log(`Métricas consultadas: ${metricChecks}/${metricCases.reduce((sum, item) => sum + item.values.length, 0)}; fallas de métrica: ${metricFailures}.`);
if (failures.length > 0) {
  console.error(JSON.stringify(failures, null, 2));
  process.exitCode = 1;
}
