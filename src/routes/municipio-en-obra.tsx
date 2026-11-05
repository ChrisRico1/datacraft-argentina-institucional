import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowUpRight,
  Building2,
  CalendarClock,
  Camera,
  ChartNoAxesCombined,
  ClipboardCheck,
  FileCheck2,
  MapPinned,
  ShieldCheck,
  Wallet,
} from "lucide-react";

import { ObservatoryShell } from "@/features/observatorio/components";

const title = "Municipio en Obra | Gestión inteligente de infraestructura pública";
const description =
  "Propuesta conceptual de Datacraft Argentina para organizar, visualizar y dar seguimiento a proyectos de obra pública municipal.";

export const Route = createFileRoute("/municipio-en-obra")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "es_AR" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "canonical",
        href: "https://datacraft-argentina.lovable.app/municipio-en-obra",
      },
    ],
  }),
  component: MunicipioEnObraPage,
});

const modules = [
  {
    icon: Building2,
    number: "01",
    title: "Cartera de obras",
    text: "Un registro centralizado de proyectos, ubicación, responsables, contratistas y estado de ejecución.",
  },
  {
    icon: CalendarClock,
    number: "02",
    title: "Planificación y plazos",
    text: "Etapas, cronogramas, hitos y fechas relevantes para comprender qué está previsto y qué requiere atención.",
  },
  {
    icon: ChartNoAxesCombined,
    number: "03",
    title: "Seguimiento de avances",
    text: "Evolución física informada y validada, con antecedentes para comparar lo planificado con lo ejecutado.",
  },
  {
    icon: Wallet,
    number: "04",
    title: "Control presupuestario",
    text: "Presupuesto, montos contractuales, modificaciones y certificaciones en una lectura económica común.",
  },
  {
    icon: ClipboardCheck,
    number: "05",
    title: "Inspecciones y observaciones",
    text: "Registro de visitas, informes, hallazgos y acciones pendientes asociados a cada obra.",
  },
  {
    icon: FileCheck2,
    number: "06",
    title: "Documentación y trazabilidad",
    text: "Documentos, fotografías y antecedentes organizados por proyecto, con registro de sus actualizaciones.",
  },
];

const stages = [
  ["Planificación", "Proyecto, alcance y cronograma"],
  ["Contratación", "Empresa, contrato y documentación"],
  ["Ejecución", "Avances, inspecciones y evidencias"],
  ["Control", "Certificaciones y desvíos"],
  ["Cierre", "Recepción y antecedentes finales"],
];

const sampleWorks = [
  {
    name: "Pavimentación de calles",
    zone: "Sector norte · Ejemplo",
    type: "Vialidad",
    status: "En ejecución",
    progress: 68,
    color: "bg-lime",
  },
  {
    name: "Ampliación de red pluvial",
    zone: "Barrio centro · Ejemplo",
    type: "Desagües",
    status: "En ejecución",
    progress: 42,
    color: "bg-sky",
  },
  {
    name: "Nuevo espacio comunitario",
    zone: "Sector oeste · Ejemplo",
    type: "Equipamiento",
    status: "Planificada",
    progress: 12,
    color: "bg-mint",
  },
];

function SectionTitle({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string;
  title: string;
  text: string;
}) {
  return (
    <div className="max-w-3xl">
      <p className="eyebrow text-lime">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">{title}</h2>
      <p className="mt-4 text-base leading-relaxed text-ink-muted sm:text-lg">{text}</p>
    </div>
  );
}

function MunicipioEnObraPage() {
  return (
    <ObservatoryShell>
      <>

        <section className="relative overflow-hidden border-b border-ink-foreground/10 py-16 sm:py-24">
          <div className="pointer-events-none absolute -right-32 top-10 h-96 w-96 rounded-full bg-lime/5 blur-3xl" />
          <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 lg:grid-cols-[1fr_1.05fr]">
            <div>
              <p className="eyebrow text-lime">DATACRAFT LAB / SOLUCIÓN PARA EL SECTOR PÚBLICO</p>
              <p className="mt-7 text-sm font-medium tracking-[0.18em] text-mint">
                INFRAESTRUCTURA · GESTIÓN · TRAZABILIDAD
              </p>
              <h1 className="mt-4 max-w-2xl text-4xl font-semibold leading-tight sm:text-6xl">
                MUNICIPIO
                <br />
                <span className="text-lime">EN OBRA.</span>
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-muted">
                Una propuesta de gestión inteligente para organizar proyectos de infraestructura
                pública, seguir su ejecución y mejorar la trazabilidad de la inversión municipal.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/"
                  hash="contacto"
                  className="group inline-flex items-center gap-2 rounded-full bg-lime px-6 py-3 text-sm font-semibold text-lime-foreground transition hover:-translate-y-0.5 hover:brightness-105"
                >
                  Conversar sobre una solución <ArrowUpRight className="h-4 w-4" />
                </Link>
                <a
                  href="#como-funciona"
                  className="inline-flex items-center gap-2 rounded-full border border-ink-foreground/25 px-6 py-3 text-sm font-semibold text-ink-foreground transition hover:border-lime hover:text-lime"
                >
                  Explorar la propuesta <ArrowRight className="h-4 w-4" />
                </a>
              </div>
              <p className="mt-5 max-w-lg text-xs leading-relaxed text-ink-muted">
                Propuesta conceptual. El alcance y las funcionalidades se definen según las
                necesidades y los procesos de cada municipio.
              </p>
            </div>

            <div className="rounded-2xl border border-ink-foreground/15 bg-ink-2/80 p-4 shadow-2xl shadow-black/20 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink-foreground/10 pb-4">
                <div>
                  <p className="eyebrow text-lime">VISTA CONCEPTUAL</p>
                  <h2 className="mt-1 text-lg font-semibold">Panel de obras públicas</h2>
                </div>
                <span className="rounded-full border border-ink-foreground/15 px-3 py-1 text-[10px] text-ink-muted">
                  DATOS ILUSTRATIVOS
                </span>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  ["24", "Proyectos"],
                  ["16", "En ejecución"],
                  ["68%", "Avance medio"],
                  ["08", "Con alertas"],
                ].map(([value, label]) => (
                  <div key={label} className="rounded-xl border border-ink-foreground/10 bg-ink p-3">
                    <p className="font-display text-2xl font-semibold text-lime">{value}</p>
                    <p className="mt-1 text-[11px] text-ink-muted">{label}</p>
                  </div>
                ))}
              </div>
              <div className="mt-5 grid gap-4 sm:grid-cols-[1.1fr_.9fr]">
                <div className="rounded-xl border border-ink-foreground/10 bg-ink p-4">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-semibold">Avance de proyectos</p>
                    <ChartNoAxesCombined className="h-4 w-4 text-lime" />
                  </div>
                  <div className="mt-6 flex h-32 items-end gap-2">
                    {[42, 58, 49, 72, 64, 86, 68, 94, 76, 88, 70, 98].map((height, index) => (
                      <div key={index} className="flex h-full flex-1 items-end rounded-t bg-ink-foreground/10">
                        <div
                          className={`w-full rounded-t ${index === 7 ? "iridescent" : "bg-sage/80"}`}
                          style={{ height: `${height}%` }}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 flex justify-between text-[10px] text-ink-muted">
                    <span>ENE</span><span>ABR</span><span>JUL</span><span>OCT</span>
                  </div>
                </div>
                <div className="rounded-xl border border-ink-foreground/10 bg-ink p-4">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-semibold">Distribución territorial</p>
                    <MapPinned className="h-4 w-4 text-lime" />
                  </div>
                  <div className="relative mt-4 h-36 overflow-hidden rounded-lg border border-ink-foreground/10 bg-ink-2">
                    <div className="absolute inset-0 opacity-40" style={{ backgroundImage: "linear-gradient(30deg, transparent 46%, #78918d 47%, transparent 48%), linear-gradient(120deg, transparent 46%, #78918d 47%, transparent 48%)", backgroundSize: "42px 42px" }} />
                    <svg viewBox="0 0 220 145" className="absolute inset-0 h-full w-full" aria-label="Mapa ilustrativo de puntos de obras">
                      <path d="M15 110 L48 80 L72 92 L98 48 L130 64 L158 25 L202 45" fill="none" stroke="#78918d" strokeWidth="2" strokeDasharray="4 5" />
                      <path d="M20 30 L66 52 L96 36 L134 88 L182 105 L210 90" fill="none" stroke="#78918d" strokeWidth="1.5" opacity=".6" />
                      {[[48,80],[98,48],[130,64],[158,25],[182,105],[72,92],[202,45]].map(([cx,cy],i)=><circle key={i} cx={cx} cy={cy} r="5" fill={i%2===0 ? "#d7ff62" : "#9ed7df"} stroke="#18232d" strokeWidth="2" />)}
                    </svg>
                    <span className="absolute bottom-2 left-2 rounded bg-ink/80 px-2 py-1 text-[9px] text-ink-muted">Ubicaciones de ejemplo</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-[10px] text-ink-muted">
                <span className="h-2 w-2 rounded-full bg-lime" />
                Ejemplo visual · no corresponde a información municipal real
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-16 sm:py-20">
          <SectionTitle
            eyebrow="El desafío de la gestión"
            title="Una obra pública genera información en cada etapa."
            text="Proyectos, contratos, cronogramas, inspecciones y certificaciones suelen quedar distribuidos entre documentos, planillas y distintas áreas. La propuesta es reunir esa información para facilitar su consulta y seguimiento."
          />
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              ["Información dispersa", "Antecedentes técnicos y administrativos en múltiples archivos y dependencias."],
              ["Seguimiento fragmentado", "Dificultad para conocer el estado de cada proyecto y sus próximos hitos."],
              ["Trazabilidad limitada", "Necesidad de relacionar avances, inspecciones, documentos y decisiones."],
            ].map(([heading, text], index) => (
              <article key={heading} className="rounded-2xl border border-ink-foreground/10 bg-ink-2/50 p-6">
                <p className="font-display text-3xl font-semibold text-lime">0{index + 1}</p>
                <h3 className="mt-5 text-xl font-semibold">{heading}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-muted">{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="como-funciona" className="border-y border-ink-foreground/10 bg-ink-2/35 py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-5">
            <SectionTitle
              eyebrow="Una solución integrada"
              title="Del proyecto al cierre, con información conectada."
              text="Una plataforma de referencia para centralizar los datos principales de cada obra y acompañar su ciclo de gestión, con módulos adaptables a la organización municipal."
            />
            <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {modules.map(({ icon: Icon, number, title, text }) => (
                <article key={number} className="rounded-2xl border border-ink-foreground/10 bg-ink p-6 transition hover:border-lime/40">
                  <div className="flex items-center justify-between">
                    <span className="grid h-11 w-11 place-items-center rounded-xl bg-ink-foreground/10 text-lime"><Icon className="h-5 w-5" /></span>
                    <span className="eyebrow text-ink-muted">{number} / MÓDULO</span>
                  </div>
                  <h3 className="mt-6 text-xl font-semibold">{title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink-muted">{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-16 sm:py-20">
          <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr]">
            <div>
              <SectionTitle
                eyebrow="Ciclo de gestión"
                title="Cada etapa deja un registro."
                text="La información se organiza alrededor de la obra y sus eventos, para reconstruir su evolución y consultar los antecedentes relevantes."
              />
              <div className="mt-7 flex items-start gap-3 rounded-xl border border-ink-foreground/10 bg-ink-2/50 p-4">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-lime" />
                <p className="text-sm leading-relaxed text-ink-muted">
                  Los perfiles y permisos se adaptarían a las responsabilidades de cada área. La
                  propuesta contempla historial de cambios y acceso controlado a la documentación.
                </p>
              </div>
            </div>
            <ol className="relative space-y-3 before:absolute before:bottom-6 before:left-5 before:top-6 before:w-px before:bg-ink-foreground/15">
              {stages.map(([name, detail], index) => (
                <li key={name} className="relative flex gap-5 rounded-xl border border-ink-foreground/10 bg-ink-2/50 p-5">
                  <span className="relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-full border border-lime/40 bg-ink text-sm font-semibold text-lime">
                    0{index + 1}
                  </span>
                  <div>
                    <h3 className="font-semibold">{name}</h3>
                    <p className="mt-1 text-sm text-ink-muted">{detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="border-y border-ink-foreground/10 bg-ink-2/35 py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-5">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <SectionTitle
                eyebrow="Ejemplo de visualización"
                title="Una cartera de obras, en una misma vista."
                text="La interfaz podría ofrecer una lectura resumida de los proyectos y permitir profundizar en sus datos, etapas y antecedentes."
              />
              <span className="rounded-full border border-ink-foreground/15 px-3 py-1.5 text-[10px] tracking-wider text-ink-muted">
                CONTENIDO FICTICIO
              </span>
            </div>
            <div className="mt-9 overflow-hidden rounded-2xl border border-ink-foreground/15 bg-ink">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink-foreground/10 px-5 py-4">
                <div>
                  <p className="text-sm font-semibold">Cartera de proyectos</p>
                  <p className="mt-1 text-xs text-ink-muted">Municipio Demo · Datos ilustrativos</p>
                </div>
                <span className="rounded-lg border border-ink-foreground/15 px-3 py-2 text-xs text-ink-muted">Todos los proyectos</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[650px] text-left text-sm">
                  <thead className="bg-ink-2 text-xs text-ink-muted">
                    <tr>
                      {["Proyecto", "Tipo", "Estado", "Avance"].map((heading) => (
                        <th key={heading} className="px-5 py-3 font-medium">{heading}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sampleWorks.map((work) => (
                      <tr key={work.name} className="border-t border-ink-foreground/10">
                        <td className="px-5 py-4">
                          <p className="font-medium">{work.name}</p>
                          <p className="mt-1 text-xs text-ink-muted">{work.zone}</p>
                        </td>
                        <td className="px-5 py-4 text-ink-muted">{work.type}</td>
                        <td className="px-5 py-4">
                          <span className="rounded-full border border-ink-foreground/15 px-2.5 py-1 text-xs">{work.status}</span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-1.5 w-24 overflow-hidden rounded-full bg-ink-foreground/10">
                              <div className={`h-full rounded-full ${work.color}`} style={{ width: `${work.progress}%` }} />
                            </div>
                            <span className="text-xs tabular-nums text-ink-muted">{work.progress}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <p className="mt-3 text-xs text-ink-muted">
              Los nombres, estados y porcentajes de esta vista son ficticios y se utilizan únicamente para ilustrar la propuesta.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-16 sm:py-20">
          <div className="grid gap-5 md:grid-cols-3">
            <article className="border-t border-ink-foreground/20 pt-5">
              <Camera className="h-6 w-6 text-lime" />
              <h3 className="mt-4 text-lg font-semibold">Evidencia organizada</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                Fotografías, informes y observaciones vinculados a cada proyecto.
              </p>
            </article>
            <article className="border-t border-ink-foreground/20 pt-5">
              <MapPinned className="h-6 w-6 text-lime" />
              <h3 className="mt-4 text-lg font-semibold">Lectura territorial</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                Ubicación y distribución de las obras para comprender su alcance en el territorio.
              </p>
            </article>
            <article className="border-t border-ink-foreground/20 pt-5">
              <ChartNoAxesCombined className="h-6 w-6 text-lime" />
              <h3 className="mt-4 text-lg font-semibold">Información para decidir</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                Indicadores y reportes para facilitar el seguimiento de la cartera.
              </p>
            </article>
          </div>
        </section>

        <section className="border-t border-ink-foreground/10 bg-carbon py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-5">
            <p className="eyebrow text-lime">DATACRAFT ARGENTINA · DESARROLLOS A MEDIDA</p>
            <div className="mt-5 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <h2 className="max-w-3xl text-3xl font-semibold sm:text-5xl">
                  Cada municipio tiene sus procesos. La solución debe responder a ellos.
                </h2>
                <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-muted">
                  Diseñamos herramientas digitales a partir de las necesidades reales de cada
                  organización. Si este enfoque se relaciona con un desafío de tu municipio,
                  podemos analizarlo en una reunión y definir un alcance posible.
                </p>
              </div>
              <Link
                to="/"
                hash="contacto"
                className="inline-flex w-fit items-center gap-2 rounded-full bg-lime px-6 py-3 text-sm font-semibold text-lime-foreground transition hover:-translate-y-0.5 hover:brightness-105"
              >
                Coordinar una reunión <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-ink-foreground/10 bg-carbon py-7">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 text-sm text-ink-muted">
          <Link to="/" className="inline-flex items-center gap-2 transition hover:text-lime">
            <ArrowLeft className="h-4 w-4" /> Volver a Datacraft Argentina
          </Link>
          <p>© {new Date().getFullYear()} Datacraft Argentina · DATACRAFT LAB</p>
        </div>
      </>
    </ObservatoryShell>
  );
}
