export type RadarMetadata = {
  description: string;
  interpretation?: string;
};

const FIELD_METADATA: Record<string, RadarMetadata> = {
  area_geografica_nom: { description: "Área geográfica de publicación de la EPH. En la consulta actualmente validada se observa el total T_31_A, correspondiente a 31 aglomerados urbanos.", interpretation: "No ofrece desagregación individual por ciudad o municipio en el servicio consultado." },
  area_geografica_cod: { description: "Código geográfico asociado al área de publicación de la EPH.", interpretation: "La presencia del campo en la especificación no implica que la respuesta publique todas las áreas por separado." },
  tipo_de_indicador_descripcion: { description: "Etiqueta textual de la métrica o serie estadística publicada por INDEC.", interpretation: "Usá esta descripción junto con el código de tipo de indicador para distinguir nivel, variación y serie." },
  anio: { description: "Año calendario al que pertenece la observación.", interpretation: "Para frecuencias inferiores al año, debe interpretarse junto con el mes o trimestre." },
  mes: { description: "Mes calendario de referencia de la observación.", interpretation: "El mes forma parte del período; no debe tratarse como un dato independiente del año." },
  valor_null: { description: "Marca estadística asociada a un valor no numérico o a una observación con tratamiento especial.", interpretation: "No reemplazar marcas por cero. Consultá la leyenda de marcas INDEC y conservá la observación original." },
  observaciones: { description: "Nota textual publicada por INDEC sobre la observación.", interpretation: "Puede aclarar carácter provisional, preliminar, estimado u otra condición del dato." },
  periodRange: { description: "Define el tramo histórico que querés consultar: todos los períodos disponibles o una ventana reciente de uno, dos o cinco años.", interpretation: "El filtro limita la consulta; no cambia la frecuencia ni la cobertura del indicador." },
  periodo: { description: "Identifica el momento al que corresponde la observación. Su formato depende de la frecuencia: mes, trimestre, semestre o año.", interpretation: "Compará períodos equivalentes y respetá la frecuencia de publicación del indicador." },
  fecha: { description: "Fecha de referencia de la estimación o proyección de población.", interpretation: "Las proyecciones nacionales y jurisdiccionales toman como referencia el 1 de julio de cada año." },
  region: { description: "Ámbito geográfico al que corresponde el dato. En IPC distingue el nivel nacional y las regiones estadísticas; en otros servicios puede referir a una cobertura específica.", interpretation: "La región no amplía la cobertura original del relevamiento." },
  clasificador: { description: "Sistema de clasificación utilizado para ordenar actividades, productos, divisiones o categorías estadísticas.", interpretation: "Solo compará observaciones que utilicen el mismo clasificador." },
  nivel: { description: "Profundidad dentro de una clasificación: por ejemplo, división, grupo, clase, categoría o subcategoría.", interpretation: "Un nivel más detallado no es directamente comparable con el total o con otro nivel." },
  codigo: { description: "Identificador oficial de una apertura dentro del clasificador y nivel seleccionados.", interpretation: "El código debe leerse junto con su clasificador, nivel y descripción; no siempre identifica una categoría por sí solo." },
  codigo_apertura: { description: "Código oficial de la categoría o apertura estadística seleccionada.", interpretation: "Mantené el mismo clasificador y nivel al comparar categorías." },
  descripcion: { description: "Nombre legible de la categoría, producto, actividad o apertura publicado por INDEC.", interpretation: "La descripción debe interpretarse junto con el código y la clasificación de origen." },
  indicador: { description: "Identifica el índice, operativo o conjunto estadístico dentro del servicio consultado.", interpretation: "Elegí un mismo indicador cuando compares su evolución temporal." },
  tipo_de_indicador: { description: "Define qué medida publica la observación: nivel de índice, variación o incidencia, según el servicio.", interpretation: "No mezcles índices, porcentajes y puntos porcentuales: tienen unidades y significados distintos." },
  serie: { description: "Versión estadística de la serie: original, desestacionalizada o tendencia-ciclo, cuando el servicio las publica.", interpretation: "No compares directamente niveles o variaciones de distintas versiones de una serie." },
  unidad_de_medida: { description: "Unidad en la que está expresado el valor publicado, por ejemplo número índice, porcentaje, pesos o puntos porcentuales.", interpretation: "La unidad determina cómo debe leerse y graficarse el valor." },
  frecuencia: { description: "Periodicidad con la que INDEC publica nuevas observaciones del indicador.", interpretation: "Los períodos no publicados no deben completarse por interpolación sin una metodología explícita." },
  servicio: { description: "Operación estadística del INDEC que produce la información consultada.", interpretation: "El servicio identifica la fuente; no implica que todas sus aperturas estén validadas en Radar." },
  frequency: { description: "Periodicidad con la que se publica el indicador: mensual, trimestral, semestral o anual.", interpretation: "No interpolar períodos sin observaciones ni tratar frecuencias distintas como equivalentes." },
  tasa_pobreza_personas: { description: "Porcentaje de personas cuyos ingresos no alcanzan el valor de la Canasta Básica Total.", interpretation: "El denominador es la población de referencia; cobertura EPH: total de 31 aglomerados urbanos." },
  tasa_indigencia_personas: { description: "Porcentaje de personas cuyos ingresos no alcanzan el valor de la Canasta Básica Alimentaria.", interpretation: "El denominador es la población de referencia; cobertura EPH: total de 31 aglomerados urbanos." },
  tasa_pobreza_hogares: { description: "Porcentaje de hogares cuyos ingresos no alcanzan el valor de la Canasta Básica Total.", interpretation: "Es una tasa de hogares, no de personas; cobertura EPH: total de 31 aglomerados urbanos." },
  tasa_indigencia_hogares: { description: "Porcentaje de hogares cuyos ingresos no alcanzan el valor de la Canasta Básica Alimentaria.", interpretation: "Es una tasa de hogares, no de personas; cobertura EPH: total de 31 aglomerados urbanos." },
  tasa_de_actividad: { description: "Porcentaje de la población total de referencia que integra la población económicamente activa (ocupados + desocupados).", interpretation: "No utiliza el mismo denominador que la tasa de desocupación." },
  tasa_de_empleo: { description: "Porcentaje de la población total de referencia que está ocupada.", interpretation: "No confundir con empleo formal o informal, que se calculan sobre universos específicos." },
  tasa_de_desocupacion: { description: "Porcentaje de la población económicamente activa que está desocupada y busca empleo.", interpretation: "El denominador es la población económicamente activa, no la población total." },
  tasa_de_empleo_formal: { description: "Proporción de la población ocupada clasificada como empleo formal según la definición de INDEC.", interpretation: "Leer con el universo y la definición operativa publicados para el período." },
  tasa_de_empleo_informal: { description: "Proporción de la población ocupada clasificada como empleo informal según la definición de INDEC.", interpretation: "El universo es la población ocupada; no comparar como si fuera una tasa sobre la población total." },
  tasa_de_ocupacion_demandante: { description: "Porcentaje de la población económicamente activa que está ocupada y busca activamente otra ocupación.", interpretation: "El denominador es la población económicamente activa, según la definición de la EPH." },
  tasa_de_subocupacion: { description: "Porcentaje de la población económicamente activa que está ocupada menos de 35 horas semanales por causas involuntarias y desea trabajar más.", interpretation: "El denominador es la población económicamente activa, según la definición de INDEC." },
  tasa_de_subocupacion_demandante: { description: "Porcentaje de la población económicamente activa que está subocupada y busca activamente otra ocupación.", interpretation: "El denominador es la población económicamente activa; no sumar tasas como si fueran categorías independientes." },
  tasa_de_subocupacion_no_demandante: { description: "Porcentaje de la población económicamente activa que está subocupada y no busca activamente otra ocupación.", interpretation: "El denominador es la población económicamente activa; no sumar tasas como si fueran categorías independientes." },
  rubro_cod: { description: "Agrupación principal de bienes que organiza las exportaciones por grandes rubros.", interpretation: "El subrubro y los destinos disponibles se limitan a las observaciones del rubro elegido." },
  subrubro_cod: { description: "Desagregación de bienes dentro del rubro principal de exportación.", interpretation: "Solo está disponible dentro del rubro seleccionado." },
  pais_cod: { description: "Código del país asociado al flujo comercial. En exportaciones representa destino; en importaciones, origen.", interpretation: "El nombre se obtiene del nomenclador oficial de INDEC; el código se conserva como identificador." },
  uso_economico_cod: { description: "Clasifica las importaciones según el uso económico de los bienes (por ejemplo, consumo, intermedios o capital).", interpretation: "La clasificación GCE depende del uso económico seleccionado." },
  gce_cod: { description: "Código de la clasificación por Grandes Categorías Económicas (GCE).", interpretation: "Se interpreta dentro del uso económico correspondiente." },
  jurisdiccion_nom: { description: "Nombre de la provincia o jurisdicción estadística.", interpretation: "No equivale a un departamento o partido; seleccioná la desagregación territorial correspondiente." },
  jurisdiccion_cod: { description: "Código oficial de la jurisdicción.", interpretation: "Se conserva como texto para no perder ceros iniciales." },
  departamento_cod: { description: "Código oficial del departamento, partido o comuna según la división territorial del INDEC.", interpretation: "Debe combinarse con el código de jurisdicción para identificar la unidad territorial." },
  departamento_nom: { description: "Nombre del departamento, partido o comuna al que corresponde la estimación.", interpretation: "La unidad territorial depende de la organización administrativa de cada jurisdicción." },
  sexo_cod: { description: "Código de sexo utilizado en la publicación estadística.", interpretation: "En proyecciones nacionales, INDEC publica 1 = Mujer y 2 = Varón; mantener los códigos originales." },
  edad: { description: "Edad expresada en años cumplidos para la población nacional.", interpretation: "No confundir con grupos quinquenales de edad de las proyecciones por jurisdicción." },
  edad_cod: { description: "Código del grupo de edad utilizado en la proyección por jurisdicción.", interpretation: "La categoría debe leerse junto con su etiqueta y la fecha de referencia." },
  rmba: { description: "Marca de pertenencia a la Región Metropolitana de Buenos Aires según la variable publicada por INDEC.", interpretation: "No reemplaza el código de jurisdicción ni identifica por sí sola un municipio." },
  codigo_CLaNAE_2004: { description: "Código de actividad económica según la Clasificación Nacional de Actividades Económicas 2004.", interpretation: "Un mismo código de producto/actividad puede repetirse en aperturas distintas; usar también cuadro, descripción, serie y tipo de indicador." },
  cuadro_web: { description: "Número del cuadro de publicación del IPI manufacturero al que pertenece la observación.", interpretation: "Permite distinguir conjuntos de resultados con estructuras diferentes." },
  codigo_CPC_1: { description: "Código de producto de la Clasificación Central de Productos, versión 1.", interpretation: "Identifica una apertura de productos; no sustituye el clasificador ni el nivel estadístico." },
  Periodo: { description: "Período de referencia publicado para la observación.", interpretation: "En comercio y canastas suele codificarse como año y mes; respetá el período original." },
  valor_FOB: { description: "Valor de las exportaciones medido a precios FOB (Free on Board), en dólares.", interpretation: "No incluye los costos de seguro y flete internacionales posteriores al embarque." },
  valor_CIF: { description: "Valor de las importaciones medido a precios CIF (Cost, Insurance and Freight), en dólares.", interpretation: "Incluye costo, seguro y flete hasta el punto de ingreso definido por la estadística." },
  Peso_Neto: { description: "Peso neto de los bienes comercializados, expresado en la unidad publicada por INDEC.", interpretation: "No es un valor monetario; revisar unidad y escala antes de comparar." },
  poblacion: { description: "Cantidad estimada o proyectada de personas para la unidad geográfica, edad y sexo seleccionados.", interpretation: "Distinguir estimaciones retrospectivas de proyecciones futuras y conservar la fecha de referencia." },
  cuid: { description: "Componente asociado al valor económico del tiempo de cuidado requerido para el tramo de edad.", interpretation: "No representa necesariamente un pago observado por cada hogar; es una valorización estadística." },
  bys: { description: "Componente de bienes y servicios necesarios para el cuidado del tramo de edad.", interpretation: "Se publica separado del componente de tiempo de cuidado y del total." },
  total: { description: "Valor total publicado para el tramo de edad seleccionado.", interpretation: "Se utiliza el total de INDEC; no se recalcula sumando componentes porque puede haber diferencias de redondeo." },
};

const INDICATOR_METADATA: Record<string, RadarMetadata> = {
  ipc: { description: "Mide la evolución de los precios de una canasta representativa del consumo de los hogares. Publica índices, variaciones e incidencias.", interpretation: "El índice tiene base diciembre de 2016 = 100. La cobertura incluye el total nacional y seis regiones estadísticas." },
  salarios: { description: "Mide la evolución de los salarios de los sectores registrados y no registrados, según las aperturas publicadas.", interpretation: "El índice tiene base octubre de 2016 = 100; sus variaciones son nominales y no miden por sí solas el poder adquisitivo." },
  emae: { description: "Estimación mensual de la actividad económica agregada, utilizada como indicador de corto plazo de la evolución del PIB.", interpretation: "Distinguir serie original, desestacionalizada y tendencia-ciclo; la cobertura es nacional y la frecuencia mensual." },
  pobreza: { description: "Mide la proporción de personas y hogares cuyos ingresos no alcanzan la Canasta Básica Total o la Canasta Básica Alimentaria.", interpretation: "EPH: total de 31 aglomerados urbanos; publicación semestral. No representa cada municipio ni la población rural." },
  "mercado-laboral": { description: "Reúne tasas de actividad, empleo, desocupación, subocupación y características de la ocupación.", interpretation: "EPH: total de 31 aglomerados urbanos; publicación trimestral. Cada tasa tiene un universo y denominador que deben leerse por separado." },
  "cba-cbt": { description: "Valoriza la Canasta Básica Alimentaria (CBA) y la Canasta Básica Total (CBT), utilizadas para las líneas de indigencia y pobreza.", interpretation: "Cobertura Gran Buenos Aires. La CBA representa requerimientos alimentarios; la CBT incorpora bienes y servicios no alimentarios." },
  "canasta-crianza": { description: "Estima el costo mensual de bienes y servicios y del tiempo de cuidado para cuatro tramos de edad.", interpretation: "Cobertura Gran Buenos Aires. INDEC publica por separado bienes y servicios, tiempo de cuidado y total; usar el total publicado." },
  exportaciones: { description: "Registra las ventas de bienes al exterior por rubro, subrubro y país de destino.", interpretation: "Los valores monetarios se expresan en FOB; existen supresiones por secreto estadístico y las clasificaciones dependen del nomenclador oficial." },
  importaciones: { description: "Registra las compras de bienes al exterior por uso económico, GCE y país de origen.", interpretation: "Los valores monetarios se expresan en CIF; existen supresiones por secreto estadístico y las clasificaciones dependen del nomenclador oficial." },
  canastas: { description: "Valoriza la Canasta Básica Alimentaria (CBA) y la Canasta Básica Total (CBT), utilizadas para las líneas de indigencia y pobreza.", interpretation: "Cobertura Gran Buenos Aires. La CBA representa requerimientos alimentarios; la CBT incorpora bienes y servicios no alimentarios." },
  poblacion: { description: "Presenta estimaciones de población por departamento, partido o comuna y sexo.", interpretation: "Cobertura departamental, frecuencia anual, período 2022–2035. No confundir con las proyecciones por jurisdicción o nacionales." },
  "poblacion-departamento": { description: "Presenta estimaciones de población por departamento/partido/comuna y sexo.", interpretation: "Cobertura departamental, frecuencia anual, período 2022–2035. No confundir con las proyecciones por jurisdicción o nacionales." },
  "poblacion-jurisdiccion": { description: "Presenta proyecciones de población por provincia/jurisdicción, sexo y grupos quinquenales de edad.", interpretation: "Cobertura nacional por jurisdicción, frecuencia anual, horizonte 2022–2040." },
  "poblacion-nacional": { description: "Presenta proyecciones de población del total del país por edad y sexo.", interpretation: "Frecuencia anual, horizonte 2022–2040 y referencia al 1 de julio de cada año." },
  "ipi-manufacturero": { description: "Mide la evolución de la producción industrial manufacturera mediante índices y variaciones para distintas actividades y productos.", interpretation: "Servicio registrado, pero no habilitado en Radar: la descarga inicial no reemplaza la validación integral de filtros, series, marcas e interfaz." },
  sipm: { description: "Reúne los índices de precios internos al por mayor (IPIM), básicos del productor (IPP) y básicos del productor de productos importados (IPIB).", interpretation: "Cobertura nacional y frecuencia mensual. Mantener homogéneos indicador, clasificador y nivel al comparar aperturas." },
  "costo-construccion": { description: "Mide la evolución del costo de construcción mediante materiales, mano de obra y gastos asociados.", interpretation: "Cobertura Gran Buenos Aires; no representa el costo de construcción de todo el país." },
};

export function getRadarIndicatorMetadata(indicatorId: string): RadarMetadata | null {
  return INDICATOR_METADATA[indicatorId] ?? null;
}

export function getRadarFieldMetadata(indicatorId: string, field: string, value?: string): RadarMetadata | null {
  const canonicalId = indicatorId === "canastas" ? "cba-cbt" : indicatorId === "poblacion" ? "poblacion-departamento" : indicatorId;
  const normalized = field.toLocaleLowerCase("es-AR");
  const base = FIELD_METADATA[field] ?? FIELD_METADATA[normalized];
  let metadata = base;
  if (!metadata && canonicalId === "canasta-crianza") {
    if (field.startsWith("bys_")) metadata = FIELD_METADATA.bys;
    else if (field.startsWith("cuid_")) metadata = FIELD_METADATA.cuid;
    else if (field.startsWith("tot_")) metadata = FIELD_METADATA.total;
  }
  if (!metadata) return null;
  if (value?.trim() && field === "region" && canonicalId === "ipc") {
    const regions: Record<string, string> = {
      GBA: "Gran Buenos Aires, agrupamiento estadístico que incluye la Ciudad Autónoma de Buenos Aires y los partidos del conurbano relevados por INDEC.",
      Nacional: "Total nacional; reúne el conjunto de hogares cubiertos por la medición del IPC.",
      Pampeana: "Región estadística Pampeana definida por INDEC; no equivale a una provincia individual.",
      Noreste: "Región estadística Noreste definida por INDEC; no equivale a una provincia individual.",
      Noroeste: "Región estadística Noroeste definida por INDEC; no equivale a una provincia individual.",
      Cuyo: "Región estadística Cuyo definida por INDEC; no equivale a una provincia individual.",
      Patagonia: "Región estadística Patagonia definida por INDEC; no equivale a una provincia individual.",
    };
    if (regions[value]) return { description: metadata.description, interpretation: `Selección actual: ${regions[value]}` };
  }
  if (value?.trim() && field === "periodRange") {
    const ranges: Record<string, string> = { all: "Todos los períodos disponibles", "5y": "Últimos cinco años", "2y": "Últimos dos años", "1y": "Último año" };
    return { description: metadata.description, interpretation: `Selección actual: ${ranges[value] ?? value}. El rango limita la consulta, no modifica la frecuencia de publicación.` };
  }
  if (value?.trim() && field === "area_geografica_nom" && value === "T_31_A") {
    return { description: metadata.description, interpretation: "Selección actual: total de los 31 aglomerados urbanos relevados por la EPH; no es una ciudad ni un municipio." };
  }
  if (value?.trim() && field === "indicador" && canonicalId === "salarios") {
    const salaryLabels: Record<string, string> = {
      "Sector público": "Evolución de las remuneraciones del personal del sector público.",
      "Privado registrado": "Evolución de las remuneraciones del empleo asalariado privado registrado.",
      "Privado no registrado": "Estimación de la evolución de los salarios del empleo privado no registrado a partir de la EPH.",
    };
    const label = salaryLabels[value];
    if (label) return { description: metadata.description, interpretation: `Selección actual: ${value}. ${label}` };
  }
  if (value?.trim() && field === "indicador" && canonicalId === "sipm") {
    const labels: Record<string, string> = {
      IPIB: "Índice de precios internos básicos al por mayor: cubre productos nacionales e importados ofrecidos en el mercado interno, con precios considerados sin impuestos.",
      IPIM: "Índice de precios internos al por mayor: mide los precios de productos nacionales e importados ofrecidos en el mercado interno, incluidos IVA y otros impuestos.",
      IPP: "Índice de precios básicos del productor: mide productos exclusivamente de origen nacional, destinados al mercado interno y a la exportación, sin impuestos.",
    };
    if (labels[value]) return { description: metadata.description, interpretation: `Selección actual: ${value}. ${labels[value]}` };
  }
  if (value?.trim() && field === "indicador" && canonicalId === "cba-cbt") {
    if (/^CBA$/i.test(value)) return { description: metadata.description, interpretation: "Selección actual: CBA. Canasta Básica Alimentaria: valor de los alimentos necesarios para cubrir requerimientos nutricionales; se utiliza como línea de indigencia." };
    if (/^CBT$/i.test(value)) return { description: metadata.description, interpretation: "Selección actual: CBT. Canasta Básica Total: incorpora a la CBA bienes y servicios no alimentarios; se utiliza como línea de pobreza." };
  }
  if (value?.trim() && field === "tipo_de_indicador") {
    const code = value.toLocaleLowerCase("es-AR");
    const definitions: Record<string, string> = {
      indice: "Nivel del índice en relación con su período base; no es una tasa de variación.",
      v_m: "Variación porcentual respecto del período inmediatamente anterior.",
      v_ia: "Variación porcentual respecto del mismo período del año anterior.",
      v_acum: "Variación porcentual acumulada desde el período de referencia anual.",
      incidencia: "Contribución a la variación del indicador general, expresada en puntos porcentuales.",
      incidencia_m: "Contribución a la variación mensual, expresada en puntos porcentuales.",
      incidencia_ia: "Contribución a la variación interanual, expresada en puntos porcentuales.",
      incidencia_acum: "Contribución a la variación acumulada, expresada en puntos porcentuales.",
    };
    const dynamicDefinition = definitions[code]
      ?? (code.includes("incidencia") ? "Contribución a la variación del indicador general, expresada en puntos porcentuales."
        : code.includes("interanual") ? "Variación porcentual respecto del mismo período del año anterior."
          : code.includes("acumulada") ? "Variación porcentual acumulada desde el período de referencia anual."
            : code.includes("mensual") ? "Variación porcentual respecto del período inmediatamente anterior."
              : code.includes("índice") || code.includes("indice") ? "Nivel del índice respecto de su período base; no es una tasa de variación."
                : "");
    if (dynamicDefinition) return { description: metadata.description, interpretation: `Selección actual: ${value}. ${dynamicDefinition}` };
  }
  if (value?.trim() && field === "serie") {
    const series = value.toLocaleLowerCase("es-AR");
    if (series.includes("original")) return { description: metadata.description, interpretation: "La serie original conserva los efectos estacionales y de calendario observados." };
    if (series.includes("desestacionalizada")) return { description: metadata.description, interpretation: "La serie ajusta patrones estacionales para facilitar comparaciones entre períodos consecutivos." };
    if (series.includes("tendencia")) return { description: metadata.description, interpretation: "La serie suaviza componentes estacionales e irregulares para mostrar la trayectoria subyacente." };
  }
  if (value?.trim() && field === "sexo_cod") {
    if (value === "1") return { description: metadata.description, interpretation: "Selección actual: 1 = Mujer, según la codificación de las proyecciones nacionales del INDEC." };
    if (value === "2") return { description: metadata.description, interpretation: "Selección actual: 2 = Varón, según la codificación de las proyecciones nacionales del INDEC." };
  }
  if (!value?.trim()) return metadata;
  return {
    description: metadata.description,
    interpretation: `Selección actual: ${value}. ${metadata.interpretation ?? "El valor corresponde a una categoría publicada por INDEC; conservá su denominación y código al comparar."}`,
  };
}

export function getRadarMetricMetadata(indicatorId: string, metricValue: string, metricLabel: string): RadarMetadata {
  const canonicalId = indicatorId === "canastas" ? "cba-cbt" : indicatorId === "poblacion" ? "poblacion-departamento" : indicatorId;
  const metric = metricLabel.toLocaleLowerCase("es-AR");
  if (canonicalId === "ipc" || canonicalId === "salarios" || canonicalId === "sipm" || canonicalId === "costo-construccion" || canonicalId === "cba-cbt") {
    if (metric.includes("incidencia")) return { description: "Aporte de una categoría a la variación del indicador general, expresado en puntos porcentuales.", interpretation: "No es el porcentaje de aumento de esa categoría ni una tasa porcentual." };
    if (metric.includes("índice")) return { description: "Nivel del índice en relación con su período base.", interpretation: "No es una variación del período. Para medir aumentos, elegí una variación mensual, interanual o acumulada." };
    if (metric.includes("interanual")) return { description: "Cambio porcentual respecto del mismo período del año anterior.", interpretation: "Compara períodos separados por doce meses; no representa el cambio del último mes." };
    if (metric.includes("acumulada")) return { description: "Cambio porcentual acumulado desde el período de referencia anual definido por INDEC.", interpretation: "No equivale a la variación mensual ni a la interanual." };
    if (metric.includes("mensual")) return { description: "Cambio porcentual respecto del período inmediatamente anterior.", interpretation: "Representa un cambio entre períodos consecutivos, no de doce meses." };
    if (metricValue === "Indice") return { description: "Nivel del índice publicado para la selección actual.", interpretation: "Interpretalo con la base, el indicador y la apertura seleccionados." };
  }
  if (canonicalId === "cba-cbt") {
    return { description: "Valor en pesos corrientes de la Canasta Básica Alimentaria (CBA) o la Canasta Básica Total (CBT) para Gran Buenos Aires.", interpretation: "La CBA se usa como línea de indigencia; la CBT, que incorpora bienes y servicios no alimentarios, como línea de pobreza." };
  }
  if (canonicalId === "emae") {
    if (metric.includes("índice") || metric.includes("indice")) return { description: "Número índice que representa el nivel de actividad económica respecto de la base 2004=100.", interpretation: "La serie original conserva efectos estacionales; la desestacionalizada y la tendencia-ciclo tienen tratamientos diferentes." };
    if (metric.includes("interanual")) return { description: "Cambio respecto del mismo mes del año anterior, calculado sobre la serie original.", interpretation: "El índice del EMAE usa base 2004=100. La serie original conserva efectos estacionales; no comparar esta tasa con la variación mensual desestacionalizada." };
    if (metric.includes("desestacionalizada")) return { description: "Serie ajustada para remover patrones estacionales y facilitar comparaciones entre meses.", interpretation: "El índice del EMAE usa base 2004=100; la variación mensual se calcula sobre la serie ajustada. No mezclar con serie original o tendencia-ciclo." };
    if (metric.includes("tendencia-ciclo")) return { description: "Estimación suavizada de la trayectoria subyacente de la actividad.", interpretation: "El índice del EMAE usa base 2004=100. No reemplaza la serie original y puede revisarse al incorporar nuevos datos." };
  }
  if (canonicalId === "pobreza" || canonicalId === "mercado-laboral" || canonicalId === "canasta-crianza") {
    const entry = getRadarFieldMetadata(canonicalId, metricValue);
    if (entry) return entry;
  }
  if (canonicalId === "exportaciones" || canonicalId === "importaciones") {
    return { description: metricLabel.includes("FOB") ? FIELD_METADATA.valor_FOB.description : metricLabel.includes("CIF") ? FIELD_METADATA.valor_CIF.description : "Magnitud de comercio exterior publicada por INDEC para el período y clasificación seleccionados.", interpretation: "No confundir valor monetario con peso neto; respetar la unidad y las supresiones estadísticas." };
  }
  if (canonicalId.startsWith("poblacion")) return { description: "Cantidad de personas estimada o proyectada para la selección territorial, temporal, etaria y de sexo.", interpretation: "Distinguir estimaciones de proyecciones y mantener la misma fecha y desagregación al comparar." };
  return { description: `Medida publicada por INDEC: ${metricLabel}.`, interpretation: "La definición y unidad deben leerse junto con el indicador y las dimensiones seleccionadas; no combinar aperturas heterogéneas." };
}

export function RadarMetadataHelp({ metadata, className = "" }: { metadata: RadarMetadata | null; className?: string }) {
  if (!metadata) return null;
  return (
    <span className={`mt-1 block text-[11px] leading-relaxed text-ink-muted ${className}`}>
      {metadata.description}
      {metadata.interpretation ? <span className="mt-1 block text-ink-muted/80">{metadata.interpretation}</span> : null}
    </span>
  );
}
