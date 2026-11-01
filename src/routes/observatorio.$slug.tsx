import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowUpRight, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  sources,
  observatories,
  municipalReferences,
  getSource,
} from "@/features/observatorio/catalog";
import { emptyFilters, filterWorks, loadWorksData } from "@/features/observatorio/data";
import type { Work } from "@/features/observatorio/types";
import {
  StudyFilters,
  StudyMap,
  WorksTable,
  SourceLink,
  MethodologySection,
} from "@/features/observatorio/components";

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
function CloacalStudy() {
  const project = Route.useLoaderData();
  const [filters, setFilters] = useState(emptyFilters);
  const [works, setWorks] = useState<Work[]>([]);
  useEffect(() => {
    loadWorksData().then(setWorks).catch((error) => console.error("No se pudo cargar el inventario ACUMAR", error));
  }, []);
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
          Un estudio para entender cómo se distribuye el servicio cloacal en la Cuenca Matanza-Riachuelo,
          con foco en la Cuenca Baja, y conocer las obras de saneamiento que se realizan en el territorio.
        </p>
        <p className="mt-5 max-w-3xl text-sm text-ink-muted">
          La información se consulta a partir de fuentes públicas oficiales. El estudio distingue la
          cobertura de la red cloacal de las viviendas que efectivamente están conectadas.
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
        <div className="mt-9 rounded-2xl border border-lime/30 bg-ink-2/60 p-6 sm:p-8">
          <p className="eyebrow text-lime">Objetivo del estudio</p>
          <h2 className="mt-3 max-w-3xl text-2xl font-semibold sm:text-3xl">
            Conocer la cobertura cloacal en la Cuenca Baja
          </h2>
          <p className="mt-4 max-w-3xl leading-relaxed text-ink-muted">
            Buscamos mostrar en qué zonas está disponible la red cloacal, cómo se distribuye en el
            territorio y dónde se localizan las obras de saneamiento. El foco está puesto en la
            Cuenca Baja, sin perder de vista el contexto de toda la cuenca.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div>
              <p className="font-semibold">Cobertura de red</p>
              <p className="mt-1 text-sm text-ink-muted">Dónde llega la infraestructura cloacal.</p>
            </div>
            <div>
              <p className="font-semibold">Obras de saneamiento</p>
              <p className="mt-1 text-sm text-ink-muted">Qué intervenciones se realizan y dónde.</p>
            </div>
            <div>
              <p className="font-semibold">Lectura territorial</p>
              <p className="mt-1 text-sm text-ink-muted">Cómo se distribuye el servicio entre sectores y municipios.</p>
            </div>
          </div>
        </div>
        <div className="mt-6 rounded-xl border border-ink-foreground/15 p-5">
          <p className="font-semibold">Cobertura cloacal · Cuenca Baja</p>
          <p className="mt-2 max-w-3xl text-sm text-ink-muted">
            Para consultar la cobertura territorial de la red, accedé al visualizador oficial de
            ACUMAR. Allí podés explorar las capas de cobertura y expansión del servicio.
          </p>
          {pisa && (
            <a href={pisa.url} target="_blank" rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-2 text-sm text-mint hover:text-lime">
              Consultar cobertura en Monitor PISA <ArrowUpRight className="h-4 w-4" />
              <span className="sr-only">(nueva pestaña)</span>
            </a>
          )}
        </div>
      </section>
      <section className="border-y border-ink-foreground/10 bg-carbon/70 py-12">
        <div className="mx-auto max-w-7xl px-5">
          <p className="eyebrow text-lime">El territorio</p>
          <h2 className="mt-3 text-3xl font-semibold">La Cuenca Matanza-Riachuelo y sus municipios</h2>
          <p className="mb-6 mt-4 max-w-3xl text-sm text-ink-muted">
            La cuenca comprende partes de 14 municipios bonaerenses y de la Ciudad Autónoma de
            Buenos Aires. El mapa ubica sus centros urbanos como referencia: no representa los
            límites exactos de la cuenca ni la cobertura de la red cloacal.
          </p>
          <StudyMap municipality={filters.municipality} />
          {pisa && (
            <div className="mt-4">
              <SourceLink source={pisa} />
            </div>
          )}
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-5 pb-12">
        <p className="eyebrow text-lime">Obras</p>
        <h2 className="mt-3 text-3xl font-semibold">Obras de saneamiento cloacal</h2>
        <p className="mt-4 max-w-3xl text-sm text-ink-muted">
          Este apartado reúne las intervenciones vinculadas al servicio cloacal. Se excluyen las
          obras de agua potable para mantener clara la información sobre saneamiento.
        </p>
        <p className="mt-3 max-w-3xl rounded-lg border border-ink-foreground/15 p-4 text-sm text-ink-muted">
          El municipio informado por ACUMAR no determina el sector de cuenca ni la ubicación puntual
          de la obra. Los registros se presentan como referencias jurisdiccionales y no implican
          que todas las obras estén confirmadas dentro de la Cuenca Baja.
        </p>
        <WorksTable
          records={records}
          hasRecords={works.some((work) => work.service === "Cloacal")}
          filters={filters}
          onChange={setFilters}
        />
      </section>
      <div className="mx-auto grid max-w-7xl gap-x-12 px-5 lg:grid-cols-2">
        <MethodologySection id="que-medimos" title="Qué información se analiza">
          <p>
            Se observan tres aspectos: la cobertura territorial de la red cloacal, la conexión de
            viviendas u hogares al servicio y las obras de saneamiento. Son dimensiones relacionadas,
            pero no equivalentes.
          </p>
          <p>
            La cobertura indica dónde está disponible la red. La conexión efectiva indica qué
            viviendas u hogares están conectados. Las obras permiten conocer las intervenciones que
            amplían, mejoran o mantienen la infraestructura.
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
            La cuenca no coincide con los límites completos de los municipios: comprende solo una
            parte de cada uno. Por eso, los datos de un municipio completo no deben interpretarse
            automáticamente como datos de la cuenca.
          </p>
          <p>
            La Cuenca Baja es el foco principal de este estudio y se analiza dentro del sistema
            completo de la Cuenca Matanza-Riachuelo.
          </p>
        </MethodologySection>
     </div>
      <section className="mx-auto max-w-7xl border-t border-ink-foreground/15 px-5 py-10">
        <p className="eyebrow text-lime">Fuentes públicas</p>
        <h2 className="mt-3 text-3xl font-semibold">Fuentes y trazabilidad</h2>
        <p className="mt-4 text-sm text-ink-muted">
          La información se consulta en organismos oficiales. Cada fuente permite ampliar los datos
          y conocer su alcance.
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
