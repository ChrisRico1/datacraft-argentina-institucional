import { afterEach, describe, expect, it, vi } from "vitest";
import { getIndecIndicator, IndecServiceError } from "./indec";

const originalToken = process.env["INDEC_API_TOKEN"];

afterEach(() => {
  if (originalToken === undefined) {
    delete process.env["INDEC_API_TOKEN"];
  } else {
    process.env["INDEC_API_TOKEN"] = originalToken;
  }
  vi.unstubAllGlobals();
});

describe("getIndecIndicator", () => {
  it("rejects indicators that are not in the allowlist", async () => {
    await expect(getIndecIndicator("unknown-table", {})).rejects.toMatchObject({
      name: "IndecServiceError",
      status: 404,
    });
  });

  it("does not call INDEC when the server token is missing", async () => {
    delete process.env["INDEC_API_TOKEN"];

    await expect(getIndecIndicator("ipc", {})).rejects.toMatchObject({
      name: "IndecServiceError",
      status: 503,
    });
  });

  it("uses a fixed upstream endpoint, safe filters and server-side bearer auth", async () => {
    process.env["INDEC_API_TOKEN"] = "test-secret-token";
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify([{ periodo: "202601", valor: 1 }]), {
        status: 200,
        headers: { "Content-Range": "0-0/1" },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const response = await getIndecIndicator("ipc", { from: "2021", limit: "100" });
    const [requestUrl, requestOptions] = fetchMock.mock.calls[0] as [
      string,
      RequestInit,
    ];

    expect(requestUrl).toContain("https://api.indec.gob.ar/v1/ipc_nacional?");
    expect(requestUrl).toContain("periodo=gte.2021");
    expect(requestUrl).toContain("order=periodo.desc");
    expect(requestOptions.headers).toMatchObject({
      Authorization: "Bearer test-secret-token",
      Prefer: "count=exact",
    });
    expect(response.result.source).toBe("INDEC");
    expect(response.result.contentRange).toBe("0-0/1");
  });

  it("applies every allowlisted export dimension as an exact INDEC filter", async () => {
    process.env["INDEC_API_TOKEN"] = "test-secret-token";
    const fetchMock = vi.fn().mockResolvedValue(new Response("[]", { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    await getIndecIndicator("exportaciones", {
      dimensions: JSON.stringify({ rubro_cod: "1", subrubro_cod: "12", pais_cod: "032" }),
    });

    const [requestUrl] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(requestUrl).toContain("rubro_cod=eq.1");
    expect(requestUrl).toContain("subrubro_cod=eq.12");
    expect(requestUrl).toContain("pais_cod=eq.032");
  });

  it.each([
    ["exportaciones", { pais_cod: "032" }],
    ["importaciones", { pais_cod: "032" }],
  ])("allows country-only filtering for %s", async (indicator, dimensions) => {
    process.env["INDEC_API_TOKEN"] = "test-secret-token";
    const fetchMock = vi.fn().mockResolvedValue(new Response("[]", { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    await getIndecIndicator(indicator, { dimensions: JSON.stringify(dimensions) });
    const [requestUrl] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(new URL(requestUrl).searchParams.get("pais_cod")).toBe("eq.032");
  });

  it("rejects dimensions that are not registered for an indicator", async () => {
    process.env["INDEC_API_TOKEN"] = "test-secret-token";

    await expect(getIndecIndicator("exportaciones", {
      dimensions: JSON.stringify({ pais_nom: "Brasil" }),
    })).rejects.toMatchObject({ status: 400 });
  });

  it("rejects malformed dimension payloads", async () => {
    process.env["INDEC_API_TOKEN"] = "test-secret-token";

    await expect(getIndecIndicator("exportaciones", {
      dimensions: "[",
    })).rejects.toMatchObject({ status: 400 });
  });

  it.each([
    ["pobreza", { area_geografica_cod: "32" }, "area_geografica_cod", "eq.32"],
    ["mercado-laboral", { area_geografica_cod: "32" }, "area_geografica_cod", "eq.32"],
    ["cba-cbt", { tipo_de_indicador: "Indice" }, "tipo_de_indicador", "eq.Indice"],
    ["poblacion-departamento", { jurisdiccion_cod: "06" }, "jurisdiccion_cod", "eq.06"],
    ["poblacion-departamento", { rmba: "Sí" }, "rmba", "eq.Sí"],
    ["costo-construccion", { codigo_CPC_1: "01" }, "codigo_CPC_1", "eq.01"],
    ["ipi-manufacturero", { codigo_CLaNAE_2004: "C" }, "codigo_CLaNAE_2004", "eq.C"],
    ["ipi-manufacturero", { serie: "Original" }, "serie", "eq.Original"],
  ])("applies documented dimensions for %s", async (indicator, dimensions, field, expected) => {
    process.env["INDEC_API_TOKEN"] = "test-secret-token";
    const fetchMock = vi.fn().mockResolvedValue(new Response("[]", { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    await getIndecIndicator(indicator, { dimensions: JSON.stringify(dimensions) });
    const [requestUrl] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(new URL(requestUrl).searchParams.get(field)).toBe(expected);
  });

  it("rejects obsolete IPI manufacturer dimension names", async () => {
    process.env["INDEC_API_TOKEN"] = "test-secret-token";

    await expect(getIndecIndicator("ipi-manufacturero", {
      dimensions: JSON.stringify({ codigo_ClaNAE_2010: "C" }),
    })).rejects.toMatchObject({ status: 400 });
  });

  it("rejects page sizes above the INDEC limit", async () => {
    process.env["INDEC_API_TOKEN"] = "test-secret-token";

    await expect(getIndecIndicator("ipc", { limit: "1001" })).rejects.toMatchObject({
      status: 400,
    });
  });
  
  it.each([
    ["ipc", "ipc_nacional"],
    ["salarios", "indice_salarios"],
    ["emae", "estimador-mensual-de-actividad-economica-nivel-general"],
    ["pobreza", "pobreza_eph"],
    ["mercado-laboral", "mercado_trabajo_eph"],
    ["cba-cbt", "valorizacion_canastas_cba_cbt"],
    ["canasta-crianza", "canasta-crianza"],
    ["exportaciones", "comercio_exterior_exportacion_bienes"],
    ["importaciones", "comercio_exterior_importacion_bienes"],
    ["comercio-nomenclaturas", "comercio_exterior_nomenclaturas"],
    ["poblacion-departamento", "estimaciones_poblacion_departamento_2022_2035"],
    ["poblacion-jurisdiccion", "proyecciones_poblacion_jurisdiccion_2022_2040"],
    ["poblacion-nacional", "proyecciones_poblacion_nacional_2022_2040"],
    ["ipi-manufacturero", "ipi_manufacturero"],
    ["sipm", "sipm_precios_mayoristas"],
    ["costo-construccion", "icc_precios_construccion"],
  ])("mantiene registrado %s en el endpoint oficial %s", async (indicator, endpoint) => {
    process.env["INDEC_API_TOKEN"] = "test-secret-token";
    const fetchMock = vi.fn().mockResolvedValue(new Response("[]", { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    await getIndecIndicator(indicator, {});
    const [requestUrl] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(new URL(requestUrl).pathname).toBe(`/v1/${endpoint}`);
  });
});
