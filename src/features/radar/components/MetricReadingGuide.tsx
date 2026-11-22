type ReadingGuide = {
  heading: string;
  explanation: string;
  caution: string;
};

export function getMetricReadingGuide(indicatorId: string, metricLabel: string): ReadingGuide | null {
  const metric = metricLabel.toLocaleLowerCase("es-AR");

  if (indicatorId === "ipc") {
    if (metric.includes("incidencia")) return {
      heading: "Cómo leer la incidencia",
      explanation: "Expresa cuántos puntos porcentuales aporta esta división o categoría a la variación del nivel general. No es una tasa de inflación ni el porcentaje de aumento de esa categoría.",
      caution: "La incidencia se interpreta en puntos porcentuales (pp), no como porcentaje (%).",
    };
    if (metric.includes("índice")) return {
      heading: "Cómo leer el índice",
      explanation: "El nivel del índice compara los precios con la base diciembre de 2016 = 100. Un valor de 200 representa el doble del nivel de precios de ese período base; no significa que los precios hayan aumentado 200% en el último mes.",
      caution: "El índice mide niveles; para analizar aumentos entre períodos seleccioná una variación.",
    };
    if (metric.includes("interanual")) return {
      heading: "Cómo leer la variación interanual",
      explanation: "Mide el cambio porcentual respecto del mismo mes del año anterior. Permite comparar períodos equivalentes y no debe confundirse con la variación mensual.",
      caution: "Es una variación de doce meses, no la inflación del último mes.",
    };
    if (metric.includes("acumulada")) return {
      heading: "Cómo leer la variación acumulada",
      explanation: "Mide el cambio porcentual acumulado desde diciembre del año anterior hasta el período seleccionado.",
      caution: "No equivale a la variación interanual ni a la variación mensual.",
    };
    return {
      heading: "Cómo leer la variación mensual",
      explanation: "Mide el cambio porcentual del nivel de precios respecto del mes inmediatamente anterior.",
      caution: "Es una variación entre dos meses consecutivos; no representa el cambio de los últimos doce meses.",
    };
  }

  if (indicatorId === "salarios") {
    if (metric.includes("índice")) return {
      heading: "Cómo leer el índice salarial",
      explanation: "El índice compara la evolución de los salarios con la base octubre de 2016 = 100. Permite observar la trayectoria del nivel salarial medido por el índice.",
      caution: "El índice no expresa pesos ni poder adquisitivo; para analizar cambios entre períodos seleccioná una variación.",
    };
    if (metric.includes("interanual")) return {
      heading: "Cómo leer la variación interanual",
      explanation: "Mide el cambio porcentual del índice salarial respecto del mismo mes del año anterior.",
      caution: "Es una variación nominal del índice; por sí sola no mide la evolución del poder adquisitivo.",
    };
    if (metric.includes("acumulada")) return {
      heading: "Cómo leer la variación acumulada",
      explanation: "Mide el cambio porcentual acumulado desde diciembre del año anterior.",
      caution: "No equivale a la variación interanual ni a una comparación directa con la inflación.",
    };
    return {
      heading: "Cómo leer la variación mensual",
      explanation: "Mide el cambio porcentual del índice salarial respecto del mes anterior.",
      caution: "Es una variación nominal; no representa por sí sola una mejora o pérdida del poder adquisitivo.",
    };
  }

  if (indicatorId === "emae") {
    if (metric.includes("interanual")) return {
      heading: "Cómo leer la variación interanual",
      explanation: "Compara la actividad económica con el mismo mes del año anterior. La serie original conserva los movimientos estacionales del calendario.",
      caution: "No comparar esta tasa con una variación mensual desestacionalizada.",
    };
    if (metric.includes("tendencia-ciclo")) return {
      heading: "Cómo leer la tendencia-ciclo",
      explanation: "La serie busca mostrar la trayectoria subyacente de la actividad, suavizando movimientos estacionales e irregulares. Su variación mensual permite observar cambios de tendencia.",
      caution: "Es una estimación de tendencia; no reemplaza el dato de la serie original.",
    };
    if (metric.includes("desestacionalizada")) return {
      heading: "Cómo leer la serie desestacionalizada",
      explanation: "La serie ajusta patrones estacionales para facilitar la comparación entre meses consecutivos. La variación mensual se calcula sobre esa serie ajustada.",
      caution: "No mezclar su nivel o variación con los de la serie original o tendencia-ciclo.",
    };
    return {
      heading: "Cómo leer la serie original",
      explanation: "La serie original refleja la actividad observada e incluye efectos estacionales y de calendario. Para comparar meses consecutivos suele ser más apropiada la serie desestacionalizada.",
      caution: "Una diferencia entre meses puede responder a factores estacionales.",
    };
  }

  if (indicatorId === "pobreza") return {
    heading: "Cómo leer esta tasa",
    explanation: metric.includes("hogares")
      ? "Indica qué proporción de los hogares relevados se encuentra bajo la línea de pobreza o indigencia, según la métrica seleccionada."
      : "Indica qué proporción de las personas relevadas se encuentra bajo la línea de pobreza o indigencia, según la métrica seleccionada.",
    caution: "La cobertura es el total de 31 aglomerados urbanos de la EPH. No representa una provincia, un municipio ni la población rural.",
  };

  if (indicatorId === "mercado-laboral") {
    const denominator = metric.includes("actividad")
      ? "La tasa de actividad relaciona la población económicamente activa con la población total de referencia."
      : metric.includes("empleo informal")
        ? "La tasa de empleo informal utiliza como universo a la población ocupada."
        : metric.includes("empleo")
          ? "La tasa de empleo relaciona la población ocupada con la población total de referencia."
          : metric.includes("desocup")
            ? "La tasa de desocupación relaciona a las personas desocupadas con la población económicamente activa."
            : "La tasa seleccionada tiene un universo y denominador propios definidos por INDEC.";
    return {
      heading: "Cómo leer esta tasa",
      explanation: denominator,
      caution: "La cobertura es el total de 31 aglomerados urbanos de la EPH. Las tasas no comparten necesariamente denominador y no deben compararse como si midieran la misma proporción.",
    };
  }

  if (indicatorId === "sipm") {
    if (metric.includes("incidencia")) return {
      heading: "Cómo leer la incidencia",
      explanation: "Expresa la contribución de una apertura a la variación del índice general, en puntos porcentuales.",
      caution: "No es una tasa porcentual ni el cambio de precio de la categoría.",
    };
    if (metric.includes("índice")) return {
      heading: "Cómo leer el índice",
      explanation: "Representa el nivel del índice de precios mayoristas para el indicador, clasificador, nivel y apertura seleccionados.",
      caution: "El nivel del índice no es una variación porcentual. Compará aperturas solo con clasificador y nivel homogéneos.",
    };
    return {
      heading: "Cómo leer la variación",
      explanation: metric.includes("interanual")
        ? "Compara el índice con el mismo período del año anterior."
        : metric.includes("acumulada")
          ? "Expresa el cambio acumulado desde el período de referencia anual utilizado por INDEC."
          : "Compara el índice con el período inmediatamente anterior.",
      caution: "La variación corresponde a la apertura seleccionada. No mezclar categorías de distintos clasificadores o niveles.",
    };
  }

  return null;
}

export function MetricReadingGuide({ indicatorId, metricLabel }: { indicatorId: string; metricLabel: string }) {
  const guide = getMetricReadingGuide(indicatorId, metricLabel);
  if (!guide) return null;

  return (
    <aside className="mt-4 rounded-xl border border-sky-300/20 bg-sky-300/5 p-4" aria-label="Guía de interpretación del indicador">
      <p className="text-xs font-semibold uppercase tracking-wide text-sky-200">{guide.heading}</p>
      <p className="mt-2 text-sm leading-relaxed text-ink-foreground">{guide.explanation}</p>
      <p className="mt-2 text-xs leading-relaxed text-ink-muted">{guide.caution}</p>
    </aside>
  );
}
