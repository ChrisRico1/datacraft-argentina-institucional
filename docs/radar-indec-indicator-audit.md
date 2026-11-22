# Auditoría del catálogo de indicadores — Radar Estadístico Argentina

**Corte de revisión:** 22 de noviembre de 2026  
**Repositorio revisado:** `main`, commit `20b804e9ddd960cac15b52b14c8d92201cbc60e0`, posterior a las PR #82–#99  
**Documentación de campos:** matriz OpenAPI fechada el 2 de noviembre de 2026; ver limitaciones de evidencia al final.

## Metadatos de interpretación en la interfaz

El diccionario de metadatos se implementa en `src/features/radar/radarMetadata.tsx` y se documenta en `docs/radar-metadata-dictionary.md`. La interfaz muestra definiciones debajo de los indicadores, métricas, filtros, rangos temporales y desagregaciones seleccionadas; también incorpora un glosario para las columnas de observaciones y las marcas estadísticas.

**Alcance:** cubre conceptualmente los 15 servicios del catálogo y sus dimensiones configuradas. Esta mejora de comprensión no altera el estado de validación de ejecución: un servicio con metadatos explicativos no se considera validado por ese motivo. IPI manufacturero permanece deshabilitado.

## Perfil de muestra de Production

El workflow posterior al merge [Radar Production sample audit #45067841486](https://github.com/ChrisRico1/datacraft-argentina-institucional/actions/runs/45067841486) perfiló hasta 1.000 filas por servicio el 22/11/2026. Resultado: **15/15 servicios con muestra disponible, campos mínimos presentes y cero duplicados en las claves compuestas completas**. La clave de mercado laboral se corrigió a período + `area_geografica_nom`; el perfil posterior confirmó 41/41 filas comparables y cero duplicados.

Resultado por servicio (muestra y total informados por la API):

| Servicio | Filas perfiladas | Total API | Períodos en la muestra | Nulos en campos numéricos | Duplicados |
|---|---:|---:|---|---:|---:|
| IPC | 1.000 | 235.683 | 202610 (1) | 0 | 0 |
| Índice de salarios | 1.000 | 3.432 | 202307–202609 (39) | 0 | 0 |
| EMAE — nivel general | 1.000 | 1.632 | 201210–202608 (167) | 0 | 0 |
| Pobreza e indigencia | 20 | 20 | 20162S–20261S (20) | 0 | 0 |
| Mercado de trabajo | 41 | 41 | 20162T–20262T (41) | 60 | 0 |
| CBA / CBT | 1.000 | 1.651 | 202006–202610 (77) | 0 | 0 |
| Canasta de crianza | 82 | 82 | 202001–202610 (82) | 0 | 0 |
| Exportaciones | 1.000 | 781.462 | 202610 (1) | 1.042 | 0 |
| Importaciones | 1.000 | 391.340 | 202610 (1) | 0 | 0 |
| Población por departamento | 1.000 | 14.784 | 2035 (1) | 0 | 0 |
| Población por jurisdicción | 1.000 | 19.152 | 2040 (1) | 0 | 0 |
| Población nacional | 1.000 | 3.838 | 2036–2040 (5) | 0 | 0 |
| IPI manufacturero | 1.000 | 41.667 | 202606–202609 (4) | 19 | 0 |
| SIPM | 1.000 | 236.062 | 202610 (1) | 0 | 0 |
| ICC | 1.000 | 14.124 | 202601–202610 (10) | 0 | 0 |

**Hallazgos que requieren interpretación, no corrección automática:**
- Mercado laboral: siete tasas (actividad, empleo, desocupación, ocupación demandante y tres de subocupación) tienen 41/41 valores. Empleo formal e informal tienen 11/41 valores cada una; los 30 períodos anteriores llegan nulos. Total: 60 nulos. La explicación contextual advierte que no equivalen a cero.
- Exportaciones: 521/1.000 valores de `valor_FOB` y 521/1.000 de `Peso_Neto` son nulos en la muestra 202610. La respuesta no incluye `valor_null` ni `observaciones` para explicar esas filas; no se infiere la causa ni se calculan participaciones con esos registros.
- IPI manufacturero: 981/1.000 valores numéricos; 19 nulos con marcas `s` (18) y `-` (1). Sigue deshabilitado hasta validar el universo completo, filtros y presentación.
- SIPM: la muestra contiene IPIB e IPIM y cinco métricas; la auditoría de universo completo ya concilió IPIM, IPIB e IPP. Las 1.000 filas de la muestra llevan `* Dato provisorio` en observaciones.
- ICC: la muestra cubre diez períodos recientes; 642/1.000 filas llevan `* Dato provisorio`.
- Población por departamento y por jurisdicción: la primera página ordenada por fecha contiene solo 2035 y 2040 respectivamente. Esto no representa el rango completo de cada endpoint.
- IPC, salarios, EMAE, pobreza, CBA/CBT, canasta de crianza, importaciones y población nacional no presentan nulos ni valores no numéricos en la muestra perfilada.

Los períodos de la primera página dependen del orden de consulta del Worker. Un período único en una muestra no significa que el servicio tenga un solo período disponible. El perfil es muestral: no reemplaza conciliación exhaustiva ni validación manual de todos los filtros en la interfaz.

## Smoke automatizado de Production

Se ejecutó el workflow [Radar Production smoke #45066574481](https://github.com/ChrisRico1/datacraft-argentina-institucional/actions/runs/45066574481) el 22/11/2026 contra el Worker público de Production.

**Resultado: 15/15 servicios.** Todos los endpoints devolvieron HTTP 200/206, JSON válido, observaciones, contrato mínimo, CORS del origen institucional y un filtro representativo de período/dimensiones que devolvió el período solicitado.

Conteos informados por `Content-Range` durante la ejecución:

| Servicio | Registros informados |
|---|---:|
| IPC | 235.683 |
| Salarios | 3.432 |
| EMAE | 1.632 |
| Pobreza | 20 |
| Mercado de trabajo | 41 |
| CBA / CBT | 1.651 |
| Canasta de crianza | 82 |
| Exportaciones | 781.462 |
| Importaciones | 391.340 |
| Población por departamento | 14.784 |
| Población por jurisdicción | 19.152 |
| Población nacional | 3.838 |
| IPI manufacturero | 41.667 |
| SIPM | 236.062 |
| Costo de construcción | 14.124 |

El smoke detectó y corrigió una suposición de contrato: la respuesta de importaciones no contiene `Peso_Neto`; no se infiere ni se reemplaza por cero. La primera ejecución también detectó que `Content-Range` no está expuesto uniformemente como encabezado HTTP; el test lee el campo del sobre JSON cuando existe.

**Límite:** el resultado es un smoke de disponibilidad, esquema mínimo y un filtro representativo por servicio. No concilia todos los registros, no valida cada combinación de filtros ni todas las métricas y no valida por sí solo la experiencia completa del navegador. No modifica los estados de validación integral de la tabla ni habilita IPI manufacturero.

## Criterio de lectura

Esta auditoría distingue tres cosas que no deben confundirse:

1. **Registro técnico:** el endpoint y sus campos están declarados en el servidor.
2. **Contrato documentado:** los nombres de campos, dimensiones y cobertura coinciden con la especificación consultada.
3. **Validación de ejecución:** la consulta devuelve datos utilizables en Production, con las métricas y filtros esperados.

La existencia de un endpoint o una prueba unitaria del armado de URL no demuestra por sí sola que todas sus series estén disponibles en Production. La validación integral de ejecución queda pendiente de recorrer cada indicador con la API real.

## Indicadores integrados

| Indicador | Endpoint | Campos y dimensiones principales | Cobertura / frecuencia | Estado y visualización |
|---|---|---|---|---|
| IPC | `ipc_nacional` | `periodo`, `region`, `clasificador`, `nivel`, `codigo`, `tipo_de_indicador`, `valor` | Nacional y seis regiones; mensual | **Validado manualmente en Production (22/11/2026):** carga inicial, métricas de índice/variaciones/incidencias, filtro regional, período, resumen, gráfico, exportación CSV y actualización. Sin fallas reportadas. Serie temporal y resumen. |
| Índice de salarios | `indice_salarios` | `periodo`, `clasificador`, `nivel`, `codigo`, `indicador`, `tipo_de_indicador`, `valor` | Nacional; mensual | **Validado manualmente en Production (22/11/2026):** carga y períodos, índice/variaciones, clasificador y filtros jerárquicos, cambio de indicador, coherencia entre tabla/resumen/gráfico, CSV y actualización. Sin fallas reportadas. Serie temporal y resumen. |
| EMAE — nivel general | `estimador-mensual-de-actividad-economica-nivel-general` | `periodo`, `tipo_de_indicador`, `tipo_de_indicador_descripcion`, `valor` | Nacional; mensual | **Validado manualmente en Production (22/11/2026):** carga, opciones de serie/medida, distinción entre original, desestacionalizada y tendencia-ciclo, períodos, cambio de indicador, coherencia tabla/resumen/gráfico, CSV y actualización. Sin fallas reportadas. |
| Pobreza e indigencia | `pobreza_eph` | `periodo`, `area_geografica_nom`, `area_geografica_cod` y tasas de hogares/personas | Total de 31 aglomerados urbanos; semestral | **Validado manualmente en Production (22/11/2026):** carga, cuatro tasas (hogares/personas; pobreza/indigencia), área geográfica, períodos semestrales, cambio de indicador, gráfico en porcentaje, CSV y actualización sin duplicados. Se conserva la cobertura `T_31_A`; no representa municipios o provincias individuales. |
| Mercado de trabajo | `mercado_trabajo_eph` | `periodo`, `area_geografica_nom`, `area_geografica_cod` y tasas laborales | Total de 31 aglomerados urbanos; trimestral | **Validado manualmente en Production (22/11/2026):** carga inicial y períodos trimestrales, nueve métricas, filtros de área geográfica, cambio de indicador, coherencia entre tabla/resumen/gráfico, unidades porcentuales, CSV y actualización sin duplicados. Se verificó que actividad, empleo, desocupación y subocupación mantengan sus denominadores y que informalidad conserve su universo propio. La cobertura corresponde al total de 31 aglomerados; no representa municipios o provincias individuales. |
| CBA / CBT | `valorizacion_canastas_cba_cbt` | `periodo`, `region`, `clasificador`, `nivel`, `codigo`, `indicador`, `tipo_de_indicador`, `valor` | Gran Buenos Aires; mensual | Activo. Filtros por región y apertura estadística; índice, variación e incidencia no se mezclan. Validación de ejecución pendiente. |
| Canasta de crianza | `canasta-crianza` | `Periodo`, `bys_*`, `cuid_*`, `tot_*` | Gran Buenos Aires; mensual; cuatro tramos etarios | Activo. Doce series configuradas: tres componentes por cuatro tramos. Nueva comparación apilada de bienes/servicios y cuidado; el total se muestra desde el campo publicado por INDEC. Validación individual de las 12 métricas pendiente. |
| Exportaciones | `comercio_exterior_exportacion_bienes` | `Periodo`, `rubro_cod`, `subrubro_cod`, `pais_cod`, `valor_FOB`, `Peso_Neto` | Nacional; mensual | Activo. Subrubro y país destino dependen del rubro; nomenclaturas oficiales. Treemap/composición pendiente de validación de supresiones y exhaustividad. |
| Importaciones | `comercio_exterior_importacion_bienes` | `Periodo`, `uso_economico_cod`, `gce_cod`, `pais_cod`, `valor_CIF` | Nacional; mensual | Activo. GCE depende del uso económico; país origen es independiente. La respuesta actual de API no incluye `Peso_Neto`; no se muestra ni infiere. Visualización de composición pendiente. |
| Población por departamento | `estimaciones_poblacion_departamento_2022_2035` | `fecha`, `jurisdiccion_cod`, `jurisdiccion_nom`, `departamento_cod`, `departamento_nom`, `sexo_cod`, `poblacion`, `rmba` | Departamentos/partidos/comunas; anual, 2022–2035 | Activo. Estimaciones por departamento y sexo. Mapa pendiente de vincular códigos oficiales con geometrías compatibles. |
| Población por jurisdicción | `proyecciones_poblacion_jurisdiccion_2022_2040` | `fecha`, `jurisdiccion_cod`, `jurisdiccion_nom`, `sexo_cod`, `edad_cod`, `edad_nom`, `poblacion` | Jurisdicciones; anual, 2022–2040 | Activo. Proyecciones por grupos quinquenales de edad. Mapa/comparación territorial pendiente. |
| Población nacional | `proyecciones_poblacion_nacional_2022_2040` | `fecha`, `edad`, `sexo_cod`, `sexo_nom`, `poblacion` | Total nacional; anual, 2022–2040 | Activo. Pirámide poblacional solo con ambos sexos y una misma fecha; al filtrar edad/sexo se utiliza la serie temporal. Validación de ejecución pendiente. |
| IPI manufacturero | `ipi_manufacturero` | `periodo`, `indicador`, `cuadro_web`, `codigo_CLaNAE_2004`, `descripcion`, `serie`, `tipo_de_indicador`, `unidad_de_medida`, `valor`, `valor_null` | Nacional; mensual, según especificación | **Validación parcial de Production (22/11/2026):** transferencia paginada completa de 41.667 registros en 42 solicitudes, sin errores. Se verificó el esquema y se exploró una muestra inicial de 2.000 registros. Faltan integridad del conjunto completo, filtros y validación de interfaz. Permanece deshabilitado. Ver detalle debajo. |
| SIPM | `sipm_precios_mayoristas` | `periodo`, `operativo`, `indicador`, `clasificador`, `nivel`, `codigo_apertura`, `region`, `tipo_de_indicador`, `valor`, `observaciones` y marcas `valor_null` | Total del país; mensual | **Validado manualmente en Production (22/11/2026):** 236.062 registros; IPIB, IPIM e IPP; cinco métricas por indicador; filtros de clasificación, nivel, apertura y región; paginación y series mensuales. Integridad comprobada para aperturas A. Ver detalle de alcance y límites debajo. |
| ICC | `icc_precios_construccion` | `periodo`, `indicador`, `codigo_apertura`, `codigo_CPC_1`, `clasificador`, `nivel`, `region`, `tipo_de_indicador`, `valor` | Gran Buenos Aires; mensual | Activo. Comparación de aperturas condicionada a clasificador y nivel homogéneos. Validación de ejecución pendiente. |


### Validación parcial de ejecución — IPI manufacturero (22/11/2026)

Se consultó en Production el endpoint `ipi_manufacturero` a través de la API de Radar.

**Transferencia y paginación**

- Total informado por la API: **41.667 registros**.
- La descarga se completó en **42 solicitudes**: páginas de 1.000 registros y una última página de 667.
- Rangos recibidos sin errores: desde `0-999/41667` hasta `41000-41666/41667`; la descarga acumuló 41.667 registros.
- Las respuestas parciales utilizan HTTP 206 y exponen `Content-Range`. Se observó el encabezado CORS del origen de Production.

**Estructura observada**

Los campos devueltos incluyen `periodo`, `anio`, `mes`, `indicador`, `cuadro_web`, `codigo_CLaNAE_2004`, `descripcion`, `serie`, `tipo_de_indicador`, `unidad_de_medida`, `valor` y `valor_null`.

En los primeros 2.000 registros inspeccionados se observaron tres series (`Serie original`, `Serie desestacionalizada` y `Serie tendencia-ciclo`), cuatro tipos de indicador (índice, variación interanual, variación acumulada interanual y variación intermensual), dos unidades (número índice y porcentaje) y cinco cuadros (2 a 6).

En esa muestra inicial se detectaron 39 valores sin dato, con marcas `s` y `-`. La clave compuesta por período, cuadro, código, descripción, serie y tipo de indicador no presentó duplicados en la muestra. Los códigos por sí solos no identifican necesariamente una observación única: por ejemplo, un mismo código puede corresponder a varias descripciones de productos.

**Pendiente antes de habilitar**

- Repetir la conciliación de duplicados, nulos y dimensiones sobre los 41.667 registros; la descarga completa se confirmó, pero el análisis posterior no quedó conservado en la sesión de PowerShell.
- Verificar cobertura histórica, continuidad temporal, filtros admitidos y conteos por dimensión contra la respuesta real del servicio.
- Confirmar la codificación de textos: PowerShell mostró cadenas con caracteres acentuados mal interpretados, pero todavía no se determinó si el problema está en el payload o en la representación de consola.
- Validar tabla, gráficos, unidades, marcas de valores nulos y exportación CSV en la interfaz.

**Decisión:** mantener IPI manufacturero deshabilitado. La descarga paginada y la inspección inicial no equivalen a una validación funcional ni metodológica completa.

### Validación de ejecución — SIPM (22/11/2026)

Se consultó el endpoint real `sipm_precios_mayoristas` desde la API de Radar y se contrastaron los conteos, filtros y series en Production.

**Cobertura y conciliación de registros**

- Total general: **236.062 registros**, con período más reciente 202610.
- Por indicador: IPIB **79.124**, IPIM **79.124** e IPP **77.814**. La suma coincide con el total general.
- Las cinco métricas consultadas fueron `Indice`, `incidencia`, `v_acum`, `v_ia` y `v_m`. Los conteos por métrica concilian exactamente con el total de cada indicador.
- Filtros observados: `clasificador=CIIU3` (227.940 registros), `nivel=Categoría de Tabulación` (9.825), `codigo_apertura=A` (1.965) y `region=Total del país` (236.062).
- La combinación IPIB + índice + CIIU3 + Categoría de Tabulación + apertura A devuelve 131 registros.
- Los filtros categóricos combinados funcionan; una combinación válida pero sin coincidencias devuelve una respuesta vacía, sin error.

**Paginación y límites**

- `limit=10` devuelve `Content-Range: 0-9/236062`; `offset=10` devuelve el bloque siguiente.
- `limit=1000` es aceptado; valores 0 y 5000 se rechazan por rango y valores decimales por tipo.
- `offset=1000001` se rechaza por exceder el máximo configurado.
- El filtro `from` acepta años de cuatro dígitos y funciona como límite inferior sobre `periodo`. El parámetro `to` no está implementado; las consultas que lo incluyen no lo aplican. No documentarlo como filtro disponible.

**Integridad de series**

Para IPIB, IPIM e IPP, con `clasificador=CIIU3`, `nivel=Categoría de Tabulación` y `codigo_apertura=A`:

- La métrica `Indice` contiene 131 períodos mensuales únicos y consecutivos, desde 201512 hasta 202610, sin duplicados ni valores nulos.
- `incidencia`, `v_acum` y `v_m` presentan un valor nulo por serie, en el período inicial 201512.
- `v_ia` presenta 12 valores nulos iniciales por serie, entre 201512 y 201611.
- El patrón de nulos es idéntico en los tres indicadores. Es compatible con la necesidad de períodos de referencia previos, pero no se registró como validación metodológica oficial exhaustiva. Los nulos deben conservarse; nunca reemplazarse por cero.
- Se observó una marca de dato provisorio en el período más reciente. Las marcas y observaciones se mantienen separadas del valor numérico en la tabla.

**Límites de esta validación**

- La integridad temporal se comprobó para apertura A y el nivel indicados; no equivale a auditar cada apertura de las 236.062 filas.
- La comprobación de nulos se limita a las series y métricas descritas.
- No se realizó una conciliación exhaustiva de cada valor con los cuadros publicados por INDEC.
- La corrección CORS se integró mediante el PR #82 (merge commit `7d93e0547d307a7edf437cefdee25aafb6af62f0`). Se verificó en Production el preflight `OPTIONS` y una respuesta `GET` parcial HTTP 206: ambas incluyen `Access-Control-Allow-Origin: https://datacraft-argentina.lovable.app`. La consulta GET devolvió `Content-Range: 0-9/131`. La validación confirma el acceso desde el origen de producción; no se generaliza a otros orígenes.
- La interfaz ya conserva valores nulos como interrupciones de la línea temporal, presenta la marca `valor_null` en una columna independiente y exporta los campos originales a CSV. Esto se verificó mediante inspección del código; no se afirma una prueba visual adicional específica para cada serie SIPM.

## Servicios del catálogo todavía no integrados

La extracción pública de referencia del 2 de noviembre de 2026 enumera 19 tablas. Radar integra 15 indicadores y usa un servicio adicional de nomenclaturas como apoyo. Quedan tres candidatos por evaluar:

| Servicio | Posible aplicación | Decisión |
|---|---|---|
| EMAE por sectores | Evolución sectorial de la actividad económica | Evaluar después de validar el endpoint de nivel general y la estructura de sectores. |
| IPI minero | Producción minera | Evaluar como indicador independiente; no reutilizar el esquema de IPI manufacturero sin comprobar sus campos y unidades. |
| Redeterminación de precios de contratos de obra pública | Seguimiento de índices y aperturas usados para redeterminar contratos | Candidato relevante para Municipio en Obra; requiere analizar alcance normativo, campos, unidad y lectura adecuada antes de incorporarlo. |

## Decisión de visualizaciones implementadas

La selección se basa en la unidad, frecuencia, dimensiones y completitud de la consulta; no se fuerza un gráfico para cada endpoint.

| Familia | Visualización | Condición / límite |
|---|---|---|
| IPC, salarios, EMAE, EPH, SIPM e ICC | Serie temporal | Una sola métrica y una observación por período. Si hay varias aperturas, se exige seleccionar una desagregación; si quedan períodos duplicados, se reemplaza el gráfico por una explicación y la tabla. |
| IPC, salarios, EMAE, SIPM e ICC | Lectura de índice, variación o incidencia | Índices, porcentajes y puntos porcentuales conservan unidades separadas. Porcentajes y puntos porcentuales incluyen referencia en cero; los índices mantienen escala automática. |
| SIPM e ICC | Comparación categórica | Solo para un período y métrica comunes, con clasificador y nivel definidos; se bloquea si se selecciona una apertura individual o si la jerarquía no es homogénea. |
| Canasta de crianza | Barras apiladas | Bienes y servicios + tiempo de cuidado; el total publicado se muestra por separado y nunca se recalcula. |
| Población nacional | Pirámide poblacional | Solo cuando no se filtra edad ni sexo; con filtros se utiliza la serie temporal. |
| Exportaciones e importaciones | Tabla y serie condicionada | No se dibuja composición/participación sobre una primera página parcial del universo. Exportaciones presenta 521 nulos en FOB y peso neto en la muestra 202610; no hay base suficiente para afirmar exhaustividad. |
| Población por departamento/jurisdicción | Tabla y serie condicionada | No se presenta mapa hasta validar geometrías y correspondencia de códigos territoriales. |
| IPI manufacturero | Sin visualización pública | El indicador permanece deshabilitado hasta validar el conjunto completo, filtros, marcas y lectura de series. |

La implementación se apoya en IndicatorTimeSeriesChart, EconomicCategoryComparison, ChildcareCostBreakdownChart y PopulationPyramidChart. Las reglas de series temporales detectan duplicados por período y valores no numéricos; ante una consulta ambigua o incompleta, Radar conserva la tabla y explica por qué no grafica.

## Límites temporales de consulta (429)

El servidor transforma una respuesta HTTP 429 de INDEC en HTTP 503 con el mensaje “INDEC limitó temporalmente las consultas.”. La interfaz muestra el mensaje y orienta a esperar unos minutos antes de usar «Actualizar datos» una sola vez, evitando reintentos repetidos. La prueba unitaria del servidor cubre la traducción 429→503 y la ayuda contextual tiene prueba propia. **No se forzó una respuesta 429 real en Production**: queda pendiente comprobar ese caso extremo contra el upstream sin provocar una limitación artificial de la cuenta.

## Reglas para visualizaciones

- Series temporales: una observación por período, con una sola métrica, unidad, universo y desagregación.
- Comparaciones categóricas: mismo período, métrica, unidad y nivel de clasificación.
- Canasta de crianza: bienes/servicios y cuidado pueden mostrarse apilados porque el informe oficial los define como componentes del total. El total publicado se conserva; no se reemplaza por una suma calculada, ya que el INDEC advierte diferencias por redondeo.
- Comercio exterior: no construir participaciones o treemaps como si el universo fuera exhaustivo cuando existen valores suprimidos por secreto estadístico o registros parciales.
- EPH: el total de 31 aglomerados no debe representarse como una geografía municipal/provincial.
- Población: mapas solo con códigos geográficos oficiales y geometrías compatibles. La pirámide exige ambos sexos en la misma fecha.
- Cuando no se cumplan las condiciones, mantener tabla y explicación en lugar de forzar un gráfico.

## Evidencia y limitaciones

- Código de servidor y filtros revisados en `src/features/radar/server/indec.ts` y `src/features/radar/filterConfig.ts`.
- Matriz de campos: `docs/radar-indec-filter-matrix.md`.
- **Evidencia manual de Production:** el usuario probó el IPC el 22/11/2026 e informó que funcionaron carga, métricas, regiones, períodos, resumen, gráfico, CSV y actualización. No se registraron fallas. Esta evidencia corresponde únicamente al IPC y no se extrapola a otros indicadores.
- **Evidencia manual de Production:** el usuario probó el Índice de salarios el 22/11/2026 e informó que funcionaron carga, períodos, índice/variaciones, clasificador, dependencias entre clasificador/nivel/código de apertura, cambio de indicador, coherencia entre tabla/resumen/gráfico, CSV y actualización. No se registraron fallas. Esta evidencia corresponde únicamente al Índice de salarios.
- **Evidencia manual de Production:** el usuario completó el checklist de EMAE — nivel general el 22/11/2026 y confirmó que estaba listo para continuar. Se registra la validación de carga, opciones de serie/medida, separación de original/desestacionalizada/tendencia-ciclo, períodos, cambio de indicador, coherencia de tabla/resumen/gráfico, CSV y actualización, sin fallas reportadas.
- **Evidencia manual de Production:** el usuario completó el checklist de Pobreza e indigencia el 22/11/2026 y confirmó que el resultado quedó correcto. Se registra la validación de carga, las cuatro métricas (pobreza e indigencia para hogares y personas), filtro de área geográfica, períodos semestrales, cambio de indicador, tasas porcentuales, coherencia de tabla/resumen/gráfico, exportación CSV y actualización sin duplicados. La cobertura comprobada corresponde al total de 31 aglomerados urbanos (`T_31_A`), no a municipios o provincias individuales.
- **Evidencia manual de Production:** el usuario confirmó como validadas todas las pruebas de Mercado de trabajo el 22/11/2026. Se registra carga inicial, períodos trimestrales, nueve métricas, filtro geográfico, cambio de indicador, coherencia entre tabla/resumen/gráfico, unidades porcentuales, exportación CSV y actualización sin duplicados. Se comprobó la interpretación diferenciada de actividad, empleo, desocupación y subocupación, y el universo propio de informalidad. La cobertura es el total de 31 aglomerados urbanos, no una desagregación municipal o provincial.
- El snapshot OpenAPI y la extracción de 19 tablas usados como referencia fueron publicados por un tercero y reflejan una consulta al Catálogo API-INDEC del **2 de noviembre de 2026**. Sirven para contrastar estructura y nombres, pero no sustituyen la documentación oficial en vivo ni la respuesta actual de Production.
- La documentación oficial del Catálogo API-INDEC es https://api.indec.gob.ar/docs. La página pública actual carga el contenido de documentación de forma dinámica; en la consulta del 22/11/2026 el lector de texto solo mostró el contenedor de carga y no expuso el esquema de los servicios. Por eso esta auditoría no afirma haber validado el OpenAPI completo en vivo.
- Para Canasta de crianza se contrastó además el informe oficial de octubre de 2026, publicado el 16 de noviembre de 2026: https://www.indec.gob.ar/uploads/informesdeprensa/canasta_crianza_11_26F9D722BE15.pdf.
- La validación manual integral de Production sigue registrada para 5/15 indicadores (IPC, salarios, EMAE nivel general, pobreza y mercado laboral). SIPM está validado dentro del alcance acotado descrito arriba. Los 15/15 servicios superaron smoke y perfil de muestra, pero esos controles automatizados no equivalen a validar manualmente cada métrica, filtro, visualización y exportación de los diez restantes. La corrección CORS de la API quedó integrada y comprobada para el origen de Production. Las pruebas unitarias validan el comportamiento del código, no la disponibilidad de datos en el servicio remoto.
- Las preguntas frecuentes oficiales indican que el token vence automáticamente a los 12 meses y que la regeneración invalida inmediatamente el token anterior. También informan que existen límites de uso por cuenta, sin publicar en esa página una cuota numérica universal. La capa servidor ya transforma respuestas upstream `429` en un error controlado `503`; falta verificar en Production la presentación al usuario y documentar el procedimiento de renovación sin exponer el secreto. Referencia: https://api.indec.gob.ar/ayuda/faq.


Se ejecutó el workflow [Radar Production smoke #45066574481](https://github.com/ChrisRico1/datacraft-argentina-institucional/actions/runs/45066574481) el 22/11/2026 contra el Worker público de Production.

**Resultado: 15/15 servicios.** Todos los endpoints devolvieron HTTP 200/206, JSON válido, observaciones, contrato mínimo, CORS del origen institucional y un filtro representativo de período/dimensiones que devolvió el período solicitado.

Conteos informados por `Content-Range` durante la ejecución:

| Servicio | Registros informados |
|---|---:|
| IPC | 235.683 |
| Salarios | 3.432 |
| EMAE | 1.632 |
| Pobreza | 20 |
| Mercado de trabajo | 41 |
| CBA / CBT | 1.651 |
| Canasta de crianza | 82 |
| Exportaciones | 781.462 |
| Importaciones | 391.340 |
| Población por departamento | 14.784 |
| Población por jurisdicción | 19.152 |
| Población nacional | 3.838 |
| IPI manufacturero | 41.667 |
| SIPM | 236.062 |
| Costo de construcción | 14.124 |

El smoke detectó y corrigió una suposición de contrato: la respuesta de importaciones no contiene `Peso_Neto`; no se infiere ni se reemplaza por cero. La primera ejecución también detectó que `Content-Range` no está expuesto uniformemente como encabezado HTTP; el test lee el campo del sobre JSON cuando existe.

**Límite:** el resultado es un smoke de disponibilidad, esquema mínimo y un filtro representativo por servicio. No concilia todos los registros, no valida cada combinación de filtros ni todas las métricas y no valida por sí solo la experiencia completa del navegador. No modifica los estados de validación integral de la tabla ni habilita IPI manufacturero.

## Criterio de lectura

Esta auditoría distingue tres cosas que no deben confundirse:

1. **Registro técnico:** el endpoint y sus campos están declarados en el servidor.
2. **Contrato documentado:** los nombres de campos, dimensiones y cobertura coinciden con la especificación consultada.
3. **Validación de ejecución:** la consulta devuelve datos utilizables en Production, con las métricas y filtros esperados.

La existencia de un endpoint o una prueba unitaria del armado de URL no demuestra por sí sola que todas sus series estén disponibles en Production. La validación integral de ejecución queda pendiente de recorrer cada indicador con la API real.

## Indicadores integrados

| Indicador | Endpoint | Campos y dimensiones principales | Cobertura / frecuencia | Estado y visualización |
|---|---|---|---|---|
| IPC | `ipc_nacional` | `periodo`, `region`, `clasificador`, `nivel`, `codigo`, `tipo_de_indicador`, `valor` | Nacional y seis regiones; mensual | **Validado manualmente en Production (22/11/2026):** carga inicial, métricas de índice/variaciones/incidencias, filtro regional, período, resumen, gráfico, exportación CSV y actualización. Sin fallas reportadas. Serie temporal y resumen. |
| Índice de salarios | `indice_salarios` | `periodo`, `clasificador`, `nivel`, `codigo`, `indicador`, `tipo_de_indicador`, `valor` | Nacional; mensual | **Validado manualmente en Production (22/11/2026):** carga y períodos, índice/variaciones, clasificador y filtros jerárquicos, cambio de indicador, coherencia entre tabla/resumen/gráfico, CSV y actualización. Sin fallas reportadas. Serie temporal y resumen. |
| EMAE — nivel general | `estimador-mensual-de-actividad-economica-nivel-general` | `periodo`, `tipo_de_indicador`, `tipo_de_indicador_descripcion`, `valor` | Nacional; mensual | **Validado manualmente en Production (22/11/2026):** carga, opciones de serie/medida, distinción entre original, desestacionalizada y tendencia-ciclo, períodos, cambio de indicador, coherencia tabla/resumen/gráfico, CSV y actualización. Sin fallas reportadas. |
| Pobreza e indigencia | `pobreza_eph` | `periodo`, `area_geografica_nom`, `area_geografica_cod` y tasas de hogares/personas | Total de 31 aglomerados urbanos; semestral | **Validado manualmente en Production (22/11/2026):** carga, cuatro tasas (hogares/personas; pobreza/indigencia), área geográfica, períodos semestrales, cambio de indicador, gráfico en porcentaje, CSV y actualización sin duplicados. Se conserva la cobertura `T_31_A`; no representa municipios o provincias individuales. |
| Mercado de trabajo | `mercado_trabajo_eph` | `periodo`, `area_geografica_nom`, `area_geografica_cod` y tasas laborales | Total de 31 aglomerados urbanos; trimestral | **Validado manualmente en Production (22/11/2026):** carga inicial y períodos trimestrales, nueve métricas, filtros de área geográfica, cambio de indicador, coherencia entre tabla/resumen/gráfico, unidades porcentuales, CSV y actualización sin duplicados. Se verificó que actividad, empleo, desocupación y subocupación mantengan sus denominadores y que informalidad conserve su universo propio. La cobertura corresponde al total de 31 aglomerados; no representa municipios o provincias individuales. |
| CBA / CBT | `valorizacion_canastas_cba_cbt` | `periodo`, `region`, `clasificador`, `nivel`, `codigo`, `indicador`, `tipo_de_indicador`, `valor` | Gran Buenos Aires; mensual | Activo. Filtros por región y apertura estadística; índice, variación e incidencia no se mezclan. Validación de ejecución pendiente. |
| Canasta de crianza | `canasta-crianza` | `Periodo`, `bys_*`, `cuid_*`, `tot_*` | Gran Buenos Aires; mensual; cuatro tramos etarios | Activo. Doce series configuradas: tres componentes por cuatro tramos. Nueva comparación apilada de bienes/servicios y cuidado; el total se muestra desde el campo publicado por INDEC. Validación individual de las 12 métricas pendiente. |
| Exportaciones | `comercio_exterior_exportacion_bienes` | `Periodo`, `rubro_cod`, `subrubro_cod`, `pais_cod`, `valor_FOB`, `Peso_Neto` | Nacional; mensual | Activo. Subrubro y país destino dependen del rubro; nomenclaturas oficiales. Treemap/composición pendiente de validación de supresiones y exhaustividad. |
| Importaciones | `comercio_exterior_importacion_bienes` | `Periodo`, `uso_economico_cod`, `gce_cod`, `pais_cod`, `valor_CIF` | Nacional; mensual | Activo. GCE depende del uso económico; país origen es independiente. La respuesta actual de API no incluye `Peso_Neto`; no se muestra ni infiere. Visualización de composición pendiente. |
| Población por departamento | `estimaciones_poblacion_departamento_2022_2035` | `fecha`, `jurisdiccion_cod`, `jurisdiccion_nom`, `departamento_cod`, `departamento_nom`, `sexo_cod`, `poblacion`, `rmba` | Departamentos/partidos/comunas; anual, 2022–2035 | Activo. Estimaciones por departamento y sexo. Mapa pendiente de vincular códigos oficiales con geometrías compatibles. |
| Población por jurisdicción | `proyecciones_poblacion_jurisdiccion_2022_2040` | `fecha`, `jurisdiccion_cod`, `jurisdiccion_nom`, `sexo_cod`, `edad_cod`, `edad_nom`, `poblacion` | Jurisdicciones; anual, 2022–2040 | Activo. Proyecciones por grupos quinquenales de edad. Mapa/comparación territorial pendiente. |
| Población nacional | `proyecciones_poblacion_nacional_2022_2040` | `fecha`, `edad`, `sexo_cod`, `sexo_nom`, `poblacion` | Total nacional; anual, 2022–2040 | Activo. Pirámide poblacional solo con ambos sexos y una misma fecha; al filtrar edad/sexo se utiliza la serie temporal. Validación de ejecución pendiente. |
| IPI manufacturero | `ipi_manufacturero` | `periodo`, `indicador`, `cuadro_web`, `codigo_CLaNAE_2004`, `descripcion`, `serie`, `tipo_de_indicador`, `unidad_de_medida`, `valor`, `valor_null` | Nacional; mensual, según especificación | **Validación parcial de Production (22/11/2026):** transferencia paginada completa de 41.667 registros en 42 solicitudes, sin errores. Se verificó el esquema y se exploró una muestra inicial de 2.000 registros. Faltan integridad del conjunto completo, filtros y validación de interfaz. Permanece deshabilitado. Ver detalle debajo. |
| SIPM | `sipm_precios_mayoristas` | `periodo`, `operativo`, `indicador`, `clasificador`, `nivel`, `codigo_apertura`, `region`, `tipo_de_indicador`, `valor`, `observaciones` y marcas `valor_null` | Total del país; mensual | **Validado manualmente en Production (22/11/2026):** 236.062 registros; IPIB, IPIM e IPP; cinco métricas por indicador; filtros de clasificación, nivel, apertura y región; paginación y series mensuales. Integridad comprobada para aperturas A. Ver detalle de alcance y límites debajo. |
| ICC | `icc_precios_construccion` | `periodo`, `indicador`, `codigo_apertura`, `codigo_CPC_1`, `clasificador`, `nivel`, `region`, `tipo_de_indicador`, `valor` | Gran Buenos Aires; mensual | Activo. Comparación de aperturas condicionada a clasificador y nivel homogéneos. Validación de ejecución pendiente. |


### Validación parcial de ejecución — IPI manufacturero (22/11/2026)

Se consultó en Production el endpoint `ipi_manufacturero` a través de la API de Radar.

**Transferencia y paginación**

- Total informado por la API: **41.667 registros**.
- La descarga se completó en **42 solicitudes**: páginas de 1.000 registros y una última página de 667.
- Rangos recibidos sin errores: desde `0-999/41667` hasta `41000-41666/41667`; la descarga acumuló 41.667 registros.
- Las respuestas parciales utilizan HTTP 206 y exponen `Content-Range`. Se observó el encabezado CORS del origen de Production.

**Estructura observada**

Los campos devueltos incluyen `periodo`, `anio`, `mes`, `indicador`, `cuadro_web`, `codigo_CLaNAE_2004`, `descripcion`, `serie`, `tipo_de_indicador`, `unidad_de_medida`, `valor` y `valor_null`.

En los primeros 2.000 registros inspeccionados se observaron tres series (`Serie original`, `Serie desestacionalizada` y `Serie tendencia-ciclo`), cuatro tipos de indicador (índice, variación interanual, variación acumulada interanual y variación intermensual), dos unidades (número índice y porcentaje) y cinco cuadros (2 a 6).

En esa muestra inicial se detectaron 39 valores sin dato, con marcas `s` y `-`. La clave compuesta por período, cuadro, código, descripción, serie y tipo de indicador no presentó duplicados en la muestra. Los códigos por sí solos no identifican necesariamente una observación única: por ejemplo, un mismo código puede corresponder a varias descripciones de productos.

**Pendiente antes de habilitar**

- Repetir la conciliación de duplicados, nulos y dimensiones sobre los 41.667 registros; la descarga completa se confirmó, pero el análisis posterior no quedó conservado en la sesión de PowerShell.
- Verificar cobertura histórica, continuidad temporal, filtros admitidos y conteos por dimensión contra la respuesta real del servicio.
- Confirmar la codificación de textos: PowerShell mostró cadenas con caracteres acentuados mal interpretados, pero todavía no se determinó si el problema está en el payload o en la representación de consola.
- Validar tabla, gráficos, unidades, marcas de valores nulos y exportación CSV en la interfaz.

**Decisión:** mantener IPI manufacturero deshabilitado. La descarga paginada y la inspección inicial no equivalen a una validación funcional ni metodológica completa.

### Validación de ejecución — SIPM (22/11/2026)

Se consultó el endpoint real `sipm_precios_mayoristas` desde la API de Radar y se contrastaron los conteos, filtros y series en Production.

**Cobertura y conciliación de registros**

- Total general: **236.062 registros**, con período más reciente 202610.
- Por indicador: IPIB **79.124**, IPIM **79.124** e IPP **77.814**. La suma coincide con el total general.
- Las cinco métricas consultadas fueron `Indice`, `incidencia`, `v_acum`, `v_ia` y `v_m`. Los conteos por métrica concilian exactamente con el total de cada indicador.
- Filtros observados: `clasificador=CIIU3` (227.940 registros), `nivel=Categoría de Tabulación` (9.825), `codigo_apertura=A` (1.965) y `region=Total del país` (236.062).
- La combinación IPIB + índice + CIIU3 + Categoría de Tabulación + apertura A devuelve 131 registros.
- Los filtros categóricos combinados funcionan; una combinación válida pero sin coincidencias devuelve una respuesta vacía, sin error.

**Paginación y límites**

- `limit=10` devuelve `Content-Range: 0-9/236062`; `offset=10` devuelve el bloque siguiente.
- `limit=1000` es aceptado; valores 0 y 5000 se rechazan por rango y valores decimales por tipo.
- `offset=1000001` se rechaza por exceder el máximo configurado.
- El filtro `from` acepta años de cuatro dígitos y funciona como límite inferior sobre `periodo`. El parámetro `to` no está implementado; las consultas que lo incluyen no lo aplican. No documentarlo como filtro disponible.

**Integridad de series**

Para IPIB, IPIM e IPP, con `clasificador=CIIU3`, `nivel=Categoría de Tabulación` y `codigo_apertura=A`:

- La métrica `Indice` contiene 131 períodos mensuales únicos y consecutivos, desde 201512 hasta 202610, sin duplicados ni valores nulos.
- `incidencia`, `v_acum` y `v_m` presentan un valor nulo por serie, en el período inicial 201512.
- `v_ia` presenta 12 valores nulos iniciales por serie, entre 201512 y 201611.
- El patrón de nulos es idéntico en los tres indicadores. Es compatible con la necesidad de períodos de referencia previos, pero no se registró como validación metodológica oficial exhaustiva. Los nulos deben conservarse; nunca reemplazarse por cero.
- Se observó una marca de dato provisorio en el período más reciente. Las marcas y observaciones se mantienen separadas del valor numérico en la tabla.

**Límites de esta validación**

- La integridad temporal se comprobó para apertura A y el nivel indicados; no equivale a auditar cada apertura de las 236.062 filas.
- La comprobación de nulos se limita a las series y métricas descritas.
- No se realizó una conciliación exhaustiva de cada valor con los cuadros publicados por INDEC.
- La corrección CORS se integró mediante el PR #82 (merge commit `7d93e0547d307a7edf437cefdee25aafb6af62f0`). Se verificó en Production el preflight `OPTIONS` y una respuesta `GET` parcial HTTP 206: ambas incluyen `Access-Control-Allow-Origin: https://datacraft-argentina.lovable.app`. La consulta GET devolvió `Content-Range: 0-9/131`. La validación confirma el acceso desde el origen de producción; no se generaliza a otros orígenes.
- La interfaz ya conserva valores nulos como interrupciones de la línea temporal, presenta la marca `valor_null` en una columna independiente y exporta los campos originales a CSV. Esto se verificó mediante inspección del código; no se afirma una prueba visual adicional específica para cada serie SIPM.

## Servicios del catálogo todavía no integrados

La extracción pública de referencia del 2 de noviembre de 2026 enumera 19 tablas. Radar integra 15 indicadores y usa un servicio adicional de nomenclaturas como apoyo. Quedan tres candidatos por evaluar:

| Servicio | Posible aplicación | Decisión |
|---|---|---|
| EMAE por sectores | Evolución sectorial de la actividad económica | Evaluar después de validar el endpoint de nivel general y la estructura de sectores. |
| IPI minero | Producción minera | Evaluar como indicador independiente; no reutilizar el esquema de IPI manufacturero sin comprobar sus campos y unidades. |
| Redeterminación de precios de contratos de obra pública | Seguimiento de índices y aperturas usados para redeterminar contratos | Candidato relevante para Municipio en Obra; requiere analizar alcance normativo, campos, unidad y lectura adecuada antes de incorporarlo. |

## Reglas para visualizaciones

- Series temporales: una observación por período, con una sola métrica, unidad, universo y desagregación.
- Comparaciones categóricas: mismo período, métrica, unidad y nivel de clasificación.
- Canasta de crianza: bienes/servicios y cuidado pueden mostrarse apilados porque el informe oficial los define como componentes del total. El total publicado se conserva; no se reemplaza por una suma calculada, ya que el INDEC advierte diferencias por redondeo.
- Comercio exterior: no construir participaciones o treemaps como si el universo fuera exhaustivo cuando existen valores suprimidos por secreto estadístico o registros parciales.
- EPH: el total de 31 aglomerados no debe representarse como una geografía municipal/provincial.
- Población: mapas solo con códigos geográficos oficiales y geometrías compatibles. La pirámide exige ambos sexos en la misma fecha.
- Cuando no se cumplan las condiciones, mantener tabla y explicación en lugar de forzar un gráfico.

## Evidencia y limitaciones

- Código de servidor y filtros revisados en `src/features/radar/server/indec.ts` y `src/features/radar/filterConfig.ts`.
- Matriz de campos: `docs/radar-indec-filter-matrix.md`.
- **Evidencia manual de Production:** el usuario probó el IPC el 22/11/2026 e informó que funcionaron carga, métricas, regiones, períodos, resumen, gráfico, CSV y actualización. No se registraron fallas. Esta evidencia corresponde únicamente al IPC y no se extrapola a otros indicadores.
- **Evidencia manual de Production:** el usuario probó el Índice de salarios el 22/11/2026 e informó que funcionaron carga, períodos, índice/variaciones, clasificador, dependencias entre clasificador/nivel/código de apertura, cambio de indicador, coherencia entre tabla/resumen/gráfico, CSV y actualización. No se registraron fallas. Esta evidencia corresponde únicamente al Índice de salarios.
- **Evidencia manual de Production:** el usuario completó el checklist de EMAE — nivel general el 22/11/2026 y confirmó que estaba listo para continuar. Se registra la validación de carga, opciones de serie/medida, separación de original/desestacionalizada/tendencia-ciclo, períodos, cambio de indicador, coherencia de tabla/resumen/gráfico, CSV y actualización, sin fallas reportadas.
- **Evidencia manual de Production:** el usuario completó el checklist de Pobreza e indigencia el 22/11/2026 y confirmó que el resultado quedó correcto. Se registra la validación de carga, las cuatro métricas (pobreza e indigencia para hogares y personas), filtro de área geográfica, períodos semestrales, cambio de indicador, tasas porcentuales, coherencia de tabla/resumen/gráfico, exportación CSV y actualización sin duplicados. La cobertura comprobada corresponde al total de 31 aglomerados urbanos (`T_31_A`), no a municipios o provincias individuales.
- **Evidencia manual de Production:** el usuario confirmó como validadas todas las pruebas de Mercado de trabajo el 22/11/2026. Se registra carga inicial, períodos trimestrales, nueve métricas, filtro geográfico, cambio de indicador, coherencia entre tabla/resumen/gráfico, unidades porcentuales, exportación CSV y actualización sin duplicados. Se comprobó la interpretación diferenciada de actividad, empleo, desocupación y subocupación, y el universo propio de informalidad. La cobertura es el total de 31 aglomerados urbanos, no una desagregación municipal o provincial.
- El snapshot OpenAPI y la extracción de 19 tablas usados como referencia fueron publicados por un tercero y reflejan una consulta al Catálogo API-INDEC del **2 de noviembre de 2026**. Sirven para contrastar estructura y nombres, pero no sustituyen la documentación oficial en vivo ni la respuesta actual de Production.
- La documentación oficial del Catálogo API-INDEC es https://api.indec.gob.ar/docs. La página pública actual carga el contenido de documentación de forma dinámica; en la consulta del 22/11/2026 el lector de texto solo mostró el contenedor de carga y no expuso el esquema de los servicios. Por eso esta auditoría no afirma haber validado el OpenAPI completo en vivo.
- Para Canasta de crianza se contrastó además el informe oficial de octubre de 2026, publicado el 16 de noviembre de 2026: https://www.indec.gob.ar/uploads/informesdeprensa/canasta_crianza_11_26F9D722BE15.pdf.
- La validación de ejecución de los otros 9 indicadores, métricas y filtros en Production sigue pendiente de completar y registrar. SIPM se considera validado dentro del alcance acotado que se detalla arriba. La corrección CORS de la API quedó integrada y comprobada para el origen de Production. Las pruebas unitarias validan el comportamiento del código, no la disponibilidad de datos en el servicio remoto.
- Las preguntas frecuentes oficiales indican que el token vence automáticamente a los 12 meses y que la regeneración invalida inmediatamente el token anterior. También informan que existen límites de uso por cuenta, sin publicar en esa página una cuota numérica universal. La capa servidor ya transforma respuestas upstream `429` en un error controlado `503`; falta verificar en Production la presentación al usuario y documentar el procedimiento de renovación sin exponer el secreto. Referencia: https://api.indec.gob.ar/ayuda/faq.
