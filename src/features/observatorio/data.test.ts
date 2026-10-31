import { describe, it, expect } from "vitest";
import { filterWorks, emptyFilters, parseWorks, works, metrics } from "./data";
import { municipalReferences, sources } from "./catalog";
import type { Work } from "./types";

const verifiedFixture: Work = { id: "test-only", municipality: "La Matanza", jurisdiction: "PBA", sector: "Media", name: "Registro exclusivo de prueba", service: "Cloacal", infrastructure: "Red", status: null, progress: null, beneficiaries: null, cutoff: "2025-12-12", sourceId: "works-2025", territorialScope: "Cuenca" };
describe("Reglas del Observatorio", () => {
  it("mantiene 14 referencias PBA y CABA separada", () => { expect(municipalReferences.filter((ref) => ref.jurisdiction === "PBA")).toHaveLength(14); expect(municipalReferences.filter((ref) => ref.jurisdiction === "CABA").map((ref) => ref.name)).toEqual(["CABA"]); });
  it("conserva publicación ACUMAR 12/12/2025 y frecuencia anual", () => { const source = sources.find((item) => item.id === "works-2025"); expect(source?.publishedAt).toBe("2025-12-12"); expect(source?.frequency).toBe("Anual"); });
  it("no publica cifras ni obras inventadas", () => { expect(works).toEqual([]); expect(metrics).toEqual([]); });
  it("excluye agua potable del inventario cloacal", () => { expect(filterWorks([verifiedFixture, { ...verifiedFixture, id: "water", service: "Agua potable" }], emptyFilters).map((work) => work.id)).toEqual(["test-only"]); });
  it("filtra municipio, sector, infraestructura y búsqueda", () => { expect(filterWorks([verifiedFixture], { query: "PRUEBA", municipality: "La Matanza", sector: "Media", infrastructure: "Red" })).toHaveLength(1); for (const filter of [{ municipality: "Lanús" }, { sector: "Alta" }, { infrastructure: "Planta" }, { query: "inexistente" }]) expect(filterWorks([verifiedFixture], { ...emptyFilters, ...filter })).toHaveLength(0); });
  it("conserva desconocidos como null al cargar CSV", () => { const headers = Object.keys(verifiedFixture).join(","); const values = Object.values(verifiedFixture).map((value) => value ?? "").join(","); expect(parseWorks(`${headers}\n${values}`, "csv")[0]).toMatchObject({ progress: null, beneficiaries: null, status: null }); });
  it("rechaza registros sin fuente o fecha verificable", () => { expect(() => parseWorks(JSON.stringify([{ ...verifiedFixture, sourceId: "inventada" }]), "json")).toThrow(); expect(() => parseWorks(JSON.stringify([{ ...verifiedFixture, cutoff: "2025-02-30" }]), "json")).toThrow(); });
  it("rechaza avance fuera de 0–100 e identificadores duplicados", () => { expect(() => parseWorks(JSON.stringify([{ ...verifiedFixture, progress: 101 }]), "json")).toThrow(); expect(() => parseWorks(JSON.stringify([verifiedFixture, verifiedFixture]), "json")).toThrow(); });
  it("preserva escala municipal sin convertirla en cuenca", () => { expect(parseWorks(JSON.stringify([{ ...verifiedFixture, territorialScope: "Partido completo" }]), "json")[0]?.territorialScope).toBe("Partido completo"); });
});