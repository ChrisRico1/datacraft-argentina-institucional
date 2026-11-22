# Radar Estadístico — matriz de filtros y visualizaciones

## Base documental

La referencia pública del Catálogo API-INDEC es [api.indec.gob.ar/docs](https://api.indec.gob.ar/docs). Para esta matriz se contrastaron los 15 endpoints integrados con una copia OpenAPI pública del catálogo extraída el **2 de noviembre de 2026**. Esa copia es una referencia fechada, no reemplaza la documentación vigente ni la validación de cada consulta contra Production.

La API utiliza filtros por columna estilo PostgREST. Cada campo debe enviarse con el nombre exacto documentado y solo cuando el endpoint lo publique. Los códigos deben conservarse como texto cuando el INDEC los define como códigos, incluso si contienen ceros iniciales.

## Matriz de filtros por servicio integrado

| Indicador | Dimensiones y campos documentados | Aplicación en Radar |
|---|---|---|
| IPC | `region`, `clasificador`, `nivel`, `codigo`, `descripcion`, `indicador`, `tipo_de_indicador` | Región y apertura COICOP; índice, variaciones e incidencias se consultan por separado. |
| Salarios | `clasificador`, `nivel`, `codigo`, `indicador`, `tipo_de_indicador` | Apertura jerárquica y métrica seleccionada. |
| EMAE nivel general | `tipo_de_indicador_descripcion`, `tipo_de_indicador` | Serie original, desestacionalizada o tendencia-ciclo; índice y variaciones no se mezclan. |
| Pobreza EPH | Especificación: `area_geografica_nom`, `area_geografica_cod` | La respuesta observada publica `T_31_A` (total de 31 aglomerados), no una lista seleccionable de aglomerados individuales. No ofrecer filtros territoriales hasta que el endpoint entregue valores desagregados. |
| Mercado de trabajo EPH | Especificación: `area_geografica_nom`, `area_geografica_cod` | La respuesta observada publica `T_31_A` (total de 31 aglomerados), no una lista seleccionable de aglomerados individuales. Mantener separadas las tasas por sus distintos denominadores. |
| CBA/CBT | `region`, `clasificador`, `nivel`, `codigo`, `indicador`, `tipo_de_indicador` | Región y apertura estadística; mantener separados índice, variación e incidencia. |
| Canasta de crianza | `Periodo` y 12 métricas: `bys_*`, `cuid_*`, `tot_*` | No tiene una dimensión de edad común: cada tramo publica bienes/servicios, cuidado y total como campos independientes. |
| Exportaciones | `rubro_cod`, `subrubro_cod`, `pais_cod` | Subrubro y país de destino dependen del rubro seleccionado; ambos se limitan a opciones presentes en las observaciones de ese rubro. Usar nomenclaturas oficiales. |
| Importaciones | `uso_economico_cod`, `gce_cod`, `pais_cod` | GCE depende del uso económico; país de origen permanece independiente. Usar nomenclaturas oficiales. |
| Población por departamento | `jurisdiccion_nom`, `jurisdiccion_cod`, `departamento_cod`, `sexo_cod`, `rmba` | Jurisdicción, departamento, sexo y pertenencia a RMBA. |
| Población por jurisdicción | `jurisdiccion_nom`, `jurisdiccion_cod`, `sexo_cod`, `edad_cod` | Proyecciones por grupos quinquenales de edad. |
| Población nacional | `edad`, `sexo_cod` | Edad en años cumplidos y sexo; referencia al 1 de julio. |
| IPI manufacturero | `indicador`, `cuadro_web`, `codigo_CLaNAE_2004`, `serie`, `tipo_de_indicador`, `unidad_de_medida` | Campos corregidos según la especificación consultada; permanece deshabilitado hasta validar respuesta real en Production. |
| SIPM | `operativo`, `indicador`, `clasificador`, `nivel`, `codigo_apertura`, `region`, `tipo_de_indicador` | Selección de índice, apertura y región; comparación de categorías solo a igual nivel. |
| ICC | `indicador`, `codigo_apertura`, `codigo_CPC_1`, `clasificador`, `nivel`, `region`, `tipo_de_indicador` | Aperturas del costo de construcción para GBA; comparación solo entre categorías equivalentes. |

### Metadatos de lectura

La interfaz incorpora definiciones en lenguaje claro debajo de cada selector y contextualiza la opción seleccionada. El diccionario cubre indicadores, métricas, dimensiones, unidades, períodos, cobertura, códigos y marcas estadísticas: ver [Diccionario de metadatos del Radar](radar-metadata-dictionary.md). Los nombres y códigos dinámicos de comercio exterior siguen procediendo del nomenclador oficial; el texto explicativo no sustituye ese catálogo.

## Reglas de implementación

- La allowlist del servidor es la autoridad: un campo no incluido para un indicador se rechaza.
- Los nombres visibles deben explicar qué representa cada dimensión; los códigos deben conservar el formato original.
- Las dependencias solo se aplican cuando existe jerarquía real en la nomenclatura. En exportaciones, país de destino y subrubro se recalculan al elegir Rubro (el país no depende del subrubro). En importaciones, país de origen es independiente del uso económico y de la GCE.
- Un filtro dependiente se habilita solo después de elegir su dimensión padre y sus opciones se recalculan con las observaciones devueltas para esa selección. No se ofrecen valores nulos/vacíos ni opciones huérfanas; si no hay resultados válidos, el selector permanece deshabilitado e informa que no hay opciones.
- Las sugerencias de autocompletado derivadas de una página parcial no equivalen a un catálogo completo.
- Cuando una consulta queda limitada a una muestra parcial, los selectores dependientes derivados de sus observaciones permanecen deshabilitados hasta completar la carga incremental. Los diccionarios oficiales pueden aportar etiquetas, pero no sustituyen la relación padre-hijo observada en los datos.
- Para comercio exterior, el INDEC publica `comercio_exterior_nomenclaturas` con `nombre_columna`, `codigo` y `codigo_descripcion`. Radar debe usarlo como diccionario oficial para país, rubros y aperturas; no inferir nombres ni opciones completas desde una muestra de operaciones.
- La consulta de nomenclaturas se realiza por el endpoint interno `comercio-nomenclaturas`, que reutiliza el servidor seguro de INDEC y no aparece como indicador visible del catálogo.
- El IPI manufacturero permanece deshabilitado hasta comprobar campos y filtros con una consulta real del endpoint.

## Estrategia de visualización por naturaleza del dato

| Tipo de información | Visualización preferida | Condición para mostrarla |
|---|---|---|
| Serie temporal mensual, trimestral, semestral o anual | Línea; área cuando el énfasis sea volumen/evolución | Una observación por período y misma unidad, universo y desagregación. |
| Comparación de categorías o aglomerados | Barras horizontales ordenadas | Mismo período, métrica, unidad y nivel de clasificación. |
| Componentes de una magnitud | Barras apiladas o agrupadas | Solo si los componentes son comparables y sumables; no sumar tasas ni índices. |
| Estructura demográfica por edad y sexo | Pirámide poblacional | Misma fecha de referencia; separar sexo y conservar grupos de edad publicados. |

La primera visualización demográfica incorporada es la pirámide poblacional de Población nacional. Se construye con la fecha de referencia más reciente que tenga registros de ambos sexos, edades publicadas y valores numéricos. Si se aplican filtros de edad o sexo, se prioriza la serie temporal filtrada en lugar de una pirámide incompleta.
| Distribución territorial | Mapa coroplético | Solo con códigos geográficos oficiales vinculados a polígonos compatibles; no convertir aglomerados EPH en municipios. |
| Composición del comercio exterior | Treemap o barras jerárquicas; flujos solo si origen/destino están completos | Nomenclaturas oficiales, período común y tratamiento explícito de supresiones por secreto estadístico. |
| Relación entre dos variables | Dispersión | Misma unidad de observación, período y cobertura; no inferir causalidad. |
| Matrices calendario/estacionalidad | Mapa de calor | Períodos completos y escala homogénea. |
| Participación porcentual | Barras 100% o anillo | Categorías mutuamente excluyentes, exhaustivas y con total conocido; evitar tortas con muchas categorías. |

No se debe elegir un gráfico solo por disponibilidad de un componente visual. Si faltan dimensiones, existen períodos duplicados o se mezclan unidades, Radar debe explicar el motivo y conservar la tabla como fuente de consulta.

## Cobertura del catálogo

La copia OpenAPI consultada enumera 19 servicios públicos. Radar integra 15. Entre los servicios adicionales aparecen EMAE por sectores, IPI minero, redeterminación de precios de contratos de obra pública y nomenclaturas de comercio exterior. Se deben evaluar por separado antes de incorporarlos al catálogo visual.
