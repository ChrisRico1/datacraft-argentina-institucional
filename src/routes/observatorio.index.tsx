import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, BarChart3, Building2 } from "lucide-react";
import { observatories } from "@/features/observatorio/catalog";
import { ProjectCard } from "@/features/observatorio/components";

const title = "Proyectos | Datacraft Argentina";
const description =
  "Proyectos demostrativos de Datacraft Argentina: análisis territorial y soluciones digitales para la gestión pública.";
export const Route = createFileRoute("/observatorio/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "https://datacraft-argentina.lovable.app/observatorio" },
    ],
    links: [{ rel: "canonical", href: "https://datacraft-argentina.lovable.app/observatorio" }],
  }),
  component: ObservatoryIndex,
});
function ObservatoryIndex() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-ink-foreground/15 py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-5">
          <p className="eyebrow text-lime">DATACRAFT LAB / PROYECTOS</p>
          <h1 className="mt-6 max-w-5xl text-4xl font-semibold leading-tight sm:text-6xl">
            Ideas y tecnología para transformar la gestión.
            <br />
            <span className="text-lime">Proyectos que muestran lo que podemos hacer.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted">
            Proyectos demostrativos que combinan análisis territorial, datos y soluciones
            digitales para responder a desafíos de organizaciones públicas y privadas.
          </p>
          <div className="mt-10 flex flex-wrap gap-x-10 gap-y-3 border-t border-ink-foreground/15 pt-5 text-xs text-mint">
            <span>01 / DATOS</span>
            <span>02 / TECNOLOGÍA</span>
            <span>03 / SOLUCIONES A MEDIDA</span>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-5 py-12 sm:py-16">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="eyebrow text-lime">PROYECTOS DESTACADOS</p>
            <h2 className="mt-3 text-3xl font-semibold">Proyectos</h2>
          </div>
          <p className="text-sm text-ink-muted">Soluciones demostrativas · desarrollos a medida</p>
        </div>
        <div className="grid items-stretch gap-5 md:grid-cols-2">
          <article className="flex flex-col rounded-2xl border border-ink-foreground/10 bg-ink-2/50 p-7 transition hover:border-lime/40">
            <div className="flex items-start justify-between gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-ink-foreground/10">
                <BarChart3 className="h-6 w-6 text-lime" />
              </span>
              <span className="eyebrow rounded-full bg-ink-foreground/10 px-3 py-1.5">
                En desarrollo
              </span>
            </div>
            <p className="mt-6 text-xs text-lime">Datos e inteligencia</p>
            <h2 className="mt-2 text-2xl font-semibold">Radar Estadístico Argentina</h2>
            <p className="mt-4 text-sm leading-relaxed text-ink-muted">
              Una plataforma para explorar estadísticas oficiales de economía, sociedad,
              comercio exterior y demografía, con información del INDEC.
            </p>
            <ul className="my-6 space-y-2 text-sm text-ink-muted">
              <li>Indicadores oficiales y trazabilidad</li>
              <li>Exploración temática y visualización de datos</li>
            </ul>
            <Link
              to="/observatorio/radar-estadistico-argentina"
              className="mt-auto inline-flex w-fit items-center gap-2 pt-2 text-sm font-semibold text-lime hover:gap-3"
            >
              Explorar proyecto <ArrowUpRight className="h-4 w-4" />
            </Link>
          </article>
          {observatories.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
          <article className="flex flex-col rounded-2xl border border-ink-foreground/10 bg-ink-2/50 p-7 transition hover:border-lime/40">
            <div className="flex items-start justify-between gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-ink-foreground/10">
                <Building2 className="h-6 w-6 text-lime" />
              </span>
              <span className="eyebrow rounded-full bg-ink-foreground/10 px-3 py-1.5">
                Propuesta conceptual
              </span>
            </div>
            <h2 className="mt-6 text-2xl font-semibold">Municipio en Obra</h2>
            <p className="mt-4 text-sm leading-relaxed text-ink-muted">
              Una propuesta de gestión inteligente para organizar proyectos de infraestructura
              pública y mejorar su seguimiento y trazabilidad.
            </p>
            <Link
              to="/municipio-en-obra"
              className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-semibold text-lime hover:gap-3"
            >
              Conocer la propuesta <ArrowUpRight className="h-4 w-4" />
            </Link>
          </article>
        </div>
      </section>
    </>
  );
}
