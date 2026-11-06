import { describe, expect, it } from "vitest";
import { buildLatestAreaComparison } from "./PovertyAreaComparisonChart";

describe("buildLatestAreaComparison", () => {
  it("compares only the latest published period and sorts areas by value", () => {
    const rows = [
      { periodo: "2025-S1", area_geografica_nom: "Área A", tasa_pobreza_personas: 40 },
      { periodo: "2025-S1", area_geografica_nom: "Área B", tasa_pobreza_personas: 50 },
      { periodo: "2025-S2", area_geografica_nom: "Área A", tasa_pobreza_personas: 35 },
      { periodo: "2025-S2", area_geografica_nom: "Área B", tasa_pobreza_personas: 45 },
    ];

    expect(buildLatestAreaComparison(rows, "periodo", "tasa_pobreza_personas", "area_geografica_nom")).toEqual({
      period: "2025-S2",
      duplicateAreas: [],
      data: [
        { area: "Área B", value: 45 },
        { area: "Área A", value: 35 },
      ],
    });
  });

  it("does not convert statistical markers or missing values to zero", () => {
    const rows = [
      { periodo: "2025-S2", area_geografica_nom: "Área A", tasa_pobreza_personas: "35,4" },
      { periodo: "2025-S2", area_geografica_nom: "Área B", tasa_pobreza_personas: "s" },
      { periodo: "2025-S2", area_geografica_nom: "Área C", tasa_pobreza_personas: null },
    ];

    expect(buildLatestAreaComparison(rows, "periodo", "tasa_pobreza_personas", "area_geografica_nom")).toEqual({
      period: "2025-S2",
      duplicateAreas: [],
      data: [{ area: "Área A", value: 35.4 }],
    });
  });

  it("flags duplicate area rows rather than plotting ambiguous comparisons", () => {
    const result = buildLatestAreaComparison(
      [
        { periodo: "2025-S2", area: "Área A", valor: 35 },
        { periodo: "2025-S2", area: "Área A", valor: 40 },
        { periodo: "2025-S2", area: "Área B", valor: 45 },
      ],
      "periodo",
      "valor",
      "area",
    );
    expect(result.duplicateAreas).toEqual(["Área A"]);
  });

  it("returns an empty comparison when there is no period or no numeric value", () => {
    expect(buildLatestAreaComparison([], "periodo", "valor", "area")).toEqual({
      period: null,
      data: [],
      duplicateAreas: [],
    });
    expect(buildLatestAreaComparison(
      [{ periodo: "2025-S2", area: "Área A", valor: "..." }],
      "periodo",
      "valor",
      "area",
    )).toEqual({ period: "2025-S2", data: [], duplicateAreas: [] });
  });
});
