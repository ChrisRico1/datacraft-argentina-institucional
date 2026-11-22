import { describe, expect, it } from "vitest";
import { acumarSubbasinsWms } from "./geo-layers";

describe("Cartografía temática de Infraestructura Cloacal", () => {
  it("usa la capa oficial Subcuencas ACUMAR publicada por IGN", () => {
    expect(acumarSubbasinsWms.endpoint).toBe(
      "https://wms.ign.gob.ar/geoserver/ign_riesgo/ows",
    );
    expect(acumarSubbasinsWms.layer).toBe(
      "ign_riesgo:anticipando_crecida_subcuenca_acumar",
    );
    expect(acumarSubbasinsWms.attribution).toContain("IGN y ACUMAR");
  });

  it("identifica la capa como subcuencas y no como límite hidrográfico normativo", () => {
    expect(acumarSubbasinsWms.label).toBe("Subcuencas ACUMAR (IGN)");
    expect(acumarSubbasinsWms.label.toLowerCase()).not.toContain("límite hidrográfico");
  });
});
