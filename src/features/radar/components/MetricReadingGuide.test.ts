import { describe, expect, it } from "vitest";
import { getMetricReadingGuide } from "./MetricReadingGuide";

describe("getMetricReadingGuide", () => {
  it("distinguishes IPC index, rate and incidence", () => {
    expect(getMetricReadingGuide("ipc", "Índice · base diciembre 2016=100")?.caution).toContain("niveles");
    expect(getMetricReadingGuide("ipc", "Variación mensual (%)")?.heading).toContain("mensual");
    expect(getMetricReadingGuide("ipc", "Incidencia mensual (puntos porcentuales)")?.caution).toContain("puntos porcentuales");
  });

  it("distinguishes EMAE series and salary index interpretation", () => {
    expect(getMetricReadingGuide("emae", "Variación mensual · desestacionalizada (%)")?.heading).toContain("desestacionalizada");
    expect(getMetricReadingGuide("emae", "Variación mensual · tendencia-ciclo (%)")?.caution).toContain("tendencia");
    expect(getMetricReadingGuide("salarios", "Índice · base octubre 2016=100")?.caution).toContain("poder adquisitivo");
  });

  it("keeps SIPM incidence in percentage points", () => {
    expect(getMetricReadingGuide("sipm", "Incidencia en la variación (puntos porcentuales)")?.caution).toContain("No es una tasa porcentual");
  });

  it("explains the EPH universe and limits geographic interpretation", () => {
    const guide = getMetricReadingGuide("pobreza", "Pobreza en personas (%)");
    expect(guide?.caution).toContain("31 aglomerados urbanos");
    expect(guide?.caution).toContain("No representa una provincia");
  });

  it("explains different labor-market denominators", () => {
    expect(getMetricReadingGuide("mercado-laboral", "Tasa de desocupación (%)")?.explanation).toContain("población económicamente activa");
    expect(getMetricReadingGuide("mercado-laboral", "Empleo informal (%)")?.explanation).toContain("población ocupada");
  });

  it("does not invent interpretation for indicators outside the reviewed scope", () => {
    expect(getMetricReadingGuide("ipi-manufacturero", "Valor publicado")).toBeNull();
    expect(getMetricReadingGuide("exportaciones", "Valor FOB (USD)")).toBeNull();
  });
});
