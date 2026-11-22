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
    expect(acumarSubbasinsWms.brandColor).toBe("#0B369A");
    expect(acumarSubbasinsWms.sldBody).toContain("<CssParameter name="fill">#0B369A</CssParameter>");
    expect(acumarSubbasinsWms.sldBody).toContain("<CssParameter name="stroke">#0B369A</CssParameter>");
    expect(acumarSubbasinsWms.fillOpacity).toBe(0.24);
    expect(acumarSubbasinsWms.strokeWidth).toBe(2.2);
  });

  it("identifica la capa como subcuencas y no como límite hidrográfico normativo", () => {
    expect(acumarSubbasinsWms.label).toBe("Subcuencas ACUMAR (IGN)");
    expect(acumarSubbasinsWms.label.toLowerCase()).not.toContain("límite hidrográfico");
  });
});
