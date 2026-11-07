import { describe, expect, it } from "vitest";
import { buildLatestMetricSummary, formatEphPeriodLabel } from "./latestMetricSummary";

describe("buildLatestMetricSummary", () => {
  it("returns the latest and previous EPH values with an absolute percentage-point change", () => {
    const result = buildLatestMetricSummary(
      [
        { periodo: "20261T", tasa_de_desocupacion: 7.8 },
        { periodo: "20262T", tasa_de_desocupacion: 7.9, observaciones: "Dato provisorio" },
      ],
      "periodo",
      "tasa_de_desocupacion",
      "area_geografica_nom",
    );
    expect(result).toMatchObject({
      status: "ready",
      latestPeriod: "20262T",
      latestValue: 7.9,
      previousPeriod: "20261T",
      previousValue: 7.8,
      provisional: true,
    });
    if (result.status === "ready") expect(result.change).toBeCloseTo(0.1, 10);
  });

  it("does not compare EPH values across a missing period", () => {
    const result = buildLatestMetricSummary(
      [
        { periodo: "20254T", valor: 7.5 },
        { periodo: "20262T", valor: 7.9 },
      ],
      "periodo",
      "valor",
    );
    expect(result).toMatchObject({ status: "ready", latestValue: 7.9, previousPeriod: null, previousValue: null, change: null });
  });

  it("does not mix multiple geographic contexts when none is selected", () => {
    const result = buildLatestMetricSummary(
      [
        { periodo: "20261T", valor: 7.8, area: "A" },
        { periodo: "20261T", valor: 8.1, area: "B" },
      ],
      "periodo",
      "valor",
      "area",
    );
    expect(result).toEqual({ status: "select-context", contextCount: 2 });
  });

  it("flags duplicate observations for the latest period", () => {
    const result = buildLatestMetricSummary(
      [
        { periodo: "20261T", valor: 7.8, area: "A" },
        { periodo: "20262T", valor: 7.9, area: "A" },
        { periodo: "20262T", valor: 8.1, area: "A" },
      ],
      "periodo",
      "valor",
      "area",
      "A",
    );
    expect(result).toEqual({ status: "duplicate-period", period: "20262T" });
  });

  it("keeps an unavailable latest value instead of silently falling back to an older period", () => {
    const result = buildLatestMetricSummary(
      [
        { periodo: "20261T", valor: 7.8 },
        { periodo: "20262T", valor: "s" },
      ],
      "periodo",
      "valor",
    );
    expect(result).toMatchObject({ status: "latest-unavailable", period: "20262T" });
  });

  it("parses Spanish decimal and thousands separators", () => {
    const result = buildLatestMetricSummary(
      [
        { periodo: "20261S", valor: "1.234,5" },
        { periodo: "20262S", valor: "2.500" },
      ],
      "periodo",
      "valor",
    );
    expect(result).toMatchObject({ status: "ready", latestValue: 2500, previousValue: 1234.5 });
  });

  it("formats EPH semesters and quarters for people", () => {
    expect(formatEphPeriodLabel("20261S")).toBe("1.er semestre 2026");
    expect(formatEphPeriodLabel("20262T")).toBe("2.º trimestre 2026");
    expect(formatEphPeriodLabel("20254T")).toBe("4.º trimestre 2025");
  });
  it("blocks the summary when a historical period is duplicated, even if the latest period is unique", () => {
    const result = buildLatestMetricSummary(
      [
        { periodo: "202601", valor: 10 },
        { periodo: "202601", valor: 11 },
        { periodo: "202602", valor: 12 },
      ],
      "periodo",
      "valor",
    );
    expect(result).toEqual({ status: "duplicate-period", period: "202601" });
  });

  it("calculates monthly changes only for adjacent calendar months", () => {
    const result = buildLatestMetricSummary(
      [
        { periodo: "202601", valor: 10 },
        { periodo: "202602", valor: 12 },
      ],
      "periodo",
      "valor",
    );
    expect(result).toMatchObject({
      status: "ready",
      latestPeriod: "202602",
      previousPeriod: "202601",
      previousValue: 10,
      change: 2,
    });
  });

});