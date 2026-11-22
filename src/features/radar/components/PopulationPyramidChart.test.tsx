import { describe, expect, it } from "vitest";
import { buildPopulationPyramid } from "./PopulationPyramidChart";

const rows = [
  { fecha: "2026-07-01", edad: 0, sexo_cod: 1, poblacion: 100 },
  { fecha: "2026-07-01", edad: 0, sexo_cod: 2, poblacion: 110 },
  { fecha: "2026-07-01", edad: 1, sexo_cod: 1, poblacion: 90 },
  { fecha: "2026-07-01", edad: 1, sexo_cod: 2, poblacion: 95 },
  { fecha: "2025-07-01", edad: 0, sexo_cod: 1, poblacion: 105 },
  { fecha: "2025-07-01", edad: 0, sexo_cod: 2, poblacion: 115 },
];

describe("buildPopulationPyramid", () => {
  it("uses the latest common reference date and places sexes on opposite sides", () => {
    const result = buildPopulationPyramid(rows, "fecha", "poblacion");
    expect(result?.period).toBe("2026-07-01");
    expect(result?.rows).toEqual([
      { age: "0", female: -100, male: 110 },
      { age: "1", female: -90, male: 95 },
    ]);
  });

  it("does not build a pyramid when one sex is missing", () => {
    const result = buildPopulationPyramid(
      rows.filter((row) => row.sexo_cod === 1),
      "fecha",
      "poblacion",
    );
    expect(result).toBeNull();
  });

  it("ignores missing and non-numeric observations", () => {
    const result = buildPopulationPyramid(
      [
        ...rows,
        { fecha: "2026-07-01", edad: 2, sexo_cod: 1, poblacion: null },
        { fecha: "2026-07-01", edad: 2, sexo_cod: 2, poblacion: "n/d" },
      ],
      "fecha",
      "poblacion",
    );
    expect(result?.rows).toHaveLength(2);
  });
});
