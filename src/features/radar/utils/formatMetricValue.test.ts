import { describe, expect, it } from "vitest";
import { formatMetricValue } from "./formatMetricValue";

describe("formatMetricValue", () => {
  it("formats current pesos as Argentine currency", () => {
    const result = formatMetricValue(1234.5, "Pesos corrientes", "Valor publicado");
    expect(result).toContain("$");
    expect(result).toContain("1.234,5");
  });

  it("formats foreign trade values as US dollars", () => {
    const result = formatMetricValue(2500, "Dólares / cantidades, según serie", "Valor FOB (USD)");
    expect(result).toContain("$");
    expect(result).toContain("2.500");
  });

  it("keeps percentage values distinct from percentage-point changes", () => {
    expect(formatMetricValue(7.8, "Porcentaje", "Desocupación (%)")).toBe("7,8%");
    expect(formatMetricValue(0.4, "Puntos porcentuales", "Incidencia mensual")).toBe("0,4 pp");
  });

  it("identifies population values as people", () => {
    expect(formatMetricValue(1234, "Personas", "Población estimada")).toBe("1.234 personas");
    expect(formatMetricValue(1234, "Personas", "Población estimada", { compact: true })).toContain("pers.");
  });

  it("labels index values without converting or rescaling them", () => {
    expect(formatMetricValue(145.2, "Índice · base diciembre 2016=100", "Índice")).toBe("145,2 puntos de índice");
  });
});
