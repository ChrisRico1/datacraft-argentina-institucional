import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Building2,
  CalendarClock,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  HardHat,
  MapPinned,
  Wallet,
} from "lucide-react";
import { primaryCtaHref } from "@/config/site";

export const Route = createFileRoute("/municipio-en-obra")({
  head: () => ({
    meta: [
      { title: "Municipio en Obra | Datacraft Argentina" },
      {
        name: "description",
        content:
          "Propuesta conceptual de Datacraft Argentina para la gestión, el seguimiento y la trazabilidad de obras públicas municipales.",
      },
      { property: "og:title", content: "Municipio en Obra | Datacraft Argentina" },
      {
        property: "og:description",
        content: "Gestión inteligente de infraestructura pública.",
      },
    ],
  }),
  component: MunicipioEnObra,
});

const ext = { target: "_blank", rel: "noopener noreferrer" } as const;

const kpis = [
  { label: "Obras en cartera", value: "24", detail: "Ejemplo ilustrativo" },
  { label: "En ejecución", value: "16", detail: "66,7 % de la cartera" },
  { label: "Avance físico medio", value: "58 %", detail: "Sobre obras activas" },
  { label: "Inversión prevista", value: "$ 2.480 M", detail: "Montos ficticios" },
];

const projects = [
  { name: "Pavimentación de calles", area: "Infraestructura vial", progress: 72, status: "En ejecución" },
  { name: "Ampliación de red de agua", area: "Saneamiento", progress: 48, status: "En ejecución" },
  { name: "Refacción de edificio escolar", area: "Equipamiento público", progress: 31, status: "Con demoras" },
  { name: "Nuevo centro de salud", area: "Salud", progress: 86, status: "En ejecución" },
];

const capabilities = [
  {
    icon: ClipboardCheck,
    title: "Cartera y seguimiento",
    text: "Organización de proyectos, responsables, etapas, hitos y evolución de cada obra.",
  },
  {
    icon: HardHat,
    title: "Inspección y evidencia",
    text: "Registro de visitas, avances informados, observaciones, fotografías y documentación.",
  },
  {
    icon: Wallet,
    title: "Control presupuestario",
    text: "Consulta de montos originales, contratos, modificaciones y certificaciones registradas.",
  },
  {
    icon: MapPinned,
    title: "Lectura territorial",
    text: "Visualización geográfica de las intervenciones y su distribución en el territorio.",
  },
  {
    icon: FileText,
    title: "Documentación trazable",
    text: "Información técnica y administrativa vinculada a cada proyecto y sus antecedentes.",
  },
  {
    icon: CalendarClock,
    title: "Plazos e hitos",
    text: "Seguimiento de cronogramas, vencimientos, demoras y fechas relevantes.",
  },
];

function MunicipioEnObra() {
  return (
    <div className="grid-lines min-h-screen bg-ink text-ink-foreground">
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-lime focus:px-4 focus:py-2 focus:text-lime-foreground"
      >
        Saltar al contenido
      </a>

      <header className="sticky top-0 z-50 border-b border-ink-foreground/10 bg-ink/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5">
          <Link to="/" className="flex items-center gap-2.5 font-display text-lg font-bold">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-lime text-lime-foreground">
              <Building2 className="h-5 w-5" />
            </span>
            <span>Datacraft <span className="font-normal text-ink-muted">Argentina</span></span>
          </Link>
          <nav className="hidden items-center gap-6 sm:flex" aria-label="Navegación">
            <Link to="/" className="text-sm text-ink-muted transition hover:text-lime">Inicio</Link>
            <a href="#propuesta" className="text-sm text-ink-muted transition hover:text-lime">La propuesta</a>
            <a href="#capacidades" className="text-sm text-ink-muted transition hover:text-lime">Capacidades</a>
            <a href="#demostracion" className="text-sm text-ink-muted transition hover:text-lime">Vista conceptual</a>
            <a href={primaryCtaHref} {...ext} className="rounded-full bg-lime px-4 py-2 text-sm font-semibold text-lime-foreground transition hover:brightness-105">
              Coordinar reunión <ArrowUpRight className="ml-1 inline h-4 w-4" />
            </a>
          </nav>
          <Link to="/" className="text-sm text-ink-muted hover:text-lime sm:hidden">Volver</Link>
        </div>
      </header>

      <main id="contenido">
        <section className="relative overflow-hidden border-b border-ink-foreground/10 bg-ink pt-20 pb-16 sm:pt-28 sm:pb-24">
          <div className="pointer-events-none absolute -right-40 top-0 h-[520px] w-[520px] rounded-full bg-lime/10 blur-[120px]" />
          <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 lg:grid-cols-[1fr_0.9fr]">
            <div>
              <p className="eyebrow inline-flex items-center gap-2 rounded-full border border-lime/30 px-3 py-1.5 text-lime">
                <span className="h-1.5 w-1.5 rounded-full bg-lime" />
                SOLUCIÓN PARA EL SECTOR PÚBLICO
              </p>
              <h1 className="mt-6 max-w-3xl text-4xl font-semibold leading-[1.04] sm:text-6xl">
                MUNICIPIO <span className="iridescent-text">EN OBRA</span>
              </h1>
              <p className="mt-5 text-xl font-medium text-mint sm:text-2xl">
                Gestión inteligente de infraestructura pública.
              </p>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-ink-muted sm:text-lg">
                Una propuesta de solución digital para centralizar proyectos de obra pública,
                seguir su ejecución y mejorar la trazabilidad de la inversión municipal.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a href={primaryCtaHref} {...ext} className="inline-flex items-center justify-center gap-2 rounded-full bg-lime px-6 py-3 text-sm font-semibold text-lime-foreground transition hover:-translate-y-0.5">
                  Coordinar una reunión <ArrowUpRight className="h-4 w-4" />
                </a>
                <a href="#demostracion" className="inline-flex items-center justify-center gap-2 rounded-full border border-ink-foreground/25 px-6 py-3 text-sm font-semibold text-ink-foreground transition hover:border-lime hover:text-lime">
                  Ver vista conceptual <ArrowRight className="h-4 w-4" />
                </a>
              </div>
              <p className="mt-5 text-xs text-ink-muted">
                Propuesta conceptual de Datacraft Argentina. Alcance y funcionalidades sujetos a definición con cada organismo.
              </p>
            </div>
            <div className="rounded-2xl border border-ink-foreground/10 bg-ink-2/80 p-4 shadow-2xl sm:p-5">
              <div className="flex items-center justify-between border-b border-ink-foreground/10 pb-4">
                <div>
                  <p className="text-xs text-ink-muted">VISTA DE REFERENCIA</p>
                  <p className="mt-1 font-semibold">Panel de obras públicas</p>
                </div>
                <span className="rounded-full border border-lime/30 px-3 py-1 text-[10px] font-semibold tracking-wide text-lime">DEMO CONCEPTUAL</span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {kpis.map((item) => (
                  <div key={item.label} className="rounded-xl border border-ink-foreground/10 bg-ink p-3">
                    <p className="text-xs text-ink-muted">{item.label}</p>
                    <p className="mt-2 font-display text-2xl font-semibold text-ink-foreground">{item.value}</p>
                    <p className="mt-1 text-[10px] text-ink-muted">{item.detail}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-xl border border-ink-foreground/10 bg-ink p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">Avance de cartera</p>
                  <span className="text-xs text-lime">Ejemplo</span>
                </div>
                <div className="mt-4 flex h-28 items-end gap-2">
                  {[35, 48, 42, 61, 55, 73, 68, 82, 76, 91, 86, 96].map((height, index) => (
                    <div key={index} className="flex-1 rounded-t-sm bg-sage/30">
                      <div className="rounded-t-sm bg-lime/80" style={{ height: `${height}%` }} />
                    </div>
                  ))}
                </div>
                <div className="mt-2 flex justify-between text-[10px] text-ink-muted">
                  <span>ENE</span><span>ABR</span><span>JUL</span><span>OCT</span><span>DIC</span>
                </div>
              </div>
              <p className="mt-3 text-[10px] leading-relaxed text-ink-muted">
                Datos ficticios utilizados exclusivamente para ilustrar una posible interfaz.
              </p>
            </div>
          </div>
        </section>

        <section id="propuesta" className="py-16 sm:py-24">
          <div className="mx-auto grid max-w-7xl gap-10 px-5 lg:grid-cols-2">
            <div>
              <p className="eyebrow text-lime">EL DESAFÍO</p>
              <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">La información de una obra no debería estar dispersa.</h2>
            </div>
            <div className="space-y-4 text-base leading-relaxed text-ink-muted">
              <p>
                La gestión de infraestructura pública involucra áreas técnicas, administrativas,
                responsables de inspección, contratistas y autoridades. Cuando los datos se
                distribuyen entre planillas, documentos y canales separados, cuesta reconstruir
                el estado real de cada proyecto.
              </p>
              <p>
                Municipio en Obra plantea una forma integrada de organizar esa información:
                desde los datos iniciales y el contrato hasta los avances, inspecciones,
                certificaciones y documentación de cierre.
              </p>
            </div>
          </div>
        </section>

        <section id="capacidades" className="bg-ink-2/50 py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-5">
            <p className="eyebrow text-lime">CAPACIDADES PROPUESTAS</p>
            <h2 className="mt-3 max-w-3xl text-3xl font-semibold sm:text-4xl">Una mirada completa sobre cada proyecto.</h2>
            <p className="mt-4 max-w-2xl text-ink-muted">
              Una solución a medida puede reunir información técnica, seguimiento operativo,
              documentación e indicadores en un mismo entorno de trabajo.
            </p>
            <div className="mt-9 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {capabilities.map(({ icon: Icon, title, text }) => (
                <article key={title} className="rounded-2xl border border-ink-foreground/10 bg-ink p-6 transition hover:border-lime/40">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-ink-foreground/10 text-lime">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 text-lg font-semibold">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="demostracion" className="py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-5">
            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <div>
                <p className="eyebrow text-lime">VISTA CONCEPTUAL</p>
                <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">Así podría organizarse una cartera de obras.</h2>
              </div>
              <p className="max-w-md text-sm leading-relaxed text-ink-muted">
                Ejemplo ilustrativo con proyectos y cifras ficticias. No corresponde a datos ni a una plataforma municipal en funcionamiento.
              </p>
            </div>
            <div className="mt-8 overflow-hidden rounded-2xl border border-ink-foreground/15 bg-ink-2/70">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink-foreground/10 px-5 py-4">
                <div>
                  <p className="font-semibold">Cartera de proyectos</p>
                  <p className="mt-1 text-xs text-ink-muted">Municipio demostrativo · Información ficticia</p>
                </div>
                <span className="rounded-full border border-lime/30 px-3 py-1 text-[10px] font-semibold text-lime">MUESTRA VISUAL</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[680px] text-left text-sm">
                  <thead className="bg-ink text-xs text-ink-muted">
                    <tr>
                      <th className="px-5 py-3 font-medium">Proyecto</th>
                      <th className="px-5 py-3 font-medium">Área</th>
                      <th className="px-5 py-3 font-medium">Avance ilustrativo</th>
                      <th className="px-5 py-3 font-medium">Situación</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map((project) => (
                      <tr key={project.name} className="border-t border-ink-foreground/10">
                        <td className="px-5 py-4 font-medium">{project.name}</td>
                        <td className="px-5 py-4 text-ink-muted">{project.area}</td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-1.5 w-24 overflow-hidden rounded-full bg-ink-foreground/10">
                              <div className="h-full rounded-full bg-lime" style={{ width: `${project.progress}%` }} />
                            </div>
                            <span className="text-xs tabular-nums text-ink-muted">{project.progress}%</span>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`rounded-full px-2.5 py-1 text-xs ${project.status === "Con demoras" ? "bg-amber-400/10 text-amber-300" : "bg-lime/10 text-lime"}`}>
                            {project.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="grid gap-4 border-t border-ink-foreground/10 p-5 md:grid-cols-[1.1fr_0.9fr]">
                <div className="rounded-xl border border-ink-foreground/10 bg-ink p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">Distribución territorial</p>
                    <MapPinned className="h-4 w-4 text-lime" />
                  </div>
                  <div className="relative mt-3 h-48 overflow-hidden rounded-lg bg-[#182b2c]">
                    <svg viewBox="0 0 600 260" className="h-full w-full" role="img" aria-label="Mapa esquemático ilustrativo con ubicaciones de obras">
                      <path d="M-20 70 L620 210 M20 -20 L260 280 M180 -20 L430 280 M400 -20 L590 280 M-20 190 L620 30" stroke="#54706a" strokeWidth="7" opacity=".45" fill="none" />
                      <path d="M-20 70 L620 210 M20 -20 L260 280 M180 -20 L430 280 M400 -20 L590 280 M-20 190 L620 30" stroke="#b4c8b8" strokeWidth="1.5" opacity=".65" fill="none" />
                      {[[110,85],[230,145],[345,75],[455,175],[510,95],[300,210],[170,215]].map(([x,y],i) => (
                        <g key={i}>
                          <circle cx={x} cy={y} r="12" fill="#c8f36a" opacity=".18" />
                          <circle cx={x} cy={y} r="5" fill="#c8f36a" stroke="#172522" strokeWidth="2" />
                        </g>
                      ))}
                    </svg>
                    <span className="absolute bottom-3 left-3 rounded bg-ink/80 px-2 py-1 text-[10px] text-ink-muted">Esquema territorial ficticio</span>
                  </div>
                </div>
                <div className="rounded-xl border border-ink-foreground/10 bg-ink p-4">
                  <p className="text-sm font-semibold">Información vinculada</p>
                  <ul className="mt-4 space-y-3 text-sm text-ink-muted">
                    {["Ficha técnica y contractual", "Cronograma y etapas", "Avances e inspecciones", "Certificaciones registradas", "Documentos y evidencias"].map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-lime" /> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <p className="mt-3 text-xs text-ink-muted">
              La interfaz, los indicadores, los nombres de proyectos y el mapa son recursos demostrativos creados para explicar el concepto.
            </p>
          </div>
        </section>

        <section className="border-y border-ink-foreground/10 bg-ink-2/50 py-16 sm:py-20">
          <div className="mx-auto grid max-w-7xl gap-10 px-5 lg:grid-cols-[1fr_0.8fr] lg:items-center">
            <div>
              <p className="eyebrow text-lime">DESARROLLO A MEDIDA</p>
              <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">Cada municipio tiene procesos, prioridades y necesidades propias.</h2>
              <p className="mt-5 max-w-2xl leading-relaxed text-ink-muted">
                La propuesta se puede adaptar a la estructura de cada organismo, sus circuitos
                administrativos, fuentes de información y criterios de seguimiento. El alcance
                se define en conjunto, a partir de un diagnóstico.
              </p>
            </div>
            <div className="rounded-2xl border border-ink-foreground/10 bg-ink p-6">
              <p className="font-semibold">¿Querés evaluar una solución para tu municipio?</p>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                Coordinemos una reunión para conversar sobre los procesos actuales y las posibilidades de mejora.
              </p>
              <a href={primaryCtaHref} {...ext} className="mt-6 inline-flex items-center gap-2 rounded-full bg-lime px-5 py-3 text-sm font-semibold text-lime-foreground transition hover:brightness-105">
                Coordinar una reunión <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-8">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-ink-muted transition hover:text-lime">
            <ArrowLeft className="h-4 w-4" /> Volver a Datacraft Argentina
          </Link>
        </section>
      </main>

      <footer className="border-t border-ink-foreground/10 bg-carbon py-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 text-sm text-ink-muted">
          <p>© {new Date().getFullYear()} Datacraft Argentina · DATACRAFT LAB</p>
          <Link to="/" className="inline-flex items-center gap-2 transition hover:text-lime">
            <ArrowLeft className="h-4 w-4" /> Volver a Datacraft
          </Link>
        </div>
      </footer>
    </div>
  );
}
