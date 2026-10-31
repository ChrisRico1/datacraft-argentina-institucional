import { createFileRoute } from "@tanstack/react-router";
import { CircleDashed } from "lucide-react";
import { ProjectCard } from "@/features/observatorio/components";
import { observatories } from "@/features/observatorio/catalog";

const title = "Observatorio | Datos y territorio · Datacraft Argentina";
const description = "Investigaciones, tableros y visualizaciones basadas en fuentes públicas, con metodología transparente. Observatorio de Datacraft Argentina.";
export const Route = createFileRoute("/observatorio/")({
  head: () => ({ meta: [{ title }, { name: "description", content: description }, { property: "og:title", content: title }, { property: "og:description", content: description }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }, { property: "og:url", content: "https://datacraft-argentina.lovable.app/observatorio" }], links: [{ rel: "canonical", href: "https://datacraft-argentina.lovable.app/observatorio" }] }),
  component: ObservatoryIndex,
});
function ObservatoryIndex() {
  return <>
    <section className="relative overflow-hidden border-b border-ink-foreground/15 py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-5">
        <p className="eyebrow text-lime">DATACRAFT LAB / OBSERVATORIO</p>
        <h1 className="mt-6 max-w-5xl text-4xl font-semibold leading-tight sm:text-6xl">Datos para entender el territorio.<br /><span className="text-lime">Información para decidir.</span></h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted">Investigaciones, tableros y visualizaciones basadas en fuentes públicas, con metodología transparente.</p>
        <div className="mt-10 flex flex-wrap gap-x-10 gap-y-3 border-t border-ink-foreground/15 pt-5 text-xs text-mint"><span>01 / FUENTES PÚBLICAS</span><span>02 / LECTURA TERRITORIAL</span><span>03 / TRAZABILIDAD</span></div>
      </div>
    </section>
    <section className="mx-auto max-w-7xl px-5 py-12 sm:py-16">
      <div className="mb-7 flex flex-wrap items-end justify-between gap-3"><div><p className="eyebrow text-lime">Catálogo de estudios</p><h2 className="mt-3 text-3xl font-semibold">Observatorios</h2></div><p className="text-sm text-ink-muted">Estudios abiertos · evidencia en construcción</p></div>
      <div className="grid items-stretch gap-5 md:grid-cols-2">
        {observatories.map((project) => <ProjectCard key={project.slug} project={project} />)}
        <article className="flex flex-col rounded-2xl border border-dashed border-ink-foreground/20 bg-ink-2/30 p-7"><div className="flex items-start justify-between gap-3"><span className="grid h-12 w-12 place-items-center rounded-xl bg-ink-foreground/10"><CircleDashed className="h-6 w-6" /></span><span className="eyebrow rounded-full bg-ink-foreground/10 px-3 py-1.5">Próximamente</span></div><h2 className="mt-6 text-2xl font-semibold">Próximos estudios</h2><p className="mt-4 text-sm text-ink-muted">Nuevas investigaciones de Datacraft Lab. El tema, alcance y fuentes se publicarán cuando estén definidos.</p><ul className="mt-6 text-sm text-ink-muted"><li>Sin estudios adicionales anunciados</li></ul></article>
      </div>
    </section>
  </>;
}