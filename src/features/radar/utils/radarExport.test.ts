import { describe, expect, it } from "vitest";
import { createRadarCsv } from "./radarExport";

describe("createRadarCsv", () => {
  it("returns an empty string when there are no rows", () => {
    expect(createRadarCsv([])).toBe("");
  });

  it("preserves headers, commas, quotes and the UTF-8 BOM", () => {
    const csv = createRadarCsv([
      { indicador: "Exportación, total", valor: 123.4, nota: 'Dato "preliminar"' },
    ]);

    expect(csv.charCodeAt(0)).toBe(0xfeff);
    expect(csv).toContain("indicador,valor,nota");
    expect(csv).toContain('"Exportación, total"');
    expect(csv).toContain('"Dato ""preliminar"""');
  });

  it("serializes nested values without discarding the source observation", () => {
    const csv = createRadarCsv([{ periodo: "202610", metadata: { marca: "*" } }]);
    expect(csv).toContain('"{""marca"":""*""}"');
  });
});
