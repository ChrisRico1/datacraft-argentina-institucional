import { describe, expect, it } from "vitest";
import { getRadarErrorGuidance } from "./radarErrorGuidance";

describe("Radar error guidance", () => {
  it("explains how to recover from an INDEC temporary rate limit", () => {
    expect(getRadarErrorGuidance("INDEC limitó temporalmente las consultas.")).toContain("Esperá unos minutos");
    expect(getRadarErrorGuidance("INDEC limitó temporalmente las consultas.")).toContain("Actualizar datos");
  });

  it("keeps the server configuration guidance for other connection errors", () => {
    expect(getRadarErrorGuidance("No se pudo establecer conexión con INDEC.")).toContain("configuración del servidor");
  });
});
