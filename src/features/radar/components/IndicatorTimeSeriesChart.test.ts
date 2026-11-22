import { describe, expect, it } from "vitest";
import { buildTimeSeriesPoints, shouldUseZeroBaseline } from "./IndicatorTimeSeriesChart";

describe("buildTimeSeriesPoints", () => {
  it("sorts observations chronologically without changing their values", () => {
    const result = buildTimeSeriesPoints(
      [
        { periodo: "2025-03", valor: 3 },
        { periodo: "2025-01", valor: 1 },
        { periodo: "2025-02", valor: 2 },
      ],
      "periodo",
      "valor",
    );
    expect(result.points).toEqual([
      { period: "2025-01", value: 1 },
      { period: "2025-02", value: 2 },
      { period: "2025-03", value: 3 },
    ]);
    expect(result.duplicatePeriods).toEqual([]);
    expect(result.numericCount).toBe(3);
  });

  it("keeps missing and statistical-marker observations as null gaps", () => {
    const result = buildTimeSeriesPoints(
      [
        { periodo: "2025-01", valor: 10 },
        { periodo: "2025-02", valor: "s" },
        { periodo: "2025-03", valor: null },
        { periodo: "2025-04", valor: 20 },
      ],
      "periodo",
      "valor",
    );
    expect(result.points).toEqual([
      { period: "2025-01", value: 10 },
      { period: "2025-02", value: null },
      { period: "2025-03", value: null },
      { period: "2025-04", value: 20 },
    ]);
    expect(result.skippedCount).toBe(2);
  });

  it("parses Spanish thousands and decimal separators", () => {
    const result = buildTimeSeriesPoints(
      [
        { periodo: "2025-01", valor: "1.234,5" },
        { periodo: "2025-02", valor: "2.500" },
      ],
      "periodo",
      "valor",
    );
    expect(result.points).toEqual([
      { period: "2025-01", value: 1234.5 },
      { period: "2025-02", value: 2500 },
    ]);
  });

  it("flags repeated periods instead of combining different observations", () => {
    const result = buildTimeSeriesPoints(
      [
        { periodo: "2025-01", valor: 10, area: "Área A" },
        { periodo: "2025-01", valor: 20, area: "Área B" },
        { periodo: "2025-02", valor: 30, area: "Área A" },
      ],
      "periodo",
      "valor",
    );
    expect(result.duplicatePeriods).toEqual(["2025-01"]);
  });

  it("ignores rows without a usable period", () => {
    const result = buildTimeSeriesPoints(
      [
        { periodo: "", valor: 10 },
        { periodo: null, valor: 20 },
        { periodo: "2025-01", valor: 30 },
      ],
      "periodo",
      "valor",
    );
    expect(result.points).toEqual([{ period: "2025-01", value: 30 }]);
  });

  it("uses a zero reference for rates and percentage-point series, including negative values", () => {
    expect(shouldUseZeroBaseline("Porcentaje")).toBe(true);
    expect(shouldUseZeroBaseline("Puntos porcentuales")).toBe(true);
    expect(shouldUseZeroBaseline("Índice · base diciembre 2016=100")).toBe(false);
    expect(shouldUseZeroBaseline("Pesos corrientes")).toBe(false);
  });
});
