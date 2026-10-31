import { lazy, Suspense, useState, type ReactNode } from "react";
import { ClientOnly, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowUpRight,
  ArrowRight,
  MapPinned,
  Database,
  CircleDashed,
  Search,
  RotateCcw,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/datacraft-logo.jpeg.asset.json";
import { getSource, municipalReferences } from "./catalog";
import type { Filters, Metric, Observatory, Source, Work } from "./types";

const ReferenceMap = lazy(() => import("./ReferenceMap"));
export function ObservatoryShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="observatory grid-lines min-h-screen bg-ink text-ink-foreground">
      <a
        href="#observatorio-contenido"
        className="sr-only focus:not-sr-only focus:absolute focus:z-[60] focus:bg-lime focus:p-3 focus:text-lime-foreground"
      >
        Saltar al contenido
      </a>
      <header className="sticky top-0 z-50 border-b border-ink-foreground/10 bg-ink/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5">
          <Link
            to="/"
            className="flex items-center gap-2.5 font-display text-lg font-bold"
            aria-label="Datacraft Argentina, inicio"
          >
            <img src={logo.url} alt="" width={36} height={36} className="h-9 w-9 rounded-full" />
            <span>
              Datacraft <span className="font-normal text-ink-muted">Argentina</span>
            </span>
          </Link>
          <nav aria-label="Principal" className="hidden items-center gap-6 sm:flex">
            <Link to="/" className="text-sm text-ink-muted hover:text-lime">
              Inicio
            </Link>
            <Link to="/observatorio" className="text-sm text-lime">
              Observatorio
            </Link>
            <Button asChild variant="labOutline">
              <Link to="/" hash="contacto">
                Contacto <ArrowUpRight />
              </Link>
            </Button>
          </nav>
          <Button
            variant="labOutline"
            size="icon"
            aria-expanded={open}
            aria-controls="lab-mobile-nav"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            onClick={() => setOpen(!open)}
            className="sm:hidden"
          >
            {open ? <X /> : <Menu />}
          </Button>
        </div>
        {open && (
          <nav
            id="lab-mobile-nav"
            aria-label="Menú móvil"
            className="flex flex-col gap-4 border-t border-ink-foreground/10 px-5 py-5 sm:hidden"
          >
            <Link to="/" onClick={() => setOpen(false)}>
              Inicio
            </Link>
            <Link to="/observatorio" onClick={() => setOpen(false)} className="text-lime">
              Observatorio
            </Link>
            <Link to="/" hash="contacto">
              Contacto
            </Link>
          </nav>
        )}
      </header>
      <main id="observatorio-contenido">{children}</main>
      <footer className="mt-12 border-t border-ink-foreground/10 bg-carbon py-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 text-sm text-ink-muted">
          <p>© {new Date().getFullYear()} Datacraft Argentina · DATACRAFT LAB</p>
          <Link to="/" className="inline-flex items-center gap-2 hover:text-lime">
            <ArrowLeft className="h-4 w-4" /> Volver a Datacraft
          </Link>
        </div>
      </footer>
    </div>
  );
}
export function SourceLink({ source, compact = false }: { source: Source; compact?: boolean }) {
  return (
    <a
      href={source.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`group inline-flex items-start gap-2 text-sm text-mint hover:text-lime ${compact ? "" : "py-2"}`}
    >
      <span>
        {source.name}
        {!compact && (
          <span className="mt-1 block text-xs text-ink-muted">
            {source.scope}
            {source.frequency ? ` · Frecuencia ${source.frequency.toLowerCase()}` : ""}
          </span>
        )}
      </span>
      <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0" />
      <span className="sr-only">(nueva pestaña)</span>
    </a>
  );
}
export function ProjectCard({ project }: { project: Observatory }) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-ink-foreground/15 bg-ink-2/60 p-7 transition hover:border-lime/50">
      <div className="flex items-start justify-between gap-3">
        <span className="grid h-12 w-12 place-items-center rounded-xl bg-ink-foreground/10">
          <MapPinned className="h-6 w-6" />
        </span>
        <span className="eyebrow rounded-full bg-ink-foreground/10 px-3 py-1.5">
          {project.status}
        </span>
      </div>
      <p className="mt-6 text-xs text-lime">{project.category}</p>
      <h2 className="mt-2 text-2xl font-semibold">{project.title}</h2>
      <p className="mt-2 text-lg text-mint">{project.zone}</p>
      <p className="mt-4 text-sm leading-relaxed text-ink-muted">{project.description}</p>
      <ul className="my-6 space-y-2 text-sm text-ink-muted">
        <li>Fuentes públicas y trazabilidad</li>
        <li>Alcance y estado de validación documentados</li>
      </ul>
      <Button asChild variant="lab" className="mt-auto w-fit">
        <Link to="/observatorio/$slug" params={{ slug: project.slug }}>
          Explorar observatorio <ArrowRight />
        </Link>
      </Button>
    </article>
  );
}
export function Kpi({ metric }: { metric: Metric }) {
  const source = getSource(metric.sourceId);
  return (
    <div className="border-l border-ink-foreground/20 pl-5">
      <p className="text-sm text-ink-muted">{metric.label}</p>
      <p className="mt-3 font-display text-xl font-semibold">
        {metric.value === null
          ? "Dato pendiente"
          : `${metric.value.toLocaleString("es-AR")} ${metric.unit}`}
      </p>
      <p className="mt-3 text-xs leading-relaxed text-ink-muted">
        Referencia: {metric.year} · Unidad: {metric.unit}
        <br />
        Alcance: {metric.scope}
      </p>
      {source && (
        <div className="mt-2">
          <SourceLink source={source} compact />
        </div>
      )}
    </div>
  );
}
export function EmptyChart({
  title,
  sourceId,
  description,
}: {
  title: string;
  sourceId: string;
  description: string;
}) {
  const source = getSource(sourceId);
  return (
    <div className="border-t border-ink-foreground/15 pt-6">
      <h3 className="text-xl font-semibold">{title}</h3>
      <div className="mt-5 flex min-h-44 flex-col items-center justify-center rounded-lg border border-dashed border-ink-foreground/20 bg-ink-2/30 p-6 text-center">
        <CircleDashed className="h-7 w-7 text-lime" />
        <p className="mt-3 font-medium">En proceso de consolidación</p>
        <p className="mt-2 max-w-md text-sm text-ink-muted">{description}</p>
      </div>
      {source && <SourceLink source={source} />}
    </div>
  );
}
const selectClass =
  "h-11 w-full rounded-md border border-ink-foreground/20 bg-ink-2 px-3 text-sm text-ink-foreground focus-visible:outline-lime disabled:opacity-60";
export function StudyFilters({
  value,
  onChange,
  records,
}: {
  value: Filters;
  onChange: (filters: Filters) => void;
  records: Work[];
}) {
  const cloacal = records.filter((work) => work.service === "Cloacal");
  const infrastructures = [...new Set(cloacal.map((work) => work.infrastructure))];
  return (
    <div className="grid gap-4 border-y border-ink-foreground/15 py-5 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto]">
      <label className="space-y-2 text-xs text-ink-muted">
        <span>Municipio / jurisdicción</span>
        <select
          aria-label="Municipio / jurisdicción"
          className={selectClass}
          value={value.municipality}
          onChange={(event) => onChange({ ...value, municipality: event.target.value })}
        >
          <option value="">Todas las referencias</option>
          {municipalReferences.map((ref) => (
            <option key={ref.name} value={ref.name}>
              {ref.name}
              {ref.jurisdiction === "CABA" ? " · jurisdicción diferenciada" : ""}
            </option>
          ))}
        </select>
      </label>
      <label className="space-y-2 text-xs text-ink-muted">
        <span>Sector de cuenca</span>
        <select
          aria-label="Sector de cuenca"
          className={selectClass}
          value={value.sector}
          disabled={!cloacal.length}
          onChange={(event) => onChange({ ...value, sector: event.target.value })}
        >
          <option value="">
            {cloacal.length ? "Todos los sectores" : "Pendiente de registros oficiales"}
          </option>
          {["Alta", "Media", "Baja"].map((sector) => (
            <option key={sector}>{sector}</option>
          ))}
        </select>
      </label>
      <label className="space-y-2 text-xs text-ink-muted">
        <span>Tipo de infraestructura cloacal</span>
        <select
          aria-label="Tipo de infraestructura cloacal"
          className={selectClass}
          value={value.infrastructure}
          disabled={!infrastructures.length}
          onChange={(event) => onChange({ ...value, infrastructure: event.target.value })}
        >
          <option value="">
            {infrastructures.length ? "Todos los tipos" : "Pendiente de inventario"}
          </option>
          {infrastructures.map((type) => (
            <option key={type}>{type}</option>
          ))}
        </select>
      </label>
      <Button
        variant="labOutline"
        className="self-end h-11"
        onClick={() => onChange({ query: "", sector: "", municipality: "", infrastructure: "" })}
      >
        <RotateCcw /> Restablecer
      </Button>
    </div>
  );
}
export function StudyMap({ municipality }: { municipality: string }) {
  return (
    <div className="mt-6 overflow-hidden rounded-lg border border-ink-foreground/15">
      <ClientOnly
        fallback={
          <div className="grid h-[420px] place-items-center bg-ink-2 text-ink-muted">
            Cargando mapa de referencias…
          </div>
        }
      >
        <Suspense
          fallback={
            <div className="grid h-[420px] place-items-center bg-ink-2">Cargando mapa…</div>
          }
        >
          <ReferenceMap municipality={municipality} />
        </Suspense>
      </ClientOnly>
      <div className="flex flex-wrap gap-x-6 gap-y-2 bg-carbon p-4 text-xs text-ink-muted">
        <span className="inline-flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-lime" /> PBA · referencia municipal
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-blush" /> CABA · referencia jurisdiccional
        </span>
        <span>Centros urbanos aproximados · orientación municipal</span>
      </div>
    </div>
  );
}
export function WorksTable({
  records,
  hasRecords,
  filters,
  onChange,
}: {
  records: Work[];
  hasRecords: boolean;
  filters: Filters;
  onChange: (value: Filters) => void;
}) {
  const source = getSource("works-2025");
  return (
    <div>
      <label className="relative mt-6 block max-w-lg">
        <span className="sr-only">Buscar obras</span>
        <Search className="absolute left-3 top-3.5 h-4 w-4 text-ink-muted" />
        <input
          type="search"
          aria-label="Buscar obras"
          value={filters.query}
          onChange={(event) => onChange({ ...filters, query: event.target.value })}
          placeholder="Buscar por obra, municipio o estado"
          className={`${selectClass} pl-10`}
        />
      </label>
      <div
        className="mt-5 overflow-x-auto rounded-lg border border-ink-foreground/15"
        tabIndex={0}
        role="region"
        aria-label="Inventario de obras cloacales"
      >
        <table className="w-full min-w-[1050px] text-left text-sm">
          <caption className="sr-only">
            Inventario exclusivo de obras cloacales con fecha de corte y fuente
          </caption>
          <thead className="bg-ink-2 text-ink-muted">
            <tr>
              {[
                "Municipio",
                "Obra",
                "Servicio",
                "Estado",
                "Avance",
                "Beneficiarios",
                "Fecha de corte",
                "Fuente",
              ].map((heading) => (
                <th key={heading} scope="col" className="px-4 py-4 font-medium">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {records.map((work) => (
              <tr key={work.id} className="border-t border-ink-foreground/10">
                <td className="p-4">
                  {work.municipality}
                  <span className="mt-1 block text-xs text-ink-muted">
                    {work.jurisdiction} · {work.sector ?? "Sector pendiente"}
                  </span>
                </td>
                <td className="p-4">
                  {work.name}
                  {work.territorialScope === "Partido completo" && (
                    <p className="mt-1 text-xs text-lime">
                      Alcance: partido completo. El análisis de cuenca requiere un recorte espacial específico.
                    </p>
                  )}
                </td>
                <td className="p-4">{work.service}</td>
                <td className="p-4">{work.status ?? "Pendiente"}</td>
                <td className="p-4">
                  {work.progress === null ? "Pendiente" : `${work.progress}%`}
                </td>
                <td className="p-4">
                  {work.beneficiaries === null
                    ? "Pendiente"
                    : work.beneficiaries.toLocaleString("es-AR")}
                </td>
                <td className="p-4">{work.cutoff}</td>
                <td className="p-4">
                  {getSource(work.sourceId) && (
                    <SourceLink source={getSource(work.sourceId) as Source} compact />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!records.length && (
        <div
          role="status"
          className="flex flex-col items-start gap-3 border-b border-ink-foreground/15 py-8"
        >
          <Database className="h-6 w-6 text-lime" />
          <h3 className="text-lg font-semibold">
            {hasRecords
              ? "Búsqueda sin coincidencias"
              : "Inventario en proceso de consolidación"}
          </h3>
          <p className="max-w-2xl text-sm text-ink-muted">
            {hasRecords
              ? "Probá otra búsqueda o restablecé los filtros."
              : "La incorporación de fichas está pendiente de verificación de fuente, alcance y fecha. Los valores de obras, conexiones y beneficiarios se presentarán cuando estén validados."}
          </p>
          {source && (
            <Button asChild variant="labOutline">
              <a href={source.url} target="_blank" rel="noopener noreferrer">
                Consultar dataset ACUMAR <ArrowUpRight />
                <span className="sr-only">(nueva pestaña)</span>
              </a>
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
export function MethodologySection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-ink-foreground/15 py-8">
      <h2 className="text-2xl font-semibold">{title}</h2>
      <div className="mt-4 space-y-3 text-sm leading-relaxed text-ink-muted">{children}</div>
    </section>
  );
}
