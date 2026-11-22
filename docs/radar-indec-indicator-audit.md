# Auditoría del catálogo de indicadores — Radar Estadístico Argentina

**Corte de revisión:** 22 de noviembre de 2026  
**Repositorio revisado:** `main`, commit `6078041ce9f377e5971cac8f810decf5d6a5ee6e`, posterior a la integración de la PR #65  
**Documentación de campos:** matriz OpenAPI fechada el 2 de noviembre de 2026; ver limitaciones de evidencia al final.

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
| Importaciones | `comercio_exterior_importacion_bienes` | `Periodo`, `uso_economico_cod`, `gce_cod`, `pais_cod`, `valor_CIF`, `Peso_Neto` | Nacional; mensual | Activo. GCE depende del uso económico; país origen es independiente. Visualización de composición pendiente. |
| Población por departamento | `estimaciones_poblacion_departamento_2022_2035` | `fecha`, `jurisdiccion_cod`, `jurisdiccion_nom`, `departamento_cod`, `departamento_nom`, `sexo_cod`, `poblacion`, `rmba` | Departamentos/partidos/comunas; anual, 2022–2035 | Activo. Estimaciones por departamento y sexo. Mapa pendiente de vincular códigos oficiales con geometrías compatibles. |
| Población por jurisdicción | `proyecciones_poblacion_jurisdiccion_2022_2040` | `fecha`, `jurisdiccion_cod`, `jurisdiccion_nom`, `sexo_cod`, `edad_cod`, `edad_nom`, `poblacion` | Jurisdicciones; anual, 2022–2040 | Activo. Proyecciones por grupos quinquenales de edad. Mapa/comparación territorial pendiente. |
| Población nacional | `proyecciones_poblacion_nacional_2022_2040` | `fecha`, `edad`, `sexo_cod`, `sexo_nom`, `poblacion` | Total nacional; anual, 2022–2040 | Activo. Pirámide poblacional solo con ambos sexos y una misma fecha; al filtrar edad/sexo se utiliza la serie temporal. Validación de ejecución pendiente. |
| IPI manufacturero | `ipi_manufacturero` | `periodo`, `indicador`, `cuadro_web`, `codigo_CLaNAE_2004`, `serie`, `tipo_de_indicador`, `unidad_de_medida`, `valor` | Nacional; mensual, desde 2016 según especificación | Registrado, pero deshabilitado. No habilitar hasta probar respuesta, dimensiones y filtros reales en Production. |
| SIPM | `sipm_precios_mayoristas` | `periodo`, `operativo`, `indicador`, `clasificador`, `nivel`, `codigo_apertura`, `region`, `tipo_de_indicador`, `valor`, `observaciones` y marcas `valor_null` | Total del país; mensual | **Validado manualmente en Production (22/11/2026):** 236.062 registros; IPIB, IPIM e IPP; cinco métricas por indicador; filtros de clasificación, nivel, apertura y región; paginación y series mensuales. Integridad comprobada para aperturas A. Ver detalle de alcance y límites debajo. |
| ICC | `icc_precios_construccion` | `periodo`, `indicador`, `codigo_apertura`, `codigo_CPC_1`, `clasificador`, `nivel`, `region`, `tipo_de_indicador`, `valor` | Gran Buenos Aires; mensual | Activo. Comparación de aperturas condicionada a clasificador y nivel homogéneos. Validación de ejecución pendiente. |


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
- La prueba desde el navegador detectó bloqueo CORS en respuestas parciales HTTP 206. La corrección se prepara en el PR #82; su build pasó, pero la validación funcional desde el Preview y el navegador sigue pendiente.
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
- La validación de ejecución de los otros 9 indicadores, métricas y filtros en Production sigue pendiente de completar y registrar. SIPM se considera validado dentro del alcance acotado que se detalla arriba. Las pruebas unitarias validan el comportamiento del código, no la disponibilidad de datos en el servicio remoto.
- Las preguntas frecuentes oficiales indican que el token vence automáticamente a los 12 meses y que la regeneración invalida inmediatamente el token anterior. También informan que existen límites de uso por cuenta, sin publicar en esa página una cuota numérica universal. La capa servidor ya transforma respuestas upstream `429` en un error controlado `503`; falta verificar en Production la presentación al usuario y documentar el procedimiento de renovación sin exponer el secreto. Referencia: https://api.indec.gob.ar/ayuda/faq.
