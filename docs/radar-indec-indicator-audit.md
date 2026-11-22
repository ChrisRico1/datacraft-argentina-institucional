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
| IPC | `ipc_nacional` | `periodo`, `region`, `clasificador`, `nivel`, `codigo`, `tipo_de_indicador`, `valor` | Nacional y seis regiones; mensual | Activo. Métricas de índice, variaciones e incidencias separadas. Serie temporal y resumen. |
| Índice de salarios | `indice_salarios` | `periodo`, `clasificador`, `nivel`, `codigo`, `indicador`, `tipo_de_indicador`, `valor` | Nacional; mensual | Activo. Índice y variaciones separados; filtros jerárquicos. Serie temporal y resumen. |
| EMAE — nivel general | `estimador-mensual-de-actividad-economica-nivel-general` | `periodo`, `tipo_de_indicador`, `tipo_de_indicador_descripcion`, `valor` | Nacional; mensual | Activo. Seis opciones de serie/medida configuradas; no mezclar original, desestacionalizada y tendencia-ciclo. |
| Pobreza e indigencia | `pobreza_eph` | `periodo`, `area_geografica_nom`, `area_geografica_cod` y tasas de hogares/personas | Total de 31 aglomerados urbanos; semestral | Activo. Cuatro métricas configuradas. La respuesta observada se identifica como `T_31_A`; no ofrecer filtros por ciudad o municipio. |
| Mercado de trabajo | `mercado_trabajo_eph` | `periodo`, `area_geografica_nom`, `area_geografica_cod` y tasas laborales | Total de 31 aglomerados urbanos; trimestral | Activo. Nueve métricas configuradas. Actividad, empleo, desocupación y subocupación conservan sus denominadores; informalidad tiene universo propio. |
| CBA / CBT | `valorizacion_canastas_cba_cbt` | `periodo`, `region`, `clasificador`, `nivel`, `codigo`, `indicador`, `tipo_de_indicador`, `valor` | Gran Buenos Aires; mensual | Activo. Filtros por región y apertura estadística; índice, variación e incidencia no se mezclan. |
| Canasta de crianza | `canasta-crianza` | `Periodo`, `bys_*`, `cuid_*`, `tot_*` | Gran Buenos Aires; mensual; cuatro tramos etarios | Activo. Doce series configuradas: tres componentes por cuatro tramos. Nueva comparación apilada de bienes/servicios y cuidado; el total se muestra desde el campo publicado por INDEC. |
| Exportaciones | `comercio_exterior_exportacion_bienes` | `Periodo`, `rubro_cod`, `subrubro_cod`, `pais_cod`, `valor_FOB`, `Peso_Neto` | Nacional; mensual | Activo. Subrubro y país destino dependen del rubro; nomenclaturas oficiales. Treemap/composición pendiente de validación de supresiones y exhaustividad. |
| Importaciones | `comercio_exterior_importacion_bienes` | `Periodo`, `uso_economico_cod`, `gce_cod`, `pais_cod`, `valor_CIF`, `Peso_Neto` | Nacional; mensual | Activo. GCE depende del uso económico; país origen es independiente. Visualización de composición pendiente. |
| Población por departamento | `estimaciones_poblacion_departamento_2022_2035` | `fecha`, `jurisdiccion_cod`, `jurisdiccion_nom`, `departamento_cod`, `departamento_nom`, `sexo_cod`, `poblacion`, `rmba` | Departamentos/partidos/comunas; anual, 2022–2035 | Activo. Estimaciones por departamento y sexo. Mapa pendiente de vincular códigos oficiales con geometrías compatibles. |
| Población por jurisdicción | `proyecciones_poblacion_jurisdiccion_2022_2040` | `fecha`, `jurisdiccion_cod`, `jurisdiccion_nom`, `sexo_cod`, `edad_cod`, `edad_nom`, `poblacion` | Jurisdicciones; anual, 2022–2040 | Activo. Proyecciones por grupos quinquenales de edad. Mapa/comparación territorial pendiente. |
| Población nacional | `proyecciones_poblacion_nacional_2022_2040` | `fecha`, `edad`, `sexo_cod`, `sexo_nom`, `poblacion` | Total nacional; anual, 2022–2040 | Activo. Pirámide poblacional solo con ambos sexos y una misma fecha; al filtrar edad/sexo se utiliza la serie temporal. |
| IPI manufacturero | `ipi_manufacturero` | `periodo`, `indicador`, `cuadro_web`, `codigo_CLaNAE_2004`, `serie`, `tipo_de_indicador`, `unidad_de_medida`, `valor` | Nacional; mensual, desde 2016 según especificación | Registrado, pero deshabilitado. No habilitar hasta probar respuesta, dimensiones y filtros reales en Production. |
| SIPM | `sipm_precios_mayoristas` | `periodo`, `operativo`, `indicador`, `clasificador`, `nivel`, `codigo_apertura`, `region`, `tipo_de_indicador`, `valor` | Nacional; mensual | Activo. Comparación de aperturas condicionada a indicador, clasificador y nivel homogéneos. |
| ICC | `icc_precios_construccion` | `periodo`, `indicador`, `codigo_apertura`, `codigo_CPC_1`, `clasificador`, `nivel`, `region`, `tipo_de_indicador`, `valor` | Gran Buenos Aires; mensual | Activo. Comparación de aperturas condicionada a clasificador y nivel homogéneos. |

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

- Código de servidor y filtros revisados en `main`: `src/features/radar/server/indec.ts` y `src/features/radar/filterConfig.ts`.
- Matriz de campos: `docs/radar-indec-filter-matrix.md`.
- El snapshot OpenAPI y la extracción de 19 tablas usados como referencia fueron publicados por un tercero y reflejan una consulta al Catálogo API-INDEC del **2 de noviembre de 2026**. Sirven para contrastar estructura y nombres, pero no sustituyen la documentación oficial en vivo ni la respuesta actual de Production.
- La documentación oficial del Catálogo API-INDEC es https://api.indec.gob.ar/docs. La página pública actual carga el contenido de documentación de forma dinámica; en la consulta del 22/11/2026 el lector de texto solo mostró el contenedor de carga y no expuso el esquema de los servicios. Por eso esta auditoría no afirma haber validado el OpenAPI completo en vivo.
- Para Canasta de crianza se contrastó además el informe oficial de octubre de 2026, publicado el 16 de noviembre de 2026: https://www.indec.gob.ar/uploads/informesdeprensa/canasta_crianza_11_26F9D722BE15.pdf.
- La validación de ejecución de cada indicador, métrica y filtro en Production sigue pendiente de completar y registrar. Las pruebas unitarias validan el comportamiento del código, no la disponibilidad de datos en el servicio remoto.
- Las preguntas frecuentes oficiales indican que el token vence automáticamente a los 12 meses y que la regeneración invalida inmediatamente el token anterior. También informan que existen límites de uso por cuenta, sin publicar en esa página una cuota numérica universal. La capa servidor ya transforma respuestas upstream `429` en un error controlado `503`; falta verificar en Production la presentación al usuario y documentar el procedimiento de renovación sin exponer el secreto. Referencia: https://api.indec.gob.ar/ayuda/faq.
