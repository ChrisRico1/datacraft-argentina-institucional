import { describe, expect, it } from "vitest";
import {
  normalizeAcumarHeader,
  parseAcumarCsv,
  parseAcumarDate,
  parseAcumarInteger,
  parseAcumarPercent,
} from "./acumar-import";

const headers = [
  "obra_id", "provincia_id", "provincia_nombre", "departamento_id",
  "departamento_nombre", "tipo_fluido", "obra_nombre", "obra_tipo",
  "cantidad_beneficiarios", "responsable_financiamiento",
  "responsable_ejecuciÃ³n", "obra_estado", "obra_sub_estado",
  "obra_contratista", "obra_plazo", "obra_porcentaje_avance",
  "obra_fecha_inicio", "INSPECTOR", "FECHA   DE INSPECCIÃ“N", "INFORME",
].join(",");

describe("Importación del CSV original de ACUMAR", () => {
  it("normaliza encabezados con acentos dañados y espacios inconsistentes", () => {
    expect(normalizeAcumarHeader("responsable_ejecuciÃ³n")).toBe("responsable_ejecucion");
    expect(normalizeAcumarHeader("FECHA   DE INSPECCIÃ“N")).toBe("fecha_de_inspeccion");
  });

  it("interpreta filas 2024 y conserva estado y subestado por separado", () => {
    const csv = [
      headers,
      "SCP003,02,Provincia de Buenos Aires,06028,Almirante Brown,AGUA,COLECTOR BURZACO 1,PRIMARIA,15000,ENOHSA,MUNICIPIO,EN EJECUCIÃ“N, PARALIZADA,CARBE S.A.,150,39%,5/1/2018,MG,-,-",
    ].join("\n");
    const [row] = parseAcumarCsv(csv);
    expect(row).toMatchObject({
      sourceWorkId: "SCP003",
      departmentCode: "06028",
      departmentName: "Almirante Brown",
      service: "Agua potable",
      executionStatus: "EN EJECUCIÃ“N",
      subStatus: "PARALIZADA",
      progressPercent: 39,
      beneficiaries: 15000,
      startDate: "2018-05-01",
      inspector: "MG",
      inspectionDate: null,
    });
    expect(row?.raw.obra_sub_estado).toBe("PARALIZADA");
  });

  it("interpreta 2025, separadores de miles y campos citados con saltos de línea", () => {
    const csv = [
      headers,
      'CA70022,06,Ciudad AutÃ³noma de Buenos Aires,,C.A.B.A.,AGUA,PLANTA POTABILIZADORA,OBRA PRIMARIA,"5.244","BID 2',
      'TRAMO 3",AYSA,FINALIZADA,FALTA PUESTA EN SERVICIO,DECAVIAL S.A.,871,100%,6/18/2019,,,',
      "CC70018,06,Ciudad AutÃ³noma de Buenos Aires,02042,Comuna 6,CLOACA,RED PRIMARIA CLOACAL,OBRA PRIMARIA,14.837,AYSA,AYSA,FINALIZADA,EN SERVICIO,INARTECO S.A.,240,100%,1/18/2021,,,",
    ].join("\n");
    const rows = parseAcumarCsv(csv);
    expect(rows).toHaveLength(2);
    expect(rows[0]).toMatchObject({
      sourceWorkId: "CA70022",
      departmentCode: null,
      departmentName: "C.A.B.A.",
      service: "Agua potable",
      beneficiaries: 5244,
      fundingResponsible: "BID 2\nTRAMO 3",
      startDate: "2019-06-18",
    });
    expect(rows[1]).toMatchObject({
      sourceWorkId: "CC70018",
      departmentCode: "02042",
      departmentName: "Comuna 6",
      service: "Cloacal",
      beneficiaries: 14837,
      subStatus: "EN SERVICIO",
    });
  });

  it("no inventa valores cuando el número, porcentaje o fecha son ambiguos", () => {
    expect(parseAcumarInteger("5,244")).toBeNull();
    expect(parseAcumarInteger("12.34")).toBeNull();
    expect(parseAcumarPercent("101%")).toBeNull();
    expect(parseAcumarDate("31/02/2025")).toBeNull();
    expect(parseAcumarDate("-")).toBeNull();
  });

  it("rechaza archivos sin columnas obligatorias", () => {
    expect(() => parseAcumarCsv("obra_id,obra_nombre\nA1,Obra")).toThrow(
      /Faltan columnas obligatorias/,
    );
  });
});
