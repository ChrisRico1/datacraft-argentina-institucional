import { describe, expect, it } from "vitest";
import { buildChildcareCostBreakdown, childcareMetricOptions, formatChildcarePeriodLabel } from "./childcareCostBreakdown";

const latest = {
  Periodo: "202610",
  bys_men1: 191424,
  cuid_men1: 399896,
  tot_men1: 591320,
  bys_1a3: 247173,
  cuid_1a3: 457024,
  tot_1a3: 704198,
  bys_4a5: 314805,
  cuid_4a5: 285640,
  tot_4a5: 600445,
  bys_6a12: 390516,
  cuid_6a12: 364353,
  tot_6a12: 754869,
};

describe("childcareCostBreakdown", () => {
  it("exposes the twelve official series for four age groups and three components", () => {
    expect(childcareMetricOptions).toHaveLength(12);
    expect(new Set(childcareMetricOptions.map((option) => option.valueKey)).size).toBe(12);
  });

  it("uses the latest period and preserves INDEC-published totals", () => {
    const result = buildChildcareCostBreakdown([
      { ...latest, Periodo: "202609", tot_men1: 570832 },
      latest,
    ]);

    expect(result).toEqual({
      status: "ready",
      period: "202610",
      rows: [
        { age: "Menor de 1 año", goods: 191424, care: 399896, total: 591320 },
        { age: "1 a 3 años", goods: 247173, care: 457024, total: 704198 },
        { age: "4 a 5 años", goods: 314805, care: 285640, total: 600445 },
        { age: "6 a 12 años", goods: 390516, care: 364353, total: 754869 },
      ],
    });
  });

  it("parses Spanish formatted amounts without changing their values", () => {
    const result = buildChildcareCostBreakdown([{
      ...latest,
      bys_men1: "191.424",
      cuid_men1: "399.896",
      tot_men1: "591.320",
    }]);

    expect(result.status).toBe("ready");
    if (result.status === "ready") {
      expect(result.rows[0]).toEqual({
        age: "Menor de 1 año",
        goods: 191424,
        care: 399896,
        total: 591320,
      });
    }
  });

  it("does not calculate or replace totals when a component is missing", () => {
    const result = buildChildcareCostBreakdown([{ ...latest, cuid_1a3: "..." }]);
    expect(result).toEqual({
      status: "incomplete",
      period: "202610",
      missing: ["cuid_1a3"],
    });
  });

  it("refuses ambiguous duplicate rows for the latest period", () => {
    const result = buildChildcareCostBreakdown([latest, { ...latest }]);
    expect(result).toEqual({ status: "duplicate-period", period: "202610" });
  });

  it("formats monthly periods in Spanish", () => {
    expect(formatChildcarePeriodLabel("202610")).toBe("octubre de 2026");
    expect(formatChildcarePeriodLabel("unknown")).toBe("unknown");
  });

  it("returns no-data when no period is available", () => {
    expect(buildChildcareCostBreakdown([{ ...latest, Periodo: "" }])).toEqual({ status: "no-data" });
  });
});
