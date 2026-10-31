import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ArrowUpRight, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  sources,
  observatories,
  municipalReferences,
  getSource,
} from "@/features/observatorio/catalog";
import { emptyFilters, filterWorks, works, metrics } from "@/features/observatorio/data";
import {
  Kpi,
  EmptyChart,
  StudyFilters,
  StudyMap,
  WorksTable,
  SourceLink,
  MethodologySection,
} from "@/features/observatorio/components";
import type { Metric } from "@/features/observatorio/types";

export const Route = createFileRoute("/observatorio/$slug")({
  loader: ({ params }) => {
    const project = observatories.find((item) => item.slug === params.slug);
    if (!project) throw notFound();
    return project;
  },
  head: ({ loaderData }) => {
    const title = loaderData
      ? `${loaderData.title} | ${loaderData.zone} · Datacraft`
      : "Estudio no disponible · Datacraft Argentina";
    const description =
      loaderData?.description ??
      "Este estudio no está disponible en el Observatorio de Datacraft Argentina.";
    const url = loaderData
      ? `https://datacraft-argentina.lovable.app/observatorio/${loaderData.slug}`
      : undefined;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
        ...(url
          ? [{ property: "og:url", content: url }]
          : [{ name: "robots", content: "noindex" }]),
      ],
      links: url ? [{ rel: "canonical", href: url }] : [],
    };
  },
  component: CloacalStudy,
  notFoundComponent: () => (
    <div className="mx-auto max-w-7xl px-5 py-20">
      <h1 className="text-3xl font-semibold">No encontramos este observatorio</h1>
      <Button asChild variant="lab" className="mt-6">
        <Link to="/observatorio">
          Volver al Observatorio <ArrowLeft />
        </Link>
      </Button>
    </div>
  ),
  errorComponent: ({ reset }) => (
    <div className="mx-auto max-w-7xl px-5 py-20">
      <h1 className="text-3xl">No pudimos cargar el estudio</h1>
      <Button variant="lab" onClick={reset} className="mt-6">
        Reintentar
      </Button>
      <Link to="/observatorio" className="ml-5 text-lime">
        Volver al Observatorio
      </Link>
    </div>
  ),
});
const pendingMetrics: Metric[] = [
  {
    id: "coverage",
    label: "Desagüe del inodoro a red pública",
    value: null,
    unit: "% de viviendas u hogares; universo oficial por confirmar",
    year: "Censo 2022",
    scope: "Cuenca: intersección espacial pendiente",
    sourceId: "census",
  },
  {
    id: "works",
    label: "Obras exclusivamente cloacales",
    value: null,
    unit: "obras",
    year: "Recursos 2024–2025",
    scope: "Registros de cuenca por verificar",
    sourceId: "works-2025",
  },
  {
    id: "progress",
    label: "Avance por obra",
    value: null,
    unit: "% informado individualmente por obra",
    year: "Fecha de corte de cada ficha",
    scope: "Obras cloacales de cuenca",
    sourceId: "works-2025",
  },
  {
    id: "beneficiaries",
    label: "Beneficiarios informados",
    value: null,
    unit: "personas según ficha; total sujeto a revisión de solapamientos",
    year: "Fecha de corte de cada ficha",
    scope: "Obras cloacales de cuenca",
    sourceId: "works-2025",
  },
];
function CloacalStudy() {
  const project = Route.useLoaderData();
  const [filters, setFilters] = useState(emptyFilters);
  const records = filterWorks(works, filters);
  const source = getSource("works-2025");
  const pisa = getSource("pisa");
  return (
    <>
      <section className="mx-auto max-w-7xl px-5 py-12 sm:py-16">
        <Link
          to="/observatorio"
          className="inline-flex items-center gap-2 text-sm text-ink-muted hover:text-lime"
        >
          <ArrowLeft className="h-4 w-4" /> Todos los observatorios
        </Link>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <p className="eyebrow text-lime">DATACRAFT LAB / INFRAESTRUCTURA Y TERRITORIO</p>
          <span className="rounded-full bg-ink-foreground/10 px-3 py-1 text-xs">
            {project.status}
          </span>
        </div>
        <h1 className="mt-5 max-w-5xl text-4xl font-semibold leading-tight sm:text-5xl">
          {project.title}
          <span className="mt-2 block text-mint">{project.zone}</span>
        </h1>
        <p className="mt-5 max-w-3xl text-lg text-ink-muted">
          Cobertura de saneamiento y seguimiento de obras, con fuentes públicas y una lectura
          territorial con fuentes, fechas de referencia y alcance documentados.
        </p>
        <p className="mt-5 text-sm text-ink-muted">
          Publicación de la fuente:{" "}
          <span className="font-medium text-ink-foreground">publicación ACUMAR 12/12/2025</span> ·
          Frecuencia anual.
          <br />
          Los recursos corresponden al segundo semestre de 2024 y 2025. La fecha de referencia de
          cada obra se incorporará junto con su ficha validada.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          {pisa && (
            <Button asChild variant="lab">
              <a href={pisa.url} target="_blank" rel="noopener noreferrer">
                Abrir Monitor PISA <ArrowUpRight />
                <span className="sr-only">(nueva pestaña)</span>
              </a>
            </Button>
          )}
          {source && (
            <Button asChild variant="labOutline">
              <a href={source.url} target="_blank" rel="noopener noreferrer">
                Consultar datos de obras <ArrowUpRight />
                <span className="sr-only">(nueva pestaña)</span>
              </a>
            </Button>
          )}
        </div>
        <aside className="mt-8 flex gap-3 border-l-2 border-lime bg-ink-2/60 p-5">
          <Info className="mt-1 h-5 w-5 shrink-0 text-lime" />
          <div>
            <p className="font-semibold">El análisis de cuenca comprende porciones de cada jurisdicción.</p>
            <p className="mt-2 text-sm text-ink-muted">
              Abarca parte de 14 municipios bonaerenses y atraviesa CABA, tratada como jurisdicción
              diferenciada. Los datos municipales del Censo 2022 son{" "}
              <strong className="text-ink-foreground">
                 referencia del partido completo; el indicador de cuenca requiere un recorte espacial específico
              </strong>
              .
            </p>
          </div>
        </aside>
        <div className="mt-10 grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
          {(metrics.length ? metrics : pendingMetrics).map((metric) => (
            <Kpi key={metric.id} metric={metric} />
          ))}
        </div>
      </section>
      <section className="border-y border-ink-foreground/10 bg-carbon/70 py-12">
        <div className="mx-auto max-w-7xl px-5">
          <p className="eyebrow text-lime">Lectura territorial</p>
          <h2 className="mt-3 text-3xl font-semibold">Mapa de referencias municipales</h2>
          <p className="mb-6 mt-4 max-w-3xl text-sm text-ink-muted">
             Los puntos ubican centros urbanos aproximados para orientar la navegación municipal,
             con pertenencia a la cuenca por verificar. La delimitación oficial, las obras y la
             cobertura de red se consultan en Monitor PISA; la integración del polígono oficial a
             esta vista está pendiente. La selección municipal centra el mapa; los filtros de
             sector y tipo corresponden al inventario.
          </p>
          <StudyFilters value={filters} onChange={setFilters} records={works} />
          <StudyMap municipality={filters.municipality} />
          {pisa && (
            <div className="mt-4">
              <SourceLink source={pisa} />
            </div>
          )}
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-5 py-12">
        <p className="eyebrow text-lime">Indicadores y seguimiento</p>
        <h2 className="mt-3 text-3xl font-semibold">Cobertura y obras</h2>
        <div className="mt-7 grid gap-8 md:grid-cols-2">
          <EmptyChart
            title="Cobertura / servicio cloacal"
            sourceId="census"
             description="La serie de cuenca está pendiente de validación espacial. Se utilizará el Censo 2022, con variable, universo y denominador de viviendas u hogares confirmados en la tabla oficial. Los porcentajes municipales corresponden al partido completo."
          />
          <EmptyChart
            title="Estado y avance de obras"
            sourceId="works-2025"
             description="El inventario cloacal está pendiente de validación. El seguimiento presentará el estado y avance individual de cada obra con su fecha de referencia; las comparaciones identificarán los períodos de cada ficha. El agua potable se analiza como servicio separado."
          />
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-5 pb-12">
        <p className="eyebrow text-lime">Inventario trazable</p>
        <h2 className="mt-3 text-3xl font-semibold">Obras de saneamiento cloacal</h2>
        <p className="mt-4 text-sm text-ink-muted">
          Servicio cloacal únicamente · unidad: obra · alcance y fecha de corte por registro ·
          fuente vinculada en cada fila.
        </p>
        <WorksTable
          records={records}
          hasRecords={works.some((work) => work.service === "Cloacal")}
          filters={filters}
          onChange={setFilters}
        />
      </section>
      <div className="mx-auto grid max-w-7xl gap-x-12 px-5 lg:grid-cols-2">
        <MethodologySection id="que-medimos" title="Qué estamos midiendo">
          <p>
            La variable censal oficial de desagüe del inodoro a red pública, la disponibilidad
             territorial de red cloacal y el estado de obras de saneamiento. Cada dimensión se
             analiza con su indicador y fuente específicos.
          </p>
          <p>
            El Censo 2022 mide viviendas u hogares según el universo de la tabla oficial. Ese
             universo y su denominador se verifican antes de calcular porcentajes. Los avances de
             obras y la población beneficiaria corresponden a las fichas de seguimiento de obras.
          </p>
        </MethodologySection>
        <MethodologySection id="metodologia-estudio" title="Metodología">
          <ol className="list-decimal space-y-2 pl-5">
            <li>
              Universo: porción de cuenca en los 14 municipios bonaerenses y CABA, diferenciada.
            </li>
            <li>
              Unidad espacial ideal: radios censales 2022 intersectados con el polígono
              hidrográfico/jurisdiccional oficial.
            </li>
            <li>
               Verificar escala, variable, universo y fecha de cada fuente. Una estimación de
               conexiones mediante prorrateo por superficie requiere supuestos documentados y
               validación específica.
            </li>
            <li>Clasificar el servicio: agua potable y cloacas se mantienen separados.</li>
            <li>
              Etiquetar visualizaciones con año de referencia, unidad, cobertura territorial y
               fuente; identificar los distintos cortes en cada comparación.
            </li>
          </ol>
        </MethodologySection>
        <MethodologySection id="alcance" title="Alcance territorial">
          <p>
            Participan parcialmente:{" "}
            {municipalReferences
              .filter((ref) => ref.jurisdiction === "PBA")
              .map((ref) => ref.name)
              .join(", ")}
            . Además, CABA como jurisdicción diferenciada.
          </p>
          <p>
             Para el análisis territorial se utiliza la delimitación hidrográfica/jurisdiccional
             oficial, que comprende porciones de los municipios. Su integración cartográfica a
             esta vista está pendiente.
          </p>
          <p className="font-semibold text-lime">
             Los datos de partido completo se presentan a escala municipal; los indicadores de
             cuenca requieren el recorte espacial correspondiente.
          </p>
        </MethodologySection>
         <MethodologySection id="limitaciones" title="Estado de los datos y criterios de lectura">
          <ul className="list-disc space-y-2 pl-5">
            <li>
               La cartografía de esta vista utiliza referencias urbanas aproximadas como orientación.
               La geometría oficial está disponible para consulta en Monitor PISA y pendiente de
               integración al estudio.
            </li>
            <li>
               El inventario de obras, beneficiarios y series censales está pendiente de validación
               y carga. «Dato pendiente» identifica un valor aún por verificar; el cero corresponde
               a un valor cuantitativo confirmado por la fuente.
            </li>
             <li>
               La cobertura de red describe áreas con disponibilidad del servicio; las conexiones
               efectivas describen viviendas u hogares conectados y requieren su propia medición.
             </li>
            <li>
               El estado del Monitor PISA corresponde a la fecha de referencia indicada en cada
               capa o ficha.
            </li>
            <li>
               Los beneficiarios se informan por obra. Un total consolidado requiere verificar
               solapamientos entre fichas y contabilizar cada persona una sola vez.
            </li>
          </ul>
        </MethodologySection>
      </div>
      <section className="mx-auto max-w-7xl border-t border-ink-foreground/15 px-5 py-10">
        <p className="eyebrow text-lime">Fuentes públicas</p>
        <h2 className="mt-3 text-3xl font-semibold">Fuentes y trazabilidad</h2>
        <p className="mt-4 text-sm text-ink-muted">
          Fuentes documentales publicadas, referencias municipales aproximadas y datos cuantitativos
          pendientes se identifican por separado. Fecha de publicación no equivale a fecha de corte
          de cada registro.
        </p>
        <div className="mt-6 grid gap-x-12 gap-y-3 md:grid-cols-2">
          {sources
            .filter((sourceItem) => project.sourceIds.includes(sourceItem.id))
            .map((sourceItem) => (
              <div key={sourceItem.id} className="border-t border-ink-foreground/10 pt-3">
                <SourceLink source={sourceItem} />
              </div>
            ))}
        </div>
        <Button asChild variant="labOutline" className="mt-8">
          <Link to="/observatorio">
            <ArrowLeft /> Volver al Observatorio
          </Link>
        </Button>
      </section>
    </>
  );
}
