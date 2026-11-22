import { describe, expect, it } from "vitest";
import { getRadarFieldMetadata, getRadarIndicatorMetadata, getRadarMetricMetadata } from "./radarMetadata";
import { radarDimensionFilters } from "./filterConfig";

describe("Radar metadata dictionary", () => {
  it("documents every selectable indicator in the public catalogue", () => {
    const ids = ["ipc", "salarios", "emae", "pobreza", "mercado-laboral", "cba-cbt", "canasta-crianza", "exportaciones", "importaciones", "poblacion-departamento", "poblacion-jurisdiccion", "poblacion-nacional", "ipi-manufacturero", "sipm", "costo-construccion"];
    for (const id of ids) {
      const metadata = getRadarIndicatorMetadata(id);
      expect(metadata?.description, id).toBeTruthy();
      expect(metadata?.interpretation, id).toBeTruthy();
    }
  });

  it("covers the catalogue aliases used by the interface", () => {
    expect(getRadarIndicatorMetadata("canastas")?.description).toContain("Canasta Básica");
    expect(getRadarIndicatorMetadata("poblacion")?.description).toContain("departamento");
    expect(getRadarFieldMetadata("canastas", "indicador", "CBA")?.interpretation).toContain("línea de indigencia");
  });

  it("defines selected statistical codes instead of repeating raw codes", () => {
    expect(getRadarFieldMetadata("sipm", "indicador", "IPIM")?.interpretation).toContain("incluidos IVA");
    expect(getRadarFieldMetadata("ipc", "tipo_de_indicador", "Incidencia_m")?.interpretation).toContain("puntos porcentuales");
    expect(getRadarFieldMetadata("emae", "serie", "Serie desestacionalizada")?.interpretation).toContain("patrones estacionales");
  });

  it("explains SIPM and ICC index bases and classifiers", () => {
    expect(getRadarFieldMetadata("sipm", "tipo_de_indicador", "Indice")?.interpretation).toContain("diciembre de 2015 = 100");
    expect(getRadarFieldMetadata("costo-construccion", "clasificador", "ICC 93-CPC")?.interpretation).toContain("enero de 2022 = 100");
    expect(getRadarFieldMetadata("costo-construccion", "codigo_CPC_1", "-")?.interpretation).toContain("no tiene un código CPC");
    expect(getRadarMetricMetadata("costo-construccion", "Indice", "Índice")?.interpretation).toContain("enero de 2022 = 100");
  });

  it("explains structurally missing values without converting them to zero", () => {
    expect(getRadarFieldMetadata("mercado-laboral", "tasa_de_empleo_formal")?.interpretation).toContain("2023T4");
    expect(getRadarIndicatorMetadata("exportaciones")?.interpretation).toContain("no se infiere su causa");
  });

  it("explains CBA/CBT household codes and population geography flags", () => {
    expect(getRadarFieldMetadata("canastas", "tipo_de_indicador", "Hogar 1")?.interpretation).toContain("tres integrantes");
    expect(getRadarFieldMetadata("canastas", "tipo_de_indicador", "ICE")?.interpretation).toContain("gasto total");
    expect(getRadarFieldMetadata("poblacion", "rmba", "1")?.interpretation).toContain("pertenece a la Región Metropolitana");
    expect(getRadarFieldMetadata("mercado-laboral", "area_geografica_cod")?.interpretation).toContain("llega nulo");
  });

  it("uses the EPH economically active population as denominator for demand and underemployment rates", () => {
    expect(getRadarFieldMetadata("mercado-laboral", "tasa_de_ocupacion_demandante")?.interpretation).toContain("población económicamente activa");
    expect(getRadarFieldMetadata("mercado-laboral", "tasa_de_subocupacion")?.interpretation).toContain("población económicamente activa");
    expect(getRadarFieldMetadata("mercado-laboral", "tasa_de_empleo_informal")?.interpretation).toContain("población ocupada");
  });

  it("documents every configured dimension filter", () => {
    for (const [indicatorId, filters] of Object.entries(radarDimensionFilters)) {
      for (const filter of filters) {
        const metadata = getRadarFieldMetadata(indicatorId, filter.field);
        expect(metadata?.description, `${indicatorId}.${filter.field}`).toBeTruthy();
      }
    }
  });

  it("explains all EPH rates with a distinct definition", () => {
    const metrics = ["tasa_de_actividad", "tasa_de_empleo", "tasa_de_desocupacion", "tasa_de_empleo_formal", "tasa_de_empleo_informal", "tasa_de_ocupacion_demandante", "tasa_de_subocupacion", "tasa_de_subocupacion_demandante", "tasa_de_subocupacion_no_demandante", "tasa_pobreza_personas", "tasa_indigencia_personas", "tasa_pobreza_hogares", "tasa_indigencia_hogares"];
    for (const metric of metrics) {
      expect(getRadarFieldMetadata("mercado-laboral", metric)?.description ?? getRadarFieldMetadata("pobreza", metric)?.description, metric).toBeTruthy();
    }
  });

  it("distinguishes index, percentage change and percentage-point contribution", () => {
    expect(getRadarMetricMetadata("ipc", "Indice", "Índice").description).toContain("Nivel del índice");
    expect(getRadarMetricMetadata("ipc", "v_m", "Variación mensual (%)").description).toContain("Cambio porcentual");
    expect(getRadarMetricMetadata("ipc", "Incidencia_m", "Incidencia mensual (puntos porcentuales)").interpretation).toContain("No es el porcentaje");
  });

  it("describes the 12 childcare series without recalculating the published total", () => {
    for (const field of ["tot_men1", "bys_men1", "cuid_men1", "tot_1a3", "bys_1a3", "cuid_1a3", "tot_4a5", "bys_4a5", "cuid_4a5", "tot_6a12", "bys_6a12", "cuid_6a12"]) {
      expect(getRadarFieldMetadata("canasta-crianza", field)?.description).toBeTruthy();
    }
    expect(getRadarFieldMetadata("canasta-crianza", "tot_men1")?.interpretation).toContain("no se recalcula");
  });

  it("explains dynamic selections without losing the official label", () => {
    expect(getRadarFieldMetadata("exportaciones", "pais_cod", "Brasil")?.interpretation).toContain("Selección actual: Brasil");
  });
});
