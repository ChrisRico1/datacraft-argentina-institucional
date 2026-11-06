import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  BookOpen,
  CalendarDays,
  ChartNoAxesCombined,
  Database,
  Globe2,
  MapPinned,
  Search,
  ShieldCheck,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type TopicId = "economia" | "sociedad" | "comercio" | "demografia";
type Indicator = {
  id: string;
  title: string;
  topic: TopicId;
  description: string;
  unit: string;
  frequency: string;
  coverage: string;
  service: string;
};

const topics: {
  id: TopicId;
  number: string;
  title: string;
  description: string;
  icon: typeof Activity;
  accent: string;
}[] = [
  {
    id: "economia",
    number: "01",
    title: "Pulso económico",
    description: "Precios, actividad, salarios y producción.",
    icon: ChartNoAxesCombined,
    accent: "text-lime",
  },
  {
    id: "sociedad",
    number: "02",
    title: "Sociedad y condiciones de vida",
    description: "Trabajo, ingresos, pobreza y canastas.",
    icon: Users,
    accent: "text-mint",
  },
  {
    id: "comercio",
    number: "03",
    title: "Comercio exterior",
    description: "Exportaciones, importaciones y mercados.",
    icon: Globe2,
    accent: "text-sky",
  },
  {
    id: "demografia",
    number: "04",
    title: "Demografía",
    description: "Población, estructura y distribución territorial.",
    icon: MapPinned,
    accent: "text-blush",
  },
];

const indicators: Indicator[] = [
  {
    id: "ipc",
    title: "Índice de Precios al Consumidor",
    topic: "economia",
    description: "Evolución del nivel general de precios y sus divisiones.",
    unit: "Índice / variación porcentual",
    frequency: "Mensual",
    coverage: "Nacional y regiones, según serie",
    service: "IPC",
  },
  {
    id: "salarios",
    title: "Índice de salarios",
    topic: "economia",
    description: "Evolución de los salarios registrados y no registrados.",
    unit: "Índice / variación porcentual",
    frequency: "Mensual",
    coverage: "Nacional",
    service: "Salarios",
  },
  {
    id: "emae",
    title: "Estimador Mensual de Actividad Económica",
    topic: "economia",
    description: "Seguimiento de la actividad económica agregada.",
    unit: "Índice / variación porcentual",
    frequency: "Mensual",
    coverage: "Nacional",
    service: "EMAE",
  },
  {
    id: "pobreza",
    title: "Pobreza e indigencia",
    topic: "sociedad",
    description: "Incidencia de la pobreza y la indigencia en personas y hogares.",
    unit: "Porcentaje",
    frequency: "Semestral",
    coverage: "Aglomerados urbanos relevados por EPH",
    service: "Incidencia de pobreza e indigencia",
  },
  {
    id: "mercado-laboral",
    title: "Mercado de trabajo",
    topic: "sociedad",
    description: "Tasas de actividad, empleo, desocupación y subocupación.",
    unit: "Porcentaje",
    frequency: "Trimestral",
    coverage: "Aglomerados urbanos relevados por EPH",
    service: "Mercado de trabajo",
  },
  {
    id: "canastas",
    title: "Canastas básicas",
    topic: "sociedad",
    description: "Canasta Básica Alimentaria y Canasta Básica Total.",
    unit: "Pesos corrientes",
    frequency: "Mensual",
    coverage: "Cobertura publicada por INDEC",
    service: "Canastas básicas",
  },
  {
    id: "exportaciones",
    title: "Exportaciones",
    topic: "comercio",
    description: "Evolución y composición de las ventas externas.",
    unit: "Dólares / cantidades, según serie",
    frequency: "Mensual",
    coverage: "Nacional",
    service: "Intercambio comercial argentino",
  },
  {
    id: "importaciones",
    title: "Importaciones",
    topic: "comercio",
    description: "Evolución y composición de las compras externas.",
    unit: "Dólares / cantidades, según serie",
    frequency: "Mensual",
    coverage: "Nacional",
    service: "Intercambio comercial argentino",
  },
  {
    id: "poblacion",
    title: "Estimaciones y proyecciones de población",
    topic: "demografia",
    description: "Estructura y evolución de la población por desagregaciones disponibles.",
    unit: "Personas",
    frequency: "Anual",
    coverage: "Jurisdicciones y departamentos, según servicio",
    service: "Estimaciones y proyecciones de población",
  },
];

const title = "Radar Estadístico Argentina | Datacraft";
const description =
  "Plataforma de exploración de estadísticas oficiales argentinas. Economía, sociedad, comercio exterior y demografía a partir de datos del INDEC.";

export const Route = createFileRoute("/observatorio/radar-estadistico-argentina")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RadarEstadisticoArgentina,
});

function RadarEstadisticoArgentina() {
  const [activeTopic, setActiveTopic] = useState<TopicId>("economia");
  const [selectedIndicator, setSelectedIndicator] = useState("ipc");
  const [period, setPeriod] = useState("all");
  const [search, setSearch] = useState("");

  const visibleIndicators = useMemo(
    () =>
      indicators.filter(
        (indicator) =>
          indicator.topic === activeTopic &&
          `${indicator.title} ${indicator.description}`.toLowerCase().includes(search.toLowerCase()),
      ),
    [activeTopic, search],
  );
  const selected = indicators.find((indicator) => indicator.id === selectedIndicator) ?? indicators[0];
  const activeTopicData = topics.find((topic) => topic.id === activeTopic) ?? topics[0];
  const selectTopic = (topic: TopicId) => {
    setActiveTopic(topic);
    const first = indicators.find((indicator) => indicator.topic === topic);
    if (first) setSelectedIndicator(first.id);
    setSearch("");
  };

  return (
    <div className="observatory min-h-screen bg-ink text-ink-foreground">
      <section className="relative overflow-hidden border-b border-ink-foreground/10">
        <div className="pointer-events-none absolute inset-0 grid-lines opacity-30" />
        <div className="pointer-events-none absolute -right-24 -top-28 h-96 w-96 rounded-full bg-lime/10 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-5 pb-14 pt-10 sm:pb-20 sm:pt-14">
          <Link
            to="/observatorio"
            className="inline-flex items-center gap-2 text-sm text-ink-muted transition hover:text-lime"
          >
            <ArrowLeft className="h-4 w-4" /> Volver a Proyectos
          </Link>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <p className="eyebrow text-lime">DATACRAFT LAB / DATOS E INTELIGENCIA</p>
            <span className="rounded-full border border-lime/30 bg-lime/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-lime">
              En desarrollo
            </span>
          </div>
          <div className="mt-5 grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div>
              <h1 className="max-w-4xl text-4xl font-semibold leading-[1.08] sm:text-6xl">
                Radar Estadístico
                <span className="block text-lime">Argentina.</span>
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted sm:text-xl">
                Una nueva forma de explorar los datos que ayudan a entender el país.
                Información económica, social y territorial en un solo lugar.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#explorador" className="inline-flex items-center gap-2 rounded-full bg-lime px-6 py-3 text-sm font-semibold text-lime-foreground transition hover:brightness-105">
                  Explorar indicadores <ArrowRight className="h-4 w-4" />
                </a>
                <a href="#metodologia" className="inline-flex items-center gap-2 rounded-full border border-ink-foreground/25 px-6 py-3 text-sm font-semibold text-ink-foreground transition hover:border-lime hover:text-lime">
                  Cómo funciona <BookOpen className="h-4 w-4" />
                </a>
              </div>
            </div>
            <div className="rounded-2xl border border-ink-foreground/10 bg-ink-2/70 p-6 backdrop-blur sm:p-7">
              <div className="flex items-center justify-between gap-4">
                <span className="eyebrow text-ink-muted">PLATAFORMA DE DATOS PÚBLICOS</span>
                <Activity className="h-5 w-5 text-lime" />
              </div>
              <p className="mt-6 font-display text-3xl font-semibold">INDEC</p>
              <p className="mt-1 text-sm text-ink-muted">Fuente estadística oficial</p>
              <div className="mt-6 grid grid-cols-2 gap-4 border-t border-ink-foreground/10 pt-5">
                <div>
                  <p className="font-display text-2xl font-semibold">04</p>
                  <p className="mt-1 text-xs text-ink-muted">Áreas temáticas</p>
                </div>
                <div>
                  <p className="font-display text-2xl font-semibold">01</p>
                  <p className="mt-1 text-xs text-ink-muted">Explorador unificado</p>
                </div>
              </div>
              <p className="mt-5 flex items-center gap-2 text-xs text-mint">
                <span className="h-2 w-2 rounded-full bg-lime" />
                Diseño funcional en construcción · Datos aún no conectados
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 sm:py-16">
        <div className="mb-7 max-w-2xl">
          <p className="eyebrow text-lime">UNA MIRADA INTEGRAL</p>
          <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">Cuatro dimensiones para leer la realidad.</h2>
          <p className="mt-4 text-ink-muted">
            Indicadores oficiales organizados por tema, con contexto, período y cobertura para interpretar cada dato correctamente.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {topics.map((topic) => {
            const Icon = topic.icon;
            const count = indicators.filter((indicator) => indicator.topic === topic.id).length;
            return (
              <button
                key={topic.id}
                type="button"
                onClick={() => selectTopic(topic.id)}
                aria-pressed={activeTopic === topic.id}
                className={`group rounded-2xl border p-5 text-left transition hover:-translate-y-1 hover:border-lime/50 ${activeTopic === topic.id ? "border-lime/50 bg-ink-2" : "border-ink-foreground/10 bg-ink-2/45"}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs tracking-[0.18em] text-ink-muted">{topic.number} / 04</span>
                  <Icon className={`h-5 w-5 ${topic.accent}`} />
                </div>
                <h3 className="mt-7 text-lg font-semibold">{topic.title}</h3>
                <p className="mt-2 min-h-10 text-sm leading-relaxed text-ink-muted">{topic.description}</p>
                <div className="mt-6 flex items-center justify-between border-t border-ink-foreground/10 pt-4">
                  <span className="text-xs text-ink-muted">{count} indicadores previstos</span>
                  <ArrowRight className="h-4 w-4 text-lime transition group-hover:translate-x-1" />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <section id="explorador" className="border-y border-ink-foreground/10 bg-carbon/70 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-5">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow text-lime">EXPLORADOR DE INDICADORES</p>
              <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">Encontrá el dato que necesitás.</h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-muted">
                Seleccioná un área temática y un indicador para consultar sus características y preparar la exploración.
              </p>
            </div>
            <span className="rounded-full border border-ink-foreground/15 px-3 py-1.5 text-xs text-ink-muted">
              Catálogo inicial · En validación
            </span>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
            <div className="rounded-2xl border border-ink-foreground/10 bg-ink-2/55 p-5 sm:p-6">
              <label className="eyebrow text-ink-muted" htmlFor="radar-topic">ÁREA TEMÁTICA</label>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {topics.map((topic) => (
                  <button
                    key={topic.id}
                    type="button"
                    onClick={() => selectTopic(topic.id)}
                    className={`rounded-lg border px-3 py-2.5 text-left text-xs font-medium transition ${activeTopic === topic.id ? "border-lime/50 bg-lime/10 text-lime" : "border-ink-foreground/10 text-ink-muted hover:border-ink-foreground/30"}`}
                  >
                    {topic.title}
                  </button>
                ))}
              </div>
              <label className="mt-6 block text-xs font-semibold text-ink-muted" htmlFor="radar-search">BUSCAR INDICADOR</label>
              <div className="relative mt-2">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
                <input
                  id="radar-search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Ej. precios, empleo, población..."
                  className="h-11 w-full rounded-lg border border-ink-foreground/15 bg-ink px-10 text-sm text-ink-foreground outline-none placeholder:text-ink-muted/60 focus:border-lime/60"
                />
              </div>
              <div className="mt-4 max-h-[340px] space-y-2 overflow-y-auto pr-1">
                {visibleIndicators.length ? visibleIndicators.map((indicator) => (
                  <button
                    key={indicator.id}
                    type="button"
                    onClick={() => setSelectedIndicator(indicator.id)}
                    className={`w-full rounded-lg border p-3 text-left transition ${selectedIndicator === indicator.id ? "border-lime/45 bg-lime/10" : "border-ink-foreground/10 hover:border-ink-foreground/25"}`}
                  >
                    <span className="block text-sm font-medium">{indicator.title}</span>
                    <span className="mt-1 block text-xs text-ink-muted">{indicator.frequency} · {indicator.unit}</span>
                  </button>
                )) : (
                  <p className="rounded-lg border border-dashed border-ink-foreground/15 p-4 text-sm text-ink-muted">
                    No hay indicadores que coincidan con la búsqueda en esta área.
                  </p>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-ink-foreground/10 bg-ink-2/55 p-5 sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="eyebrow text-lime">{activeTopicData.title}</p>
                  <h3 className="mt-3 max-w-xl text-2xl font-semibold">{selected.title}</h3>
                  <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-muted">{selected.description}</p>
                </div>
                <span className="rounded-full border border-lime/25 bg-lime/10 px-3 py-1.5 text-[11px] text-lime">En validación</span>
              </div>

              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                <Metadata label="Unidad de medida" value={selected.unit} icon={BarChart3} />
                <Metadata label="Frecuencia prevista" value={selected.frequency} icon={CalendarDays} />
                <Metadata label="Cobertura a verificar" value={selected.coverage} icon={MapPinned} />
                <Metadata label="Servicio INDEC" value={selected.service} icon={Database} />
              </div>

              <div className="mt-6 rounded-xl border border-dashed border-ink-foreground/20 bg-ink/60 p-6 sm:p-8">
                <div className="mx-auto flex max-w-md flex-col items-center text-center">
                  <div className="grid h-12 w-12 place-items-center rounded-full bg-ink-foreground/10">
                    <Activity className="h-6 w-6 text-lime" />
                  </div>
                  <h4 className="mt-4 text-lg font-semibold">Visualización en preparación</h4>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                    La conexión con este servicio se habilitará después de validar su endpoint, dimensiones, períodos y metadatos oficiales.
                  </p>
                  <span className="mt-4 text-xs text-mint">No se muestran valores de ejemplo ni cifras simuladas.</span>
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
                <label className="text-xs text-ink-muted">
                  Período
                  <select
                    value={period}
                    onChange={(event) => setPeriod(event.target.value)}
                    className="mt-2 h-10 w-full rounded-lg border border-ink-foreground/15 bg-ink px-3 text-sm text-ink-foreground"
                  >
                    <option value="all">Todo el período disponible</option>
                    <option value="5y">Últimos 5 años</option>
                    <option value="2y">Últimos 2 años</option>
                    <option value="1y">Último año</option>
                  </select>
                </label>
                <label className="text-xs text-ink-muted">
                  Desagregación
                  <select disabled className="mt-2 h-10 w-full rounded-lg border border-ink-foreground/15 bg-ink px-3 text-sm text-ink-muted opacity-60">
                    <option>Según disponibilidad del servicio</option>
                  </select>
                </label>
                <Button className="self-end" variant="lab" disabled>
                  Consultar <ArrowRight />
                </Button>
              </div>
              <p className="mt-3 text-right text-[11px] text-ink-muted">Filtro seleccionado: {period === "all" ? "Todo el período" : period === "5y" ? "Últimos 5 años" : period === "2y" ? "Últimos 2 años" : "Último año"}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 sm:py-16">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="eyebrow text-lime">DATOS CON CONTEXTO</p>
            <h2 className="mt-3 text-3xl font-semibold">Un indicador no es solo un número.</h2>
            <p className="mt-4 leading-relaxed text-ink-muted">
              Para que la información sea útil, cada resultado debe conservar su contexto estadístico. Radar identifica qué se mide, a quién representa, dónde aplica y cuándo fue publicado.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Principle icon={CalendarDays} title="Período de referencia" text="Cuándo corresponde el dato y con qué frecuencia se publica." />
            <Principle icon={MapPinned} title="Cobertura geográfica" text="País, región, jurisdicción o aglomerado, según la fuente." />
            <Principle icon={BookOpen} title="Metodología" text="Definiciones, universo, unidad y notas del organismo." />
            <Principle icon={ShieldCheck} title="Trazabilidad" text="Fuente oficial y estado del dato claramente identificados." />
          </div>
        </div>
      </section>

      <section id="metodologia" className="border-y border-ink-foreground/10 bg-ink-2/45 py-12">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 md:grid-cols-3">
          <div>
            <p className="eyebrow text-lime">FUENTE PRINCIPAL</p>
            <h2 className="mt-3 text-2xl font-semibold">Estadísticas oficiales.</h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-muted">
              Los datos se obtendrán de los servicios publicados por el Instituto Nacional de Estadística y Censos.
            </p>
            <a href="https://api.indec.gob.ar/docs" target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm text-mint hover:text-lime">
              Documentación API-INDEC <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
          <div>
            <p className="eyebrow text-lime">METODOLOGÍA</p>
            <h3 className="mt-3 text-xl font-semibold">Comparar con criterio.</h3>
            <p className="mt-3 text-sm leading-relaxed text-ink-muted">
              Las series pueden tener distintas frecuencias, universos, bases y coberturas. Radar debe advertir esas diferencias antes de comparar resultados.
            </p>
          </div>
          <div>
            <p className="eyebrow text-lime">DESARROLLADO POR</p>
            <h3 className="mt-3 text-xl font-semibold">Datacraft Argentina.</h3>
            <p className="mt-3 text-sm leading-relaxed text-ink-muted">
              Tecnología aplicada a datos públicos: integración, procesamiento y visualización para transformar información en herramientas de análisis.
            </p>
            <Link to="/" hash="contacto" className="mt-4 inline-flex items-center gap-2 text-sm text-mint hover:text-lime">
              Contactar a Datacraft <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <footer className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-8 text-xs text-ink-muted">
        <span>RADAR ESTADÍSTICO ARGENTINA · DATACRAFT LAB</span>
        <Link to="/observatorio" className="inline-flex items-center gap-2 hover:text-lime">
          <ArrowLeft className="h-3.5 w-3.5" /> Volver a Proyectos
        </Link>
      </footer>
    </div>
  );
}

function Metadata({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: typeof BarChart3;
}) {
  return (
    <div className="flex min-h-[88px] gap-3 rounded-lg border border-ink-foreground/10 bg-ink/50 p-3">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-lime" />
      <div>
        <p className="text-[11px] uppercase tracking-wider text-ink-muted">{label}</p>
        <p className="mt-1 text-sm font-medium leading-snug">{value}</p>
      </div>
    </div>
  );
}

function Principle({
  icon: Icon,
  title,
  text,
}: {
  icon: typeof BookOpen;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-xl border border-ink-foreground/10 bg-ink-2/50 p-5">
      <Icon className="h-5 w-5 text-lime" />
      <h3 className="mt-4 font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-muted">{text}</p>
    </div>
  );
}
