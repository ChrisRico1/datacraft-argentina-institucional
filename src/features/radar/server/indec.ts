/**
 * Servidor de integración con el Catálogo API-INDEC.
 *
 * Importante: este módulo solo debe importarse desde rutas/funciones servidor.
 * El token nunca se devuelve al cliente ni se acepta desde parámetros HTTP.
 */

export type IndecIndicatorId =
  | "ipc"
  | "salarios"
  | "emae"
  | "pobreza"
  | "mercado-laboral"
  | "cba-cbt"
  | "canasta-crianza"
  | "exportaciones"
  | "importaciones"
  | "poblacion-departamento"
  | "poblacion-jurisdiccion"
  | "poblacion-nacional"
  | "ipi-manufacturero"
  | "sipm"
  | "costo-construccion";

type IndicatorConfig = {
  endpoint: string;
  order: string;
  periodField?: string;
  regionField?: string;
  seriesField?: string;
  indicatorTypeField?: string;
  categoryField?: string;
};

const INDICATORS: Record<IndecIndicatorId, IndicatorConfig> = {
  ipc: {
    endpoint: "ipc_nacional",
    order:
      "clasificador,nivel,codigo,descripcion,periodo,anio,mes,indicador,tipo_de_indicador,tipo_de_indicador_descripcion,region,unidad_de_medida",
    periodField: "periodo",
    regionField: "region",
    indicatorTypeField: "tipo_de_indicador",
    categoryField: "descripcion",
  },
  salarios: {
    endpoint: "indice_salarios",
    order:
      "clasificador,nivel,codigo,descripcion,periodo,anio,mes,indicador,tipo_de_indicador,tipo_de_indicador_descripcion,unidad_de_medida",
    periodField: "periodo",
    indicatorTypeField: "tipo_de_indicador",
    categoryField: "descripcion",
  },
  emae: {
    endpoint: "estimador-mensual-de-actividad-economica-nivel-general",
    order: "tipo_de_indicador_descripcion,anio,mes,periodo,tipo_de_indicador",
    periodField: "periodo",
    indicatorTypeField: "tipo_de_indicador",
  },
  pobreza: {
    endpoint: "pobreza_eph",
    order: "area_geografica_nom,periodo",
    periodField: "periodo",
    regionField: "area_geografica_nom",
  },
  "mercado-laboral": {
    endpoint: "mercado_trabajo_eph",
    order: "area_geografica_nom,periodo",
    periodField: "periodo",
    regionField: "area_geografica_nom",
  },
  "cba-cbt": {
    endpoint: "valorizacion_canastas_cba_cbt",
    order:
      "clasificador,nivel,codigo,descripcion,periodo,anio,mes,indicador,tipo_de_indicador,tipo_de_indicador_descripcion,region,unidad_de_medida",
    periodField: "periodo",
    regionField: "region",
    indicatorTypeField: "tipo_de_indicador",
    categoryField: "descripcion",
  },
  "canasta-crianza": {
    endpoint: "canasta-crianza",
    order: "Periodo",
    periodField: "Periodo",
  },
  exportaciones: {
    endpoint: "comercio_exterior_exportacion_bienes",
    order: "Anio,Mes,Periodo,rubro_cod,subrubro_cod,pais_cod",
    periodField: "Periodo",
    categoryField: "rubro_cod",
  },
  importaciones: {
    endpoint: "comercio_exterior_importacion_bienes",
    order: "Anio,Mes,Periodo,uso_economico_cod,gce_cod,pais_cod",
    periodField: "Periodo",
    categoryField: "uso_economico_cod",
  },
  "poblacion-departamento": {
    endpoint: "estimaciones_poblacion_departamento_2022_2035",
    order: "departamento_cod,sexo_cod,fecha",
    periodField: "fecha",
    regionField: "jurisdiccion_nom",
    categoryField: "departamento_nom",
  },
  "poblacion-jurisdiccion": {
    endpoint: "proyecciones_poblacion_jurisdiccion_2022_2040",
    order: "jurisdiccion_cod,sexo_cod,edad_cod,fecha",
    periodField: "fecha",
    regionField: "jurisdiccion_nom",
    categoryField: "edad_nom",
  },
  "poblacion-nacional": {
    endpoint: "proyecciones_poblacion_nacional_2022_2040",
    order: "edad,sexo_cod,fecha",
    periodField: "fecha",
    categoryField: "sexo_nom",
  },
  "ipi-manufacturero": {
    endpoint: "ipi_manufacturero",
    order:
      "periodo,anio,mes,indicador,cuadro_web,codigo_ClaNAE_2010,codigo_CPC_2_1,serie,descripcion,tipo_de_indicador,unidad_de_medida",
    periodField: "periodo",
    seriesField: "serie",
    indicatorTypeField: "tipo_de_indicador",
    categoryField: "descripcion",
  },
  sipm: {
    endpoint: "sipm_precios_mayoristas",
    order:
      "operativo,indicador,clasificador,nivel,codigo_apertura,descripcion,periodo,anio,mes,tipo_de_indicador,tipo_de_indicador_descripcion,region,unidad_de_medida",
    periodField: "periodo",
    regionField: "region",
    indicatorTypeField: "tipo_de_indicador",
    categoryField: "descripcion",
  },
  "costo-construccion": {
    endpoint: "icc_precios_construccion",
    order:
      "indicador,codigo_apertura,codigo_CPC_1,clasificador,nivel,descripcion,periodo,anio,mes,tipo_de_indicador,tipo_de_indicador_descripcion,region,unidad_de_medida",
    periodField: "periodo",
    regionField: "region",
    indicatorTypeField: "tipo_de_indicador",
    categoryField: "descripcion",
  },
};

const API_BASE_URL = "https://api.indec.gob.ar/v1";
const DEFAULT_LIMIT = 100;
const MAX_LIMIT = 1000;
const MAX_OFFSET = 1_000_000;
const REQUEST_TIMEOUT_MS = 15_000;

export type IndecQuery = {
  period?: string;
  from?: string;
  region?: string;
  series?: string;
  indicatorType?: string;
  category?: string;
  limit?: string;
  offset?: string;
};

export type IndecResult = {
  indicator: IndecIndicatorId;
  endpoint: string;
  source: "INDEC";
  fetchedAt: string;
  contentRange: string | null;
  partial: boolean;
  data: unknown[];
};

export class IndecServiceError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "IndecServiceError";
  }
}

function cleanFilter(value: string | undefined, label: string): string | undefined {
  if (value === undefined || value === "") return undefined;
  const normalized = value.trim();
  if (!normalized || normalized.length > 100 || /[\r\n]/.test(normalized)) {
    throw new IndecServiceError(`El filtro ${label} no es válido.`, 400);
  }
  return normalized;
}

function parseInteger(
  value: string | undefined,
  fallback: number,
  min: number,
  max: number,
  label: string,
): number {
  if (value === undefined || value === "") return fallback;
  if (!/^\d+$/.test(value)) {
    throw new IndecServiceError(`El parámetro ${label} debe ser un entero.`, 400);
  }
  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed) || parsed < min || parsed > max) {
    throw new IndecServiceError(`El parámetro ${label} está fuera de rango.`, 400);
  }
  return parsed;
}

export async function getIndecIndicator(
  indicatorId: string,
  query: IndecQuery,
): Promise<{ result: IndecResult; status: number }> {
  if (!(indicatorId in INDICATORS)) {
    throw new IndecServiceError("El indicador solicitado no está habilitado.", 404);
  }

  const config = INDICATORS[indicatorId as IndecIndicatorId];
  const token = process.env.INDEC_API_TOKEN?.trim();
  if (!token) {
    throw new IndecServiceError("El servicio estadístico no está configurado.", 503);
  }

  const limit = parseInteger(query.limit, DEFAULT_LIMIT, 1, MAX_LIMIT, "limit");
  const offset = parseInteger(query.offset, 0, 0, MAX_OFFSET, "offset");
  const params = new URLSearchParams({
    order: config.periodField
      ? [
          `${config.periodField}.desc`,
          ...config.order.split(",").filter((field) => field !== config.periodField),
        ].join(",")
      : config.order,
    limit: String(limit),
    offset: String(offset),
  });

  const period = cleanFilter(query.period, "period");
  const from = cleanFilter(query.from, "from");
  const region = cleanFilter(query.region, "region");
  const series = cleanFilter(query.series, "series");
  const indicatorType = cleanFilter(query.indicatorType, "indicatorType");
  const category = cleanFilter(query.category, "category");

  if (period && config.periodField) {
    params.set(config.periodField, `eq.${period}`);
  } else if (period) {
    throw new IndecServiceError("Este indicador no admite filtro por período.", 400);
  }
  if (from && config.periodField) {
    if (!/^\d{4}$/.test(from)) {
      throw new IndecServiceError("El parámetro from debe contener un año de cuatro dígitos.", 400);
    }
    params.set(config.periodField, `gte.${from}`);
  } else if (from) {
    throw new IndecServiceError("Este indicador no admite filtro por año.", 400);
  }
  if (region && config.regionField) {
    params.set(config.regionField, `eq.${region}`);
  } else if (region) {
    throw new IndecServiceError("Este indicador no admite filtro geográfico.", 400);
  }
  if (series && config.seriesField) {
    params.set(config.seriesField, `eq.${series}`);
  } else if (series) {
    throw new IndecServiceError("Este indicador no admite filtro por serie.", 400);
  }
  if (indicatorType && config.indicatorTypeField) {
    params.set(config.indicatorTypeField, `eq.${indicatorType}`);
  } else if (indicatorType) {
    throw new IndecServiceError("Este indicador no admite ese tipo de filtro.", 400);
  }
  if (category && config.categoryField) {
    params.set(config.categoryField, `eq.${category}`);
  } else if (category) {
    throw new IndecServiceError("Este indicador no admite filtro por categoría.", 400);
  }

  let upstream: Response;
  try {
    upstream = await fetch(`${API_BASE_URL}/${config.endpoint}?${params.toString()}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        Prefer: "count=exact",
      },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch (error) {
    if (error instanceof Error && error.name === "TimeoutError") {
      throw new IndecServiceError("INDEC demoró demasiado en responder.", 504);
    }
    throw new IndecServiceError("No se pudo establecer conexión con INDEC.", 502);
  }

  if (upstream.status === 401 || upstream.status === 403) {
    throw new IndecServiceError("INDEC rechazó la autenticación del servicio.", 502);
  }
  if (upstream.status === 400) {
    throw new IndecServiceError("INDEC rechazó los parámetros de consulta.", 502);
  }
  if (upstream.status === 429) {
    throw new IndecServiceError("INDEC limitó temporalmente las consultas.", 503);
  }
  if (!upstream.ok && upstream.status !== 206) {
    throw new IndecServiceError("INDEC no pudo completar la consulta.", 502);
  }

  let data: unknown;
  try {
    data = await upstream.json();
  } catch {
    throw new IndecServiceError("INDEC devolvió una respuesta no válida.", 502);
  }
  if (!Array.isArray(data)) {
    throw new IndecServiceError("La estructura de respuesta de INDEC no es la esperada.", 502);
  }

  return {
    status: upstream.status,
    result: {
      indicator: indicatorId as IndecIndicatorId,
      endpoint: config.endpoint,
      source: "INDEC",
      fetchedAt: new Date().toISOString(),
      contentRange: upstream.headers.get("content-range"),
      partial: upstream.status === 206,
      data,
    },
  };
}
