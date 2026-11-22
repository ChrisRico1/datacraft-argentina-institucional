import { describe, expect, it } from "vitest";
import { acumarSubbasinsWfs, acumarSubbasinsWms } from "./geo-layers";

describe("Cartografía temática de Infraestructura Cloacal", () => {
  it("identifica la capa oficial Subcuencas ACUMAR publicada por IGN", () => {
    expect(acumarSubbasinsWms.endpoint).toBe(
      "https://wms.ign.gob.ar/geoserver/ign_riesgo/ows",
    );
    expect(acumarSubbasinsWms.layer).toBe(
      "ign_riesgo:anticipando_crecida_subcuenca_acumar",
    );
    expect(acumarSubbasinsWms.attribution).toContain("IGN y ACUMAR");
    expect(acumarSubbasinsWms.label).toBe("Subcuencas ACUMAR (IGN)");
    expect("sldBody" in acumarSubbasinsWms).toBe(false);
  });

  it("usa WFS GeoJSON para aplicar la paleta institucional en el navegador", () => {
    expect(acumarSubbasinsWfs.url).toContain("service=WFS");
    expect(acumarSubbasinsWfs.url).toContain("version=1.1.0");
    expect(acumarSubbasinsWfs.url).toContain(
      "ign_riesgo%3Aanticipando_crecida_subcuenca_acumar",
    );
    expect(acumarSubbasinsWfs.style.color).toBe("#0B369A");
    expect(acumarSubbasinsWfs.style.fillColor).toBe("#0B369A");
    expect(acumarSubbasinsWfs.style.fillOpacity).toBe(0.24);
    expect(acumarSubbasinsWfs.style.weight).toBe(2.2);
    expect(acumarSubbasinsWfs.style.opacity).toBe(0.96);
  });

  it("mantiene la identidad de subcuencas sin equipararla al límite hidrográfico normativo", () => {
    expect(acumarSubbasinsWms.label.toLowerCase()).not.toContain(
      "límite hidrográfico",
    );
  });
});
