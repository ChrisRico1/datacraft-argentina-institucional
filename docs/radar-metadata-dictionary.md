# Diccionario de metadatos — Radar Estadístico Argentina

**Propósito:** explicar en lenguaje claro cada indicador, métrica, dimensión y selección que aparece en el explorador. Este diccionario complementa los valores originales de INDEC; no los reemplaza ni recalcula.

## Comportamiento en la interfaz

- Cada indicador del catálogo muestra una descripción debajo de su nombre.
- La ficha del indicador explica objetivo, unidad, frecuencia, cobertura y servicio.
- Cada selector de métrica muestra su definición y cómo interpretar el resultado.
- Cada filtro estadístico muestra qué representa la variable y, cuando se selecciona una opción, contextualiza la selección sin alterar el código ni el rótulo oficial.
- Los filtros dependientes conservan las jerarquías de los nomencladores; las etiquetas comerciales se obtienen del nomenclador oficial de INDEC.
- Los rangos de período y las desagregaciones de los gráficos explican qué dimensión se está limitando o visualizando.
- La tabla incluye un glosario de período, desagregación, valor, marca INDEC y observaciones.
- Los valores, códigos, marcas y observaciones originales se conservan. Una marca o un valor ausente no se convierte en cero.

La implementación está centralizada en `src/features/radar/radarMetadata.tsx`, conectada a los selectores de `src/routes/observatorio.radar-estadistico-argentina.tsx`. Las pruebas verifican cobertura de los 15 servicios, todas las dimensiones configuradas, métricas EPH, códigos dinámicos y las doce series de Canasta de crianza.

## Catálogo y significado

| Servicio | Qué mide | Unidad y lectura | Cobertura / límite |
|---|---|---|---|
| IPC | Evolución de precios de una canasta representativa del consumo de los hogares. | Índice base diciembre 2016=100; variaciones porcentuales; incidencias en puntos porcentuales. | Total nacional y regiones estadísticas, según serie. |
| Índice de salarios | Evolución de los salarios del sector público y privado registrado y no registrado. | Índice base octubre 2016=100 y variaciones nominales. | Nacional; una variación nominal no mide por sí sola poder adquisitivo. |
| EMAE | Evolución mensual de la actividad económica agregada, como indicador de corto plazo del PIB. | Índice base 2004=100 y variaciones. Diferenciar serie original, desestacionalizada y tendencia-ciclo. | Nacional; mensual. Las series no deben mezclarse. |
| Pobreza e indigencia | Proporción de hogares y personas cuyos ingresos no alcanzan la CBT o CBA. | Cuatro tasas: pobreza/indigencia en hogares/personas. | EPH, total de 31 aglomerados urbanos; semestral. No representa cada municipio ni áreas rurales. |
| Mercado de trabajo | Tasas de actividad, empleo, desocupación, informalidad, ocupación demandante y subocupación. | Porcentajes con universos y denominadores propios. Actividad y empleo se calculan sobre población total; desocupación y tasas de presión laboral sobre PEA; informalidad sobre ocupados. | EPH, total de 31 aglomerados urbanos; trimestral. |
| CBA / CBT | Valorización de la Canasta Básica Alimentaria y la Canasta Básica Total. | Pesos corrientes; CBA representa requerimientos alimentarios y CBT agrega bienes y servicios no alimentarios. | Gran Buenos Aires. |
| Canasta de crianza | Costo mensual de bienes y servicios y valorización del tiempo de cuidado para cuatro tramos etarios. | Pesos corrientes; bienes y servicios, tiempo de cuidado y total publicado. | Gran Buenos Aires; cuatro tramos: menores de 1, 1–3, 4–5 y 6–12 años. El total publicado no se recalcula. |
| Exportaciones | Ventas de bienes al exterior por rubro, subrubro y país de destino. | Valor FOB en dólares y peso neto en la unidad publicada. FOB no incluye seguro y flete internacionales posteriores al embarque. | Nacional; puede haber supresiones por secreto estadístico. |
| Importaciones | Compras de bienes al exterior por uso económico, GCE y país de origen. | Valor CIF en dólares y peso neto en la unidad publicada. CIF incluye costo, seguro y flete hasta el punto de ingreso definido por la estadística. | Nacional; puede haber supresiones por secreto estadístico. |
| Población por departamento | Estimaciones por departamento, partido o comuna y sexo. | Personas estimadas al 1 de julio de cada año. | País, 2022–2035. Son estimaciones subnacionales, no conteos censales anuales. |
| Población por jurisdicción | Proyecciones por provincia/jurisdicción, sexo y grupos de edad. | Personas proyectadas al 1 de julio de cada año. | Jurisdicciones argentinas, 2022–2040. |
| Población nacional | Proyecciones del total del país por edad y sexo. | Personas proyectadas al 1 de julio de cada año. | Total nacional, 2022–2040. |
| IPI manufacturero | Evolución de la producción industrial manufacturera por actividades y productos. | Número índice o variaciones; series original, desestacionalizada y tendencia-ciclo. | Nacional, mensual. **Permanece deshabilitado** hasta completar validación de filtros, integridad, marcas e interfaz. |
| SIPM | Evolución de precios mayoristas mediante IPIM, IPIB e IPP. | Índices, variaciones porcentuales e incidencias en puntos porcentuales. IPIM incluye impuestos; IPIB excluye impuestos; IPP comprende productos nacionales destinados al mercado interno y externo. | Nacional; mensual. Comparar aperturas con clasificador y nivel homogéneos. |
| ICC | Evolución del costo de construcción privada de edificios destinados a vivienda. | Índice, variaciones e incidencias; aperturas de materiales, mano de obra y gastos generales. | Ciudad Autónoma de Buenos Aires y 24 partidos del Gran Buenos Aires; no representa todo el país. |

## Definiciones de dimensiones y códigos

- **Período / fecha:** momento de referencia. El formato depende de la frecuencia del servicio.
- **Región / área geográfica:** ámbito al que corresponde el dato; no amplía la cobertura del relevamiento.
- **Clasificador:** sistema que organiza actividades, productos o categorías.
- **Nivel:** profundidad de la apertura estadística. Comparar solo niveles equivalentes.
- **Código de apertura:** identificador oficial de una categoría; debe leerse junto con clasificador, nivel y descripción.
- **Descripción:** denominación oficial legible de la apertura.
- **Indicador:** índice u operativo dentro del servicio; por ejemplo IPIM, IPIB o IPP en SIPM, y CBA o CBT en canastas básicas.
- **Tipo de indicador:** distingue nivel de índice, variación mensual, interanual, acumulada o incidencia. Una incidencia se expresa en puntos porcentuales, no en porcentaje.
- **Serie:** original, desestacionalizada o tendencia-ciclo. No mezclar sus niveles ni variaciones.
- **Rubro / subrubro:** niveles de clasificación de bienes exportados; el subrubro depende del rubro.
- **Uso económico / GCE:** clasificación de importaciones; GCE depende del uso económico.
- **País de destino / origen:** destino de exportaciones u origen de importaciones. La descripción se toma del nomenclador oficial.
- **Jurisdicción / departamento:** códigos y nombres de las unidades territoriales. Los códigos se mantienen como texto para preservar ceros iniciales.
- **Sexo:** dimensión publicada por INDEC; en proyecciones nacionales, los códigos se interpretan según el nomenclador del servicio.
- **Edad:** años cumplidos en población nacional o grupos quinquenales en proyecciones por jurisdicción.
- **ClaNAE 2004:** Clasificación Nacional de Actividades Económicas 2004.
- **CPC 1:** Clasificación Central de Productos, versión 1.
- **Cuadro web:** identifica el cuadro de publicación del IPI manufacturero.
- **FOB / CIF:** bases de valoración de exportaciones e importaciones; no son unidades intercambiables.
- **Peso neto:** cantidad física comercializada, no valor monetario. Está disponible en la respuesta consultada de exportaciones; no se presume su disponibilidad en importaciones.

## Tasas EPH: denominadores

Las tasas no comparten necesariamente denominador y no deben sumarse como si fueran magnitudes equivalentes:

- Actividad: población económicamente activa / población total de referencia.
- Empleo: población ocupada / población total de referencia.
- Desocupación: población desocupada / población económicamente activa.
- Ocupados demandantes: ocupados que buscan activamente otra ocupación / población económicamente activa.
- Subocupación: población subocupada / población económicamente activa.
- Subocupación demandante y no demandante: cada subconjunto / población económicamente activa.
- Informalidad: población con empleo informal / población ocupada.

La definición de cada tasa se muestra debajo de su selector; el servicio EPH utilizado por Radar devuelve actualmente el agregado `T_31_A`, no una desagregación individual por ciudad.

## Marcas estadísticas y valores faltantes

| Marca | Significado |
|---|---|
| `s` | Dato confidencial por aplicación del secreto estadístico. |
| `*` | Dato provisorio. |
| `**` | Dato preliminar, cuando así lo informa la fuente. |
| `e` | Dato estimado por extrapolación o proyección. |
| `i` | Dato estimado por imputación. |
| `u` | Dato de calidad inferior al estándar. |
| `-` | Cero absoluto. |
| `.` | Dato no registrado. |
| `...` | Dato no disponible a la fecha de presentación. |
| `///` | Dato que no corresponde presentar. |

Una celda vacía, un valor nulo y una marca estadística no son equivalentes. No sustituirlos por cero. Se debe conservar el valor original, la marca y las observaciones de INDEC.

## Fuentes metodológicas oficiales

- [Visualizador de indicadores de precios del INDEC (VIP)](https://shiny.indec.gob.ar/vip/) — definiciones vigentes de IPC, SIPM, ICC, salarios y CBA/CBT.
- [Mercado de trabajo. Tasas e indicadores socioeconómicos (EPH), INDEC](https://www.indec.gob.ar/uploads/informesdeprensa/mercado_trabajo_eph_1trim254850EDE6DF.pdf) — universos, definiciones y denominadores de las tasas EPH.
- [INDEC Informa — Sistema de índices de precios mayoristas](https://biblioteca.indec.gob.ar/bases/minde/indec_informa_04_22.pdf) — diferencias entre IPIM, IPIB e IPP.
- [Metodología del EMAE, INDEC](https://www.indec.gob.ar/ftp/cuadros/economia/metodologia_emae_ago_16.pdf) — series, base y tratamiento estadístico.
- [Metadatos de estimaciones de población por departamento 2022–2035, INDEC](https://www.indec.gob.ar/ftp/cuadros/poblacion/metadatos_estimaciones_deptos_2022_2035.pdf) — referencia temporal, codificación y cobertura.
- [Metodología de Canasta de crianza, INDEC](https://biblioteca.indec.gob.ar/bases/minde/canasta_crianza_04_24.pdf) — bienes y servicios y valorización del tiempo de cuidado.
- [Operaciones estadísticas del INDEC](https://www.indec.gob.ar/indec/web/Institucional-Indec-OperacionesEstadisticas-1) — cobertura, frecuencia y objetivos de los servicios.

## Límite de esta documentación

La existencia de metadatos explicativos no implica que un indicador esté validado para producción. El estado operativo de cada uno sigue siendo el que figura en `docs/radar-indec-indicator-audit.md`. Los servicios pendientes no se habilitan por el hecho de contar con una definición conceptual.
