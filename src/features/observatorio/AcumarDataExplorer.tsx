import { useEffect, useMemo, useState } from "react";
import Papa from "papaparse";
import { AlertCircle, Database, ExternalLink, LoaderCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

const ICV_URL = "https://datos.acumar.gob.ar/dataset/c7af5a5f-0313-4d31-ac82-14fd5e999bad/resource/82553be9-6697-432d-85f4-a02b31c51eb6/download/dim-salud.csv";
const WORKS_URL = "https://datos.acumar.gob.ar/dataset/6849cf68-56c9-4e9e-93c8-e6b28c77c1c8/resource/4a3967a6-79d5-479e-8675-472293590a4e/download/seguimiento_obras_agua_cloaca_2025.csv";

type Row = Record<string, string>;
type Radio = { radio: string; municipality: string; households: number | null; population: number | null; value: number | null; wkt: string };
type WorkRow = { id: string; municipality: string; name: string; service: string; status: string; progress: number | null; beneficiaries: number | null; executor: string; finance: string };

const normalize = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLocaleLowerCase("es-AR");
const numberOrNull = (s?: string) => { if (!s?.trim()) return null; const n = Number(s.replace(",", ".")); return Number.isFinite(n) ? n : null; };
const field = (row: Row, key: string) => row[key] ?? row[key.toUpperCase()] ?? "";

function parseWkt(wkt: string): GeoJSON.Geometry | null {
  const clean = wkt.trim();
  const pairs = (text: string): GeoJSON.Position[] => text.split(",").flatMap((pair) => {
    const values = pair.trim().split(/\s+/).map(Number);
    const [x, y] = values;
    if (x === undefined || y === undefined || !values.every(Number.isFinite)) return [];
    return [[x, y]];
  });
  try {
    if (clean.startsWith("POLYGON")) {
      const body = clean.slice(clean.indexOf("((") + 2, clean.lastIndexOf("))"));
      return { type: "Polygon", coordinates: body.split(/\)\s*,\s*\(/).map(pairs) };
    }
    if (clean.startsWith("MULTIPOLYGON")) {
      const body = clean.slice(clean.indexOf("(((") + 3, clean.lastIndexOf(")))"));
      const polygons = body.split(/\)\)\s*,\s*\(\(/).map((poly) => poly.split(/\)\s*,\s*\(/).map(pairs));
      return { type: "MultiPolygon", coordinates: polygons };
    }
  } catch { return null; }
  return null;
}

async function csvRows(url: string): Promise<Row[]> {
  const response = await fetch(url, { headers: { Accept: "text/csv,*/*" } });
  if (!response.ok) throw new Error(`La fuente respondió HTTP ${response.status}`);
  const csv = await response.text();
  const parsed = Papa.parse<Row>(csv, { header: true, skipEmptyLines: true, dynamicTyping: false });
  if (parsed.errors.length) throw new Error("El CSV oficial contiene filas que no se pudieron interpretar.");
  return parsed.data;
}

function useRemoteData<T>(url: string, transform: (rows: Row[]) => T[]) {
  const [data, setData] = useState<T[]>([]);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  const [error, setError] = useState("");
  const load = async () => {
    setState("loading"); setError("");
    try { const rows = await csvRows(url); setData(transform(rows)); setState("ready"); }
    catch (e) { setError(e instanceof Error ? e.message : "Error de conexión"); setState("error"); }
  };
  useEffect(() => { void load(); }, [url]);
  return { data, state, error, reload: load };
}

function parseRadios(rows: Row[]): Radio[] {
  return rows.map((r) => ({
    radio: field(r, "radio"),
    municipality: field(r, "departamento_nombre") || field(r, "municipio"),
    households: numberOrNull(field(r, "hogar_tot")),
    population: numberOrNull(field(r, "pobl_tot")),
    value: numberOrNull(field(r, "ind_ssb")),
    wkt: field(r, "wkt"),
  })).filter((r) => r.radio && r.wkt);
}
function parseWorks(rows: Row[]): WorkRow[] {
  return rows.map((r, i) => {
    const fluid = normalize(field(r, "tipo_fluido") + " " + field(r, "obra_tipo"));
    const service = /cloac|saneamiento/.test(fluid) ? "Cloacal" : /agua/.test(fluid) ? "Agua potable" : "Servicio por clasificar";
    return {
      id: field(r, "obra_id") || `acumar-${i}`,
      municipality: field(r, "departamento_nombre") || "Jurisdicción por identificar",
      name: field(r, "obra_nombre") || "Obra sin denominación",
      service,
      status: field(r, "obra_estado") || field(r, "obra_sub_estado") || "Estado informado pendiente",
      progress: numberOrNull(field(r, "obra_porcentaje_avance")),
      beneficiaries: numberOrNull(field(r, "cantidad_beneficiarios")),
      executor: field(r, "responsable_ejecucion") || "No informado",
      finance: field(r, "responsable_financiamiento") || "No informado",
    };
  });
}

function RadioMap({ radios, municipality }: { radios: Radio[]; municipality: string }) {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!container || !radios.length) return;
    let map: import("leaflet").Map | undefined;
    let cancelled = false;
    void import("leaflet").then((L) => {
      if (cancelled) return;
      map = L.map(container, { scrollWheelZoom: false });
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 18, attribution: '&copy; OpenStreetMap' }).addTo(map);
      const features = radios.map((r) => ({ type: "Feature" as const, properties: r, geometry: parseWkt(r.wkt) })).filter((f): f is GeoJSON.Feature<GeoJSON.Geometry, Radio> => !!f.geometry);
      const collection: GeoJSON.FeatureCollection<GeoJSON.Geometry, Radio> = { type: "FeatureCollection", features };
      const layer = L.geoJSON(collection, {
        style: (feature) => {
          const value = feature?.properties?.value;
          return { color: "#d7e6d1", weight: 0.5, fillOpacity: 0.72, fillColor: value === null ? "#64748b" : value < 25 ? "#a63d40" : value < 50 ? "#d18b42" : value < 75 ? "#b5bd54" : "#4e9479" };
        },
        onEachFeature: (feature, item) => {
          const p = feature.properties;
          item.bindPopup(`<strong>Radio censal ${p.radio}</strong><br/>${p.municipality}<br/>Acceso simultáneo a agua de red y cloaca: ${p.value === null ? "Dato pendiente" : p.value.toLocaleString("es-AR") + "%"}<br/>Hogares: ${p.households?.toLocaleString("es-AR") ?? "s/d"}<br/>Población: ${p.population?.toLocaleString("es-AR") ?? "s/d"}`);
        },
      }).addTo(map);
      if (features.length) map.fitBounds(layer.getBounds(), { padding: [20, 20] });
    }).catch(() => undefined);
    return () => { cancelled = true; map?.remove(); };
  }, [container, radios]);
  return <div ref={setContainer} className="h-[440px] w-full bg-ink-2" aria-label="Mapa de radios censales con indicador de acceso simultáneo a agua de red y cloaca" />;
}

function LoadState({ state, error, reload, label }: { state: string; error: string; reload: () => void; label: string }) {
  if (state === "ready") return null;
  return <div className="flex items-center gap-3 rounded-lg border border-ink-foreground/15 p-4 text-sm text-ink-muted" role="status">
    {state === "loading" ? <LoaderCircle className="h-5 w-5 animate-spin" /> : <AlertCircle className="h-5 w-5 text-amber-400" />}
    <span className="flex-1">{state === "loading" ? `Conectando con ${label}…` : `${label}: ${error}. La fuente oficial permanece disponible en el enlace.`}</span>
    {state === "error" && <Button variant="labOutline" size="sm" onClick={reload}><RefreshCw /> Reintentar</Button>}
  </div>;
}

export default function AcumarDataExplorer() {
  const icv = useRemoteData(ICV_URL, parseRadios);
  const works = useRemoteData(WORKS_URL, parseWorks);
  const [municipality, setMunicipality] = useState("");
  const radios = useMemo(() => icv.data.filter((r) => !municipality || normalize(r.municipality) === normalize(municipality)), [icv.data, municipality]);
  const cloacalWorks = works.data.filter((w) => w.service === "Cloacal");
  const uniqueMunicipalities = [...new Set(icv.data.map((r) => r.municipality).filter(Boolean))].sort();
  return <section className="space-y-8">
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div><p className="eyebrow text-lime">Datos oficiales conectados</p><h2 className="mt-2 text-2xl font-semibold">Indicadores territoriales ACUMAR</h2><p className="mt-2 max-w-3xl text-sm text-ink-muted">El indicador ind_ssb representa población con acceso simultáneo a agua de red y desagüe cloacal a red pública. La unidad espacial es el radio censal incluido en el ICV 2025.</p></div>
      <a className="inline-flex items-center gap-2 text-sm text-mint hover:text-lime" href="https://datos.acumar.gob.ar/dataset/c7af5a5f-0313-4d31-ac82-14fd5e999bad" target="_blank" rel="noreferrer">Ficha ACUMAR ICV 2025 <ExternalLink className="h-4 w-4" /></a>
    </div>
    <LoadState state={icv.state} error={icv.error} reload={icv.reload} label="ACUMAR ICV 2025" />
    {icv.state === "ready" && <><div className="grid gap-4 sm:grid-cols-3">
      <div className="rounded-lg border border-ink-foreground/15 p-4"><p className="text-xs text-ink-muted">Radios censales cargados</p><p className="mt-2 text-2xl font-semibold">{radios.length.toLocaleString("es-AR")}</p></div>
      <div className="rounded-lg border border-ink-foreground/15 p-4"><p className="text-xs text-ink-muted">Hogares representados</p><p className="mt-2 text-2xl font-semibold">{radios.reduce((s, r) => s + (r.households ?? 0), 0).toLocaleString("es-AR")}</p></div>
      <div className="rounded-lg border border-ink-foreground/15 p-4"><p className="text-xs text-ink-muted">Población representada</p><p className="mt-2 text-2xl font-semibold">{radios.reduce((s, r) => s + (r.population ?? 0), 0).toLocaleString("es-AR")}</p></div>
    </div>
    <label className="block max-w-sm space-y-2 text-xs text-ink-muted"><span>Departamento / municipio</span><select value={municipality} onChange={(e) => setMunicipality(e.target.value)} className="h-11 w-full rounded-md border border-ink-foreground/20 bg-ink-2 px-3 text-sm text-ink-foreground"><option value="">Toda el área publicada por ACUMAR</option>{uniqueMunicipalities.map((m) => <option key={m} value={m}>{m}</option>)}</select></label>
    {radios.length ? <><RadioMap radios={radios} municipality={municipality} /><div className="flex flex-wrap gap-4 text-xs text-ink-muted"><span>Indicador: ind_ssb · % de población</span><span>Gris: dato pendiente</span><span>Rojo: 0–24,9%</span><span>Ocre: 25–49,9%</span><span>Verde claro: 50–74,9%</span><span>Verde: 75–100%</span></div></> : <p className="text-sm text-ink-muted">La fuente no devolvió radios para el filtro seleccionado.</p>}
    <p className="text-xs text-ink-muted">Fuente: ACUMAR, ICV 2025 · base demográfica Censo 2022. El indicador mide acceso simultáneo a agua de red y cloaca; no representa cobertura cloacal aislada ni conexiones efectivas. Los valores faltantes se conservan como datos pendientes.</p></>}
    <div className="border-t border-ink-foreground/15 pt-7">
      <div className="flex flex-wrap items-end justify-between gap-3"><div><p className="eyebrow text-lime">Seguimiento de infraestructura</p><h3 className="mt-2 text-xl font-semibold">Obras de agua y saneamiento · segundo semestre 2025</h3></div><a className="inline-flex items-center gap-2 text-sm text-mint hover:text-lime" href="https://datos.acumar.gob.ar/dataset/6849cf68-56c9-4e9e-93c8-e6b28c77c1c8" target="_blank" rel="noreferrer">Ficha de obras ACUMAR <ExternalLink className="h-4 w-4" /></a></div>
      <LoadState state={works.state} error={works.error} reload={works.reload} label="ACUMAR obras 2025" />
      {works.state === "ready" && <><div className="mt-4 grid gap-4 sm:grid-cols-3"><div className="rounded-lg border border-ink-foreground/15 p-4"><p className="text-xs text-ink-muted">Registros importados</p><p className="mt-2 text-2xl font-semibold">{works.data.length.toLocaleString("es-AR")}</p></div><div className="rounded-lg border border-ink-foreground/15 p-4"><p className="text-xs text-ink-muted">Obras cloacales identificadas</p><p className="mt-2 text-2xl font-semibold">{cloacalWorks.length.toLocaleString("es-AR")}</p></div><div className="rounded-lg border border-ink-foreground/15 p-4"><p className="text-xs text-ink-muted">Obras de agua potable</p><p className="mt-2 text-2xl font-semibold">{works.data.filter((w) => w.service === "Agua potable").length.toLocaleString("es-AR")}</p></div></div>
      <div className="mt-5 overflow-x-auto rounded-lg border border-ink-foreground/15"><table className="w-full min-w-[900px] text-left text-sm"><thead className="bg-ink-2 text-ink-muted"><tr>{["Municipio","Obra","Servicio","Estado","Avance","Beneficiarios","Ejecutor","Financiamiento"].map((h) => <th key={h} className="px-4 py-3 font-medium">{h}</th>)}</tr></thead><tbody>{cloacalWorks.map((w) => <tr key={w.id} className="border-t border-ink-foreground/10"><td className="p-4">{w.municipality}</td><td className="p-4">{w.name}</td><td className="p-4">{w.service}</td><td className="p-4">{w.status}</td><td className="p-4">{w.progress === null ? "Pendiente" : `${w.progress}%`}</td><td className="p-4">{w.beneficiaries?.toLocaleString("es-AR") ?? "Pendiente"}</td><td className="p-4">{w.executor}</td><td className="p-4">{w.finance}</td></tr>)}</tbody></table></div>
      <p className="mt-3 text-xs text-ink-muted">Los beneficiarios se informan por obra; su suma puede incluir personas alcanzadas por más de un proyecto. Las ubicaciones no se georreferencian cuando la fuente no aporta coordenadas.</p></>}
    </div>
    <div className="flex items-center gap-2 text-xs text-ink-muted"><Database className="h-4 w-4" /> Conexión directa a recursos oficiales ACUMAR. Última lectura: al abrir o actualizar esta sección. Licencia y metadatos: consultar las fichas originales.</div>
  </section>;
}
