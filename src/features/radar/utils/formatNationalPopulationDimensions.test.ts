import { describe, expect, it } from "vitest";
import { formatNationalPopulationDimensions } from "./formatNationalPopulationDimensions";

describe("formatNationalPopulationDimensions", () => {
  it("shows age and sex together so observations are distinguishable", () => {
    expect(formatNationalPopulationDimensions({ edad: 35, sexo_nom: "Mujer", sexo_cod: 1 }))
      .toBe("Edad: 35 · Sexo: Mujer");
  });

  it("uses the official sex code when the label is absent", () => {
    expect(formatNationalPopulationDimensions({ edad: 42, sexo_cod: 2 }))
      .toBe("Edad: 42 · Sexo: Varón");
  });

  it("returns a dash when no dimension is available", () => {
    expect(formatNationalPopulationDimensions({})).toBe("—");
  });
});
