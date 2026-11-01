import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Building2,
  Store,
  Landmark,
  Workflow,
  BarChart3,
  Bot,
  LayoutGrid,
  ShieldCheck,
  Map,
  Menu,
  X,
  Instagram,
  Facebook,
  Youtube,
  Check,
  LayoutDashboard,
  MessageCircle,
  Wrench,
  ClipboardList,
  GraduationCap,
  Boxes,
  type LucideIcon,
} from "lucide-react";
import { site, primaryCtaHref } from "@/config/site";
import logoAsset from "@/assets/datacraft-logo.jpeg.asset.json";

const TITLE = "Datacraft Argentina | Transformación digital, datos y automatización";
const DESC =
  "Consultora tecnológica en Argentina. Transformación digital, inteligencia de negocios, automatización, inteligencia artificial y soluciones de gestión para organizaciones públicas y privadas.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "es_AR" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const nav = [
  ["inicio", "Inicio"],
  ["soluciones", "Soluciones"],
  ["sectores", "Sectores"],
  ["experiencia", "Experiencia"],
  ["metodologia", "Metodología"],
  ["contacto", "Contacto"],
] as const;

const services = [
  {
    id: "transformacion-digital",
    icon: Workflow,
    title: "Transformación digital",
    desc: "Llevamos tus operaciones al formato digital con criterio y sin fricción.",
    items: [
      "Digitalización de operaciones",
      "Sistematización de procesos",
      "Herramientas de gestión",
      "Integración de sistemas",
    ],
  },
  {
    id: "datos-bi",
    icon: BarChart3,
    title: "Datos e inteligencia de negocios",
    desc: "Convertimos datos dispersos en información clara para decidir mejor.",
    items: [
      "Tableros ejecutivos y BI",
      "Procesamiento y organización de datos",
      "Indicadores",
      "Análisis territorial y observatorios",
    ],
  },
  {
    id: "automatizacion-ia",
    icon: Bot,
    title: "Automatización e inteligencia artificial",
    desc: "Liberamos tiempo de tu equipo automatizando lo repetitivo.",
    items: [
      "Automatización de tareas y flujos",
      "Bots conversacionales",
      "Integraciones API",
      "Asistentes y agentes de IA",
    ],
  },
  {
    id: "sistemas-gestion",
    icon: LayoutGrid,
    title: "Sistemas y gestión empresarial",
    desc: "Herramientas a la medida de cómo trabaja tu organización.",
    items: [
      "Seguimiento comercial y de clientes",
      "Gestión administrativa y financiera",
      "Control de inventarios",
      "Portales y sistemas a medida",
    ],
  },
  {
    id: "ciberseguridad",
    icon: ShieldCheck,
    title: "Ciberseguridad y gestión de información",
    desc: "Te ayudamos a entender y ordenar cómo cuidás tu información.",
    items: [
      "Diagnóstico y auditoría",
      "Evaluación de buenas prácticas",
      "Gestión de accesos y respaldos",
      "Asesoramiento",
    ],
  },
  {
    id: "sector-publico",
    icon: Map,
    title: "Soluciones para sector público",
    desc: "Información institucional ordenada para gestionar y diseñar políticas.",
    items: [
      "Relevamientos digitales",
      "Sistematización de datos institucionales",
      "Tableros e indicadores de gestión",
      "Observatorios y análisis territorial",
    ],
  },
];

const sectors = [
  {
    icon: Landmark,
    title: "Sector público",
    text: "Organismos que necesitan relevar, ordenar y visualizar información para gestionar con evidencia.",
    needs: ["Datos institucionales dispersos", "Seguimiento de indicadores", "Lectura territorial"],
  },
  {
    icon: Building2,
    title: "Empresas y pymes",
    text: "Equipos que crecieron con planillas y procesos manuales y necesitan dar el siguiente paso.",
    needs: ["Procesos sin sistematizar", "Información difícil de consolidar", "Tareas repetitivas"],
  },
  {
    icon: Store,
    title: "Comercios",
    text: "Negocios que quieren atender mejor, vender más ordenado y controlar su operación.",
    needs: ["Consultas por canales digitales", "Stock y ventas", "Seguimiento de clientes"],
  },
];

const experience: { icon: LucideIcon; tag: string; title: string; text: string }[] = [
  {
    icon: LayoutDashboard,
    tag: "Experiencia",
    title: "Tablero ejecutivo de información territorial",
    text: "Diseño de tableros para visualizar indicadores territoriales y apoyar la toma de decisiones.",
  },
  {
    icon: MessageCircle,
    tag: "Desarrollo",
    title: "Captación de consultas vía WhatsApp",
    text: "Integración con WhatsApp Cloud API que registra consultas entrantes en Google Sheets.",
  },
  {
    icon: Wrench,
    tag: "Desarrollo",
    title: "Herramientas de gestión con Apps Script",
    text: "Automatizaciones, formularios y flujos sobre Google Workspace para ordenar procesos.",
  },
  {
    icon: ClipboardList,
    tag: "PROTOTIPO",
    title: "Gestión y seguimiento de servicios",
    text: "Herramienta para centralizar solicitudes, órdenes de trabajo y tareas, asignar responsables y realizar el seguimiento de cada servicio hasta su resolución.",
  },
  {
    icon: GraduationCap,
    tag: "Experiencia",
    title: "Landing pages y capacitaciones",
    text: "Sitios institucionales y espacios de formación en herramientas digitales y datos.",
  },
];

const stack = [
  "Google Sheets",
  "Apps Script",
  "Formularios",
  "Python",
  "APIs",
  "JavaScript",
  "HTML/CSS",
  "Dashboards",
  "Visualización de datos",
];

const steps = [
  ["Diagnóstico", "Entendemos tu organización, tus procesos y tus datos antes de proponer."],
  ["Diseño", "Definimos la solución, el alcance y las prioridades con vos."],
  ["Desarrollo e integración", "Construimos e integramos con tus herramientas actuales."],
  ["Implementación", "Acompañamos la puesta en marcha y capacitamos a tu equipo."],
  ["Mejora continua", "Medimos, ajustamos y evolucionamos la solución."],
];

const ext = { target: "_blank", rel: "noopener noreferrer" } as const;
const btnPrimary =
  "group inline-flex items-center justify-center gap-2 rounded-full bg-lime px-6 py-3 text-sm font-semibold text-lime-foreground transition hover:-translate-y-0.5 hover:brightness-105";
const btnGhost =
  "inline-flex items-center justify-center gap-2 rounded-full border border-ink-foreground/25 px-6 py-3 text-sm font-semibold text-ink-foreground transition hover:border-lime hover:text-lime";

function Wordmark({ light = false }: { light?: boolean }) {
  return (
    <span className="flex items-center gap-2.5 font-display">
      <img src={logoAsset.url} alt="" className="h-9 w-9 rounded-full" width={36} height={36} />
      <span
        className={`text-lg font-bold tracking-tight ${light ? "text-ink-foreground" : "text-foreground"}`}
      >
        Datacraft<span className="font-normal text-sage"> Argentina</span>
      </span>
    </span>
  );
}

function SectionHead({
  eyebrow,
  title,
  text,
  dark,
}: {
  eyebrow: string;
  title: ReactNode;
  text?: string;
  dark?: boolean;
}) {
  return (
    <div className="max-w-2xl">
      <p className={`eyebrow ${dark ? "text-lime" : "text-sage"}`}>{eyebrow}</p>
      <h2
        className={`mt-3 text-3xl font-semibold sm:text-4xl ${dark ? "text-ink-foreground" : ""}`}
      >
        {title}
      </h2>
      {text && (
        <p className={`mt-4 text-lg ${dark ? "text-ink-muted" : "text-muted-foreground"}`}>
          {text}
        </p>
      )}
    </div>
  );
}

type CardProps = {
  icon: LucideIcon;
  label: string;
  title: string;
  text?: string;
  items?: string[];
  dark?: boolean;
  id?: string;
};

/** Tarjeta única: todas las tarjetas del sitio comparten estructura y fondo de etiquetas. */
function Card({ icon: Icon, label, title, text, items, dark, id }: CardProps) {
  const shell = dark
    ? "border-ink-foreground/10 bg-ink-2/60 hover:border-lime/50"
    : "border-border bg-card hover:shadow-lg";
  const chip = dark
    ? "bg-ink-foreground/10 text-ink-foreground"
    : "bg-secondary text-secondary-foreground";
  const check = dark ? "text-lime" : "text-sage";
  return (
    <article
      id={id}
      className={`scroll-mt-24 rounded-2xl border p-7 transition hover:-translate-y-1 ${shell}`}
    >
      <div className="flex items-start justify-between gap-3">
        <span className={`grid h-12 w-12 place-items-center rounded-xl ${chip}`}>
          <Icon className="h-6 w-6" aria-hidden />
        </span>
        <span className={`eyebrow rounded-full px-3 py-1.5 ${chip}`}>{label}</span>
      </div>
      <h3 className={`mt-6 text-xl font-semibold ${dark ? "text-ink-foreground" : ""}`}>{title}</h3>
      {text && (
        <p className={`mt-2 ${dark ? "text-sm text-ink-muted" : "text-muted-foreground"}`}>
          {text}
        </p>
      )}
      {items && items.length > 0 && (
        <ul
          className={`mt-5 grid gap-2 text-sm sm:grid-cols-2 ${dark ? "text-ink-foreground" : ""}`}
        >
          {items.map((it) => (
            <li key={it} className="flex gap-2">
              <Check className={`mt-0.5 h-4 w-4 shrink-0 ${check}`} aria-hidden />
              {it}
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}

function DataViz() {
  const bars = [38, 62, 45, 80, 56, 92, 70];
  return (
    <div
      aria-hidden
      className="relative rounded-2xl border border-ink-foreground/10 bg-ink-2/60 p-6 backdrop-blur"
    >
      <div className="flex items-center justify-between text-xs text-ink-muted">
        <span className="eyebrow">WORKFLOWS</span>
        <span className="flex items-center gap-1.5">
          <span className="pulse-soft h-2 w-2 rounded-full bg-lime" />
          en proceso
        </span>
      </div>
      <div className="mt-6 flex h-40 items-end gap-3">
        {bars.map((h, i) => (
          <div key={i} className="flex-1 rounded-t-md bg-ink-foreground/10">
            <div
              className={`rounded-t-md ${i === 5 ? "iridescent" : "bg-sage/70"}`}
              style={{ height: `${h * 1.6}px` }}
            />
          </div>
        ))}
      </div>
      <svg viewBox="0 0 300 60" className="mt-6 w-full">
        <polyline
          fill="none"
          stroke="var(--lime)"
          strokeWidth="2"
          points="0,50 40,42 80,46 120,30 160,34 200,18 240,22 300,6"
        />
        {[
          [120, 30],
          [200, 18],
          [300, 6],
        ].map(([x, y]) => (
          <circle key={x} cx={x} cy={y} r="3.5" fill="var(--lime)" />
        ))}
      </svg>
      <div className="mt-4 grid grid-cols-3 gap-3 text-xs text-ink-muted">
        {["Información", "Procesos", "Resultados"].map((t) => (
          <div key={t} className="rounded-lg border border-ink-foreground/10 px-3 py-2">
            {t}
          </div>
        ))}
      </div>
    </div>
  );
}

function Index() {
  const [open, setOpen] = useState(false);
  const year = new Date().getFullYear();
  const socials = [
    { href: site.social.instagram, label: "Instagram", Icon: Instagram },
    { href: site.social.facebook, label: "Facebook", Icon: Facebook },
    { href: site.social.youtube, label: "YouTube", Icon: Youtube },
  ].filter((s) => s.href);
  const contacts = [
    site.contact.whatsapp && {
      label: "WhatsApp",
      value: "Escribinos",
      href: `https://wa.me/${site.contact.whatsapp}`,
    },
    site.contact.phone && {
      label: "Teléfono",
      value: site.contact.phone,
      href: `tel:${site.contact.phone}`,
    },
    site.contact.email && {
      label: "Correo",
      value: site.contact.email,
      href: `mailto:${site.contact.email}`,
    },
    site.contact.address && { label: "Dirección", value: site.contact.address, href: "" },
  ].filter(Boolean) as { label: string; value: string; href: string }[];

  return (
    <div className="grid-lines min-h-screen">
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-lime focus:px-4 focus:py-2 focus:text-lime-foreground"
      >
        Saltar al contenido
      </a>

      <header className="fixed inset-x-0 top-0 z-50 border-b border-ink-foreground/10 bg-ink/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
          <a href="#inicio" aria-label="Datacraft Argentina, ir al inicio">
            <Wordmark light />
          </a>
          <nav aria-label="Principal" className="hidden lg:block">
            <ul className="flex gap-1">
              {nav.map(([id, label]) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    className="rounded-full px-3 py-2 text-sm text-ink-muted transition hover:text-lime"
                  >
                    {label}
                  </a>
                </li>
              ))}
              <li>
                <Link
                  to="/observatorio"
                  className="rounded-full px-3 py-2 text-sm text-ink-muted transition hover:text-lime"
                >
                  Observatorio
                </Link>
              </li>
            </ul>
          </nav>
          <a
            href={primaryCtaHref}
            {...ext}
            className={`${btnPrimary} hidden !px-4 !py-2 lg:inline-flex`}
          >
            Agenda una reunión
          </a>
          <button
            type="button"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-controls="menu-movil"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            className="rounded-md p-2 text-ink-foreground lg:hidden"
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
        {open && (
          <nav
            id="menu-movil"
            aria-label="Menú móvil"
            className="border-t border-ink-foreground/10 px-5 pb-6 lg:hidden"
          >
            <ul className="flex flex-col py-2">
              {nav.map(([id, label]) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    onClick={() => setOpen(false)}
                    className="block py-3 text-ink-foreground hover:text-lime"
                  >
                    {label}
                  </a>
                </li>
              ))}
              <li>
                <Link
                  to="/observatorio"
                  onClick={() => setOpen(false)}
                  className="block py-3 text-ink-foreground hover:text-lime"
                >
                  Observatorio
                </Link>
              </li>
            </ul>
            <a href={primaryCtaHref} {...ext} className={`${btnPrimary} w-full`}>
              Hablemos de tu proyecto
            </a>
          </nav>
        )}
      </header>

      <main id="contenido">
        {/* Hero */}
        <section
          id="inicio"
          className="grid-lines relative overflow-hidden bg-ink pt-28 pb-14 sm:pt-36 sm:pb-20"
        >
          <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <p className="eyebrow inline-flex items-center gap-2 rounded-full border border-lime/30 px-3 py-1.5 text-lime">
                <span className="h-1.5 w-1.5 rounded-full bg-lime" /> CONSULTORA TECNOLÓGICA ·
                ARGENTINA
              </p>
              <h1 className="mt-6 text-4xl font-semibold leading-[1.05] text-ink-foreground sm:text-6xl">
                Transformamos información en soluciones.{" "}
                <span className="iridescent-text">Tecnología en resultados.</span>
              </h1>
              <p className="mt-6 max-w-xl text-lg text-ink-muted">
                Acompañamos a organizaciones públicas y empresas privadas a convertir sus procesos y
                datos en herramientas concretas: soluciones propias y desarrollos a medida.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <a href={primaryCtaHref} {...ext} className={btnPrimary}>
                  Agenda una reunión{" "}
                  <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
                <a href="#soluciones" className={btnGhost}>
                  Conocé nuestras soluciones <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>
            <DataViz />
          </div>
        </section>

        {/* Qué hacemos */}
        <section className="py-14 sm:py-20">
          <div className="mx-auto grid max-w-7xl gap-8 px-5 lg:grid-cols-2">
            <SectionHead
              eyebrow="Qué hacemos"
              title="Ordenamos, conectamos y potenciamos cómo trabaja tu organización."
            />
            <div className="space-y-5 text-lg text-muted-foreground">
              <p>
                Partimos de tu realidad: la información que ya tenés, los procesos que funcionan y
                los que se traban. Desde ahí diseñamos soluciones tecnológicas que se usan de
                verdad.
              </p>
              <p>
                Integramos transformación digital, datos, automatización, inteligencia artificial y
                sistemas de gestión con una mirada estratégica y cercana.
              </p>
            </div>
          </div>
        </section>

        {/* Soluciones */}
        <section id="soluciones" className="bg-muted/70 py-14 sm:py-20">
          <div className="mx-auto max-w-7xl px-5">
            <SectionHead
              eyebrow="Soluciones"
              title="Seis unidades, una visión integral."
              text="Cada unidad resuelve un problema concreto y se combina con las demás según lo que necesites."
            />
            <ul className="mt-7 flex flex-wrap gap-2" aria-label="Accesos a cada unidad">
              {services.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="inline-block rounded-full border bg-card px-3 py-1.5 text-sm transition hover:border-primary hover:text-primary"
                  >
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {services.map((s, i) => (
                <Card
                  key={s.id}
                  id={s.id}
                  icon={s.icon}
                  label={`0${i + 1}`}
                  title={s.title}
                  text={s.desc}
                  items={s.items}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Sectores */}
        <section id="sectores" className="py-14 sm:py-20">
          <div className="mx-auto max-w-7xl px-5">
            <SectionHead
              eyebrow="Sectores"
              title="Soluciones pensadas para cada tipo de organización."
            />
            <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {sectors.map((s, i) => (
                <Card
                  key={s.title}
                  icon={s.icon}
                  label={`0${i + 1}`}
                  title={s.title}
                  text={s.text}
                  items={s.needs}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Experiencia */}
        <section id="experiencia" className="grid-lines bg-ink py-14 sm:py-20">
          <div className="mx-auto max-w-7xl px-5">
            <SectionHead
              dark
              eyebrow="Experiencia y capacidades"
              title="Lo que ya hicimos, contado con honestidad."
              text="Distinguimos experiencia aplicada, desarrollos y prototipos. Sin datos confidenciales ni nombres de organismos."
            />
            <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {experience.map((e) => (
                <Card
                  key={e.title}
                  dark
                  icon={e.icon}
                  label={e.tag}
                  title={e.title}
                  text={e.text}
                />
              ))}
              <Card
                dark
                icon={Boxes}
                label="Herramientas"
                title="Herramientas con las que trabajamos"
                items={stack}
              />
            </div>
          </div>
        </section>

        {/* Metodología */}
        <section id="metodologia" className="py-14 sm:py-20">
          <div className="mx-auto max-w-7xl px-5">
            <SectionHead eyebrow="Metodología" title="Un proceso claro, de punta a punta." />
            <ol className="mt-8 grid gap-4 md:grid-cols-5">
              {steps.map(([t, d], i) => (
                <li key={t} className="relative rounded-2xl border bg-card p-6">
                  <span className="font-display text-3xl font-semibold text-sage">0{i + 1}</span>
                  <div className="my-4 h-px bg-border">
                    <div className="h-px bg-primary" style={{ width: `${(i + 1) * 20}%` }} />
                  </div>
                  <h3 className="font-semibold">{t}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{d}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* CTA final */}
        <section className="px-5 pb-14 sm:pb-20">
          <div className="iridescent mx-auto max-w-7xl overflow-hidden rounded-3xl p-10 text-lime-foreground sm:p-16">
            <h2 className="max-w-3xl text-3xl font-semibold sm:text-5xl">
              ¿Tenés información, procesos o datos que podrían rendir más?
            </h2>
            <p className="mt-4 max-w-xl text-lg opacity-80">
              Contanos tu desafío y lo pensamos juntos.
            </p>
            <a
              href={primaryCtaHref}
              {...ext}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-ink-foreground transition hover:-translate-y-0.5 focus-visible:outline-ink"
            >
              Hablemos de tu proyecto <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </section>

        {/* Contacto */}
        <section id="contacto" className="border-t py-14 sm:py-16">
          <div className="mx-auto grid max-w-7xl gap-8 px-5 lg:grid-cols-2">
            <SectionHead
              eyebrow="Contacto"
              title="Encontranos en nuestras redes."
              text="Escribinos por mensaje directo y te respondemos."
            />
            <div className="grid gap-3">
              {contacts.map((c) =>
                c.href ? (
                  <a
                    key={c.label}
                    href={c.href}
                    className="flex justify-between rounded-xl border bg-card p-5 hover:border-primary"
                  >
                    <span className="font-semibold">{c.label}</span>
                    <span className="text-muted-foreground">{c.value}</span>
                  </a>
                ) : (
                  <div key={c.label} className="flex justify-between rounded-xl border bg-card p-5">
                    <span className="font-semibold">{c.label}</span>
                    <span className="text-muted-foreground">{c.value}</span>
                  </div>
                ),
              )}
              {socials.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  {...ext}
                  className="group flex items-center justify-between rounded-xl border bg-card p-5 transition hover:border-primary"
                >
                  <span className="flex items-center gap-3 font-semibold">
                    <Icon className="h-5 w-5 text-primary" aria-hidden />
                    {label}
                  </span>
                  <ArrowUpRight
                    className="h-4 w-4 text-muted-foreground transition group-hover:text-primary"
                    aria-hidden
                  />
                  <span className="sr-only">(se abre en una pestaña nueva)</span>
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-carbon py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-5 sm:flex-row sm:items-center">
          <Wordmark light />
          <p className="text-sm text-ink-muted">
            © {year} {site.name}. Todos los derechos reservados.
          </p>
          <ul className="flex gap-2">
            {socials.map(({ href, label, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  {...ext}
                  aria-label={label}
                  className="grid h-10 w-10 place-items-center rounded-full border border-ink-foreground/15 text-ink-foreground transition hover:border-lime hover:text-lime"
                >
                  <Icon className="h-4 w-4" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </footer>
    </div>
  );
}
