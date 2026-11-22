# Infraestructura Cloacal — auditoría de línea de base

## 1. Objetivo

Documentar el estado real de la demostración Infraestructura Cloacal antes de ampliar su alcance funcional. La ruta vigente es `/observatorio/infraestructura-cloacal` y el código fuente se encuentra en `src/features/observatorio`.

Esta auditoría no incorpora datos nuevos ni modifica el comportamiento de la aplicación. Separa lo que el repositorio implementa de lo que todavía debe verificarse en las fuentes oficiales.

## 2. Estado actual del repositorio

### Ruta y presentación

- La página pública se resuelve mediante `src/routes/observatorio.$slug.tsx` y el catálogo tipado de `src/features/observatorio/catalog.ts`.
- El proyecto está registrado como «Infraestructura cloacal», con zona «Cuenca Matanza-Riachuelo».
- La descripción y el objetivo actuales ponen foco en la Cuenca Baja.
- La página incluye introducción, enlaces a Monitor PISA y al dataset de obras, mapa de referencias, tabla de obras, metodología, alcance territorial y fuentes.
- La ruta no incorpora actualmente gráficos de indicadores ni una serie de métricas.

### Datos e inventario de obras

- `src/features/observatorio/data.ts` valida registros mediante Zod y carga el inventario comprimido desde `data/works.json.gz.b64`.
- `data/works.json` y `data/metrics.json` están vacíos; el runtime no carga el inventario desde `works.json`, sino desde el archivo comprimido.
- El modelo de obra conserva municipio, jurisdicción, sector, nombre, servicio, infraestructura, estado, avance, beneficiarios, fecha de corte, fuente y alcance territorial.
- Los valores desconocidos de avance, beneficiarios y estado pueden permanecer nulos. Los registros se filtran para mostrar únicamente servicio «Cloacal».
- La validación de esquema comprueba coherencia básica entre municipio y jurisdicción, fechas, rangos numéricos, fuente registrada y alcance territorial. Esto no sustituye la validación del contenido contra el CSV original de ACUMAR.
- El componente de carga de datos remotos `AcumarDataExplorer.tsx` no está importado por la ruta pública actual. No debe considerarse parte de la experiencia publicada ni activarse sin una revisión independiente de campos y semántica.

### Cartografía

- `ReferenceMap.tsx` representa 14 centros urbanos bonaerenses y CABA con coordenadas aproximadas.
- Los puntos son referencias municipales; no son polígonos, radios censales, ubicaciones de obras ni prueba de pertenencia espacial a la cuenca.
- No se encontró una geometría oficial de la cuenca integrada en la implementación actual.
- La página enlaza al Monitor PISA para consultar límites y capas oficiales.

### Experiencia y estados

- El inventario local se carga desde un efecto de React. Si falla, el error se envía a la consola; la ruta no presenta actualmente un estado visible de error o reintento para esa carga.
- Los filtros actuales son municipio, sector, infraestructura y búsqueda textual. Su utilidad depende de los valores reales disponibles en el inventario.
- No hay KPIs activos: el archivo de métricas está vacío y la ruta no renderiza el componente de KPI.

## 3. Fuentes oficiales identificadas

| Fuente | Uso posible | Precaución |
|---|---|---|
| [ACUMAR — Seguimiento de Obras de Agua y Cloaca (2024–2025)](https://datos.acumar.gob.ar/dataset/seguimiento-de-obras-de-agua-y-cloaca) | Inventario de intervenciones y cortes publicados para 2024 y 2025 | La ficha informa publicación y actualización del 12/12/2025 y frecuencia anual. Cada recurso y registro debe conservar su propio corte. |
| [ACUMAR — Seguimiento de Obras 2018–2023](https://datos.acumar.gob.ar/dataset/seguimiento-de-obras-de-agua-y-cloaca-2018-2023) | Contexto histórico | No mezclar registros de distintos períodos como si fueran una única foto contemporánea. |
| [Monitor PISA — Agua Potable y Saneamiento Cloacal](https://monitorpisa.acumar.gob.ar/sistema-de-indicadores/agua-potable-y-saneamiento-cloacal/) | Indicadores y capas oficiales de cobertura y expansión de redes | Mantener agua potable y cloacas como servicios diferentes. Verificar fecha y definición de cada capa. |
| [Monitor PISA — Población dentro del Área con Servicio de Red Cloacal](https://monitorpisa.acumar.gob.ar/sistema-de-indicadores/agua-potable-y-saneamiento-cloacal/poblacion-incorporada-al-area-servicio-red-cloacal/) | Contexto de cobertura de red en la cuenca | La página informa última actualización en julio de 2024, presenta el valor de 2023 (2.682.574 habitantes; 56%) y declara que el indicador está en proceso de actualización. Es un dato histórico publicado, no una estimación vigente para 2026. |
| [ACUMAR — ICV 2025](https://datos.acumar.gob.ar/dataset/indice-de-calidad-de-vida-icv-de-la-cuenca-matanza-riachuelo-actualizacion-2025) | Contexto territorial a nivel de radio censal y dimensiones de calidad de vida | No asumir que una variable compuesta de servicios sanitarios básicos representa cobertura cloacal aislada. Revisar ficha metodológica y diccionario antes de usarla. |
| [INDEC — Censo 2022: desagüe a red pública](https://censo.gob.ar/index.php/mapa_desague_red_publica2/) | Conexión de viviendas/hogares a red pública, según universo y variable censal | No confundir conexión efectiva con disponibilidad/cobertura de red; confirmar universo y nivel geográfico de cada tabla. |
| [GeoSIDUV — Provincia de Buenos Aires](https://geosiduv.gba.gob.ar/) | Posible cartografía de contexto | Verificar geometría, escala, metadatos, licencia y vigencia antes de integrar. |

### Hallazgo estadístico relevante

El Monitor PISA distingue la población dentro del área con servicio de red cloacal de la conexión efectiva de cada vivienda. La página del indicador aclara que su serie publicada llega a 2023, con 56% de cobertura, y que el dato está en proceso de actualización. Por lo tanto, esa cifra solo puede mostrarse como referencia histórica con su período y advertencia; no debe presentarse como cobertura actual.

El ICV 2025 de ACUMAR es una fuente territorial valiosa, pero su dimensión de servicios sanitarios básicos no debe sustituir automáticamente un indicador específico de saneamiento cloacal. La variable `ind_ssb` usada por el componente experimental requiere comprobar su definición exacta en el diccionario y la ficha metodológica antes de reutilizarla.

## 4. Decisiones metodológicas

1. **Unidad territorial principal:** Cuenca Matanza-Riachuelo. La Cuenca Baja puede conservarse como foco de lectura del proyecto actual, pero no debe confundirse con el universo completo.
2. **Jurisdicciones:** diferenciar CABA de los 14 municipios bonaerenses. Ningún dato municipal completo debe atribuirse automáticamente a la porción del municipio incluida en la cuenca.
3. **Cobertura y conexión:** son conceptos distintos. Cobertura describe el área con disponibilidad de servicio; conexión efectiva describe viviendas u hogares conectados, según la definición de la fuente.
4. **Agua y cloacas:** separar siempre los dos servicios, incluso cuando un dataset los publique juntos.
5. **Obras:** municipio informado, alcance territorial, ubicación puntual y sector de cuenca son campos diferentes. No geolocalizar una obra a partir del centro urbano municipal.
6. **Temporalidad:** conservar fecha de publicación, corte de datos y período de referencia por separado.
7. **Faltantes:** usar nulos o «sin dato»; nunca reemplazar valores ausentes por cero.
8. **Estimaciones:** no prorratear datos municipales por superficie para inferir cobertura dentro de la cuenca sin un método explícito, supuestos publicados y validación.
9. **Cartografía:** integrar límites hidrográficos/jurisdiccionales y radios censales solo desde geometrías oficiales, con CRS y metadatos comprobados.

## 5. Brechas identificadas

- Verificar el contenido descomprimido de `works.json.gz.b64` contra los recursos originales 2024 y 2025 de ACUMAR: cantidad de registros, identificadores, columnas, duplicados, fechas, servicios, estados, campos espaciales y cobertura territorial.
- Confirmar qué registros pertenecen efectivamente a la cuenca y cuáles tienen alcance de partido completo o jurisdicción informada.
- Revisar la correspondencia entre el inventario local y el recurso 2025 que consulta el componente experimental.
- Obtener y validar la geometría oficial hidrográfica y jurisdiccional de la cuenca, y evaluar radios censales 2022 compatibles.
- Auditar la variable censal de desagüe a red pública y sus universos.
- Definir si existe una serie oficial comparable para cobertura de red y conexión efectiva; no construir una serie temporal mezclando definiciones.
- Definir estados de carga, error y actualización visibles para los datos.
- Evaluar el componente experimental `AcumarDataExplorer.tsx`; no conectarlo hasta verificar CORS, disponibilidad, esquema, fecha, semántica y atribución de fuentes.

## 6. Próximas etapas técnicas

| Etapa | Alcance | Condición para avanzar |
|---|---|---|
| 1. Auditoría de datos | Comparar inventario local con CSV originales 2024/2025 y documentar diccionario | Registros y campos reconciliados, sin atribuciones territoriales no verificadas |
| 2. Base geográfica | Obtener límites oficiales, radios censales y sistema de referencia | Geometrías oficiales con metadatos y licencia identificados |
| 3. Indicadores censales | Integrar conexión a red pública desde Censo 2022 | Variable, universo y nivel geográfico documentados |
| 4. Cobertura de red | Incorporar capas/indicadores de Monitor PISA | Fecha de referencia, definición y alcance verificables |
| 5. Análisis territorial | Cruzar información compatible espacial y temporalmente | Método reproducible; sin prorrateos no validados |
| 6. Experiencia ejecutiva | Mapa temático, indicadores, filtros, tablas y comparaciones | Cada visualización enlazada a fuente, período, unidad y cobertura |
| 7. Validación | Pruebas funcionales, metodológicas, responsive y accesibilidad | Checklist manual en Preview y Production, más CI verde |

## 7. Criterios de aceptación del proyecto

- El mapa distingue límites oficiales, jurisdicciones, radios y ubicaciones de obras; no usa marcadores aproximados como sustitutos.
- Toda cifra muestra fuente, período, unidad, universo y alcance territorial.
- Cobertura de red y conexión efectiva se presentan por separado.
- Agua potable y saneamiento cloacal no se mezclan.
- Los registros de obras conservan estado, fecha de corte y alcance tal como los publica la fuente.
- Los datos históricos no se presentan como actuales.
- Los filtros no sugieren desagregaciones que la fuente no permite.
- La carga, los errores y la actualización tienen estados visibles.
- La aplicación conserva la identidad visual y la estructura responsive del sitio institucional.

## 8. Referencias del código auditado

- `src/routes/observatorio.$slug.tsx`
- `src/features/observatorio/catalog.ts`
- `src/features/observatorio/data.ts`
- `src/features/observatorio/types.ts`
- `src/features/observatorio/components.tsx`
- `src/features/observatorio/ReferenceMap.tsx`
- `src/features/observatorio/AcumarDataExplorer.tsx`
- `src/features/observatorio/data.test.ts`
- `src/features/observatorio/README.md`

Esta auditoría es una línea de base documental. No certifica la exactitud del inventario comprimido ni la validación en Production de las fuentes remotas.


## 9. Muestras manuales ACUMAR 2024 y 2025

Se recibieron muestras parciales pegadas en la conversación para ambos recursos. No equivalen a los archivos completos y no permiten certificar cantidades, duplicados ni variaciones totales entre cortes.

Observaciones confirmadas en esas muestras:

- Ambos períodos incluyen los campos principales del inventario y columnas de inspección (INSPECTOR, fecha de inspección e informe).
- El encabezado de responsable de ejecución y el de fecha de inspección pueden llegar con caracteres dañados o espaciado irregular.
- Los CSV pueden contener campos entrecomillados con comas o saltos de línea; deben procesarse con un parser CSV y no separando líneas manualmente.
- tipo_fluido diferencia registros de AGUA y CLOACA.
- obra_estado y obra_sub_estado son campos distintos. Una obra finalizada puede estar en servicio, sin servicio o pendiente de puesta en servicio.
- En CABA se observan registros con departamento general C.A.B.A. sin código departamental y registros por comuna con código propio.
- Las muestras 2025 muestran números con punto como separador de miles y porcentajes con símbolo %. La conversión se debe hacer con reglas estrictas y conservar siempre el dato original.
- Las fechas de inicio de las muestras siguen el patrón M/D/YYYY. El parser inicial solo acepta ese patrón y devuelve nulo ante fechas inválidas o formatos distintos.

### Parser inicial

Se agregó src/features/observatorio/acumar-import.ts como módulo de importación aislado. No reemplaza el inventario publicado ni modifica la ruta pública.

El parser:
- Normaliza encabezados conocidos, incluidos los dos encabezados con codificación dañada observados.
- Conserva el registro original por fila.
- Normaliza servicio, beneficiarios, plazo, avance y fecha de inicio cuando el formato es inequívoco.
- Conserva estado y subestado por separado.
- Admite los campos de inspección cuando están presentes.
- Rechaza columnas obligatorias faltantes y errores de estructura CSV.

Las pruebas usan exclusivamente las muestras compartidas y casos sintéticos explícitos. No certifican el contenido completo de los recursos ni habilitan la integración automática del inventario. La asignación de sector de cuenca, coordenadas y alcance territorial sigue fuera del parser porque no se desprende de forma segura de estos campos.


## 10. Fuentes cartográficas oficiales identificadas

La revisión de fuentes permite establecer un orden de consulta, pero todavía no acredita que las geometrías estén descargadas, validadas ni listas para incorporarse a la aplicación.

### Límites de la cuenca

- El [Mapa del Monitor PISA de ACUMAR](https://monitorpisa.acumar.gob.ar/mapa/) ofrece dos capas distintas: «Cuenca Matanza Riachuelo - Límite Hidrográfico» y «Cuenca Matanza Riachuelo - Límite Jurisdiccional». Deben conservarse como geometrías separadas y documentar cuál se utiliza en cada análisis.
- La [Resolución ACUMAR 1113/2013](https://www.argentina.gob.ar/normativa/nacional/resoluci%C3%B3n-1113-2013-221349/texto) aprobó el Mapa de Delimitación Topográfica de la Cuenca Hidrográfica y su informe. Es el antecedente normativo para contrastar la capa hidrográfica; no sustituye la descarga ni la verificación del archivo vectorial.
- La capa jurisdiccional responde a otro criterio espacial. No debe utilizarse como sustituto de la divisoria hidrográfica ni mezclarse con ella en una misma intersección.

### Radios censales y marco geoestadístico

- INDEC publica [geoservicios WMS y WFS](https://www.indec.gob.ar/indec/web/Nivel4-Tema-1-16-188) del Marco Geoestadístico Nacional. El endpoint WFS publicado es https://geonode.indec.gob.ar/geoserver/geonode/wfs y permite consultar/descargar información vectorial.
- El catálogo de Datos Abiertos de la Provincia de Buenos Aires publica el recurso [Radios censales del Censo 2022 — Shapefile](https://catalogo.datos.gba.gob.ar/dataset/radios-censales/archivo/603ce4ba-a0da-429e-ae04-119f99556207), atribuido a INDEC y declarado en EPSG:4326.
- La ficha del recurso permite identificar la descarga directa del ZIP Shapefile: https://catalogo.datos.gba.gob.ar/dataset/33b080d2-e369-4076-acd4-511db0e9bffb/resource/603ce4ba-a0da-429e-ae04-119f99556207/download/radios-censales-2022-shp.zip. También publica un ZIP GeoJSON: https://catalogo.datos.gba.gob.ar/dataset/33b080d2-e369-4076-acd4-511db0e9bffb/resource/151d80d2-87c1-4981-9bea-9aab38a82ec9/download/radios-censales-2022-geojson.zip. La herramienta de consulta no pudo abrir los ZIP por tratarse de contenido binario; las URL quedan identificadas, pero la descarga y la inspección local siguen pendientes.
- La capa de radios censales del GeoNode de INDEC presenta metadatos con EPSG:3857 y licencia no especificada. Antes de elegir una distribución debe verificarse la versión, cobertura territorial, atributos, fecha y condiciones de uso; no asumir que ambas publicaciones son el mismo archivo ni reproyectarlas sin registrar el CRS de origen.

### Condiciones previas a integrar geometrías

1. Obtener los archivos vectoriales desde la fuente institucional y conservar URL, fecha de descarga, metadatos, licencia, nombre de capa y CRS original.
2. Confirmar que el límite hidrográfico corresponda al aprobado y que el límite jurisdiccional tenga definición y fecha identificables.
3. Comprobar validez geométrica, geometrías multipartes, anillos, vacíos, extensión espacial y sistema de referencia.
4. Verificar códigos y nombres de jurisdicciones y radios contra el Marco Geoestadístico Nacional; los códigos deben tratarse como texto para preservar ceros iniciales.
5. Reproyectar solo mediante una transformación explícita y documentada. Registrar CRS de origen y destino.
6. Ejecutar pruebas de intersección sobre un conjunto pequeño y verificable antes de procesar todos los radios censales.
7. No asignar radios por centroide solamente ni utilizar límites municipales completos para inferir pertenencia a la cuenca.

### Estado de verificación

Las fuentes y los servicios de consulta están identificados. Quedan pendientes la descarga efectiva de las capas, la inspección de sus metadatos completos, la validación topológica y la comparación de la delimitación hidrográfica con el antecedente normativo. No se incorpora todavía ninguna geometría ni se modifica el mapa público.


## 11. Verificación de metadatos de radios censales 2022

Se contrastaron dos publicaciones institucionales disponibles para la cartografía de radios censales:

- **Datos Abiertos de la Provincia de Buenos Aires:** el recurso «Radios censales del Censo 2022» está atribuido a INDEC, se publica como archivo ZIP y su ficha declara formato Shapefile en EPSG:4326 (WGS 84). La ficha indica creación el 10/06/2024 y última modificación el 11/06/2024. También existe una distribución GeoJSON ZIP con el mismo CRS declarado.
- **GeoNode de INDEC:** la capa «Radios censales» está publicada y aprobada; sus metadatos describen la unidad radio urbano, rural o mixto y explican que la cobertura nacional integra cartografía de las Direcciones Provinciales de Estadística ajustada a límites provinciales IGN. La ficha declara EPSG:3857, publicación 20/03/2026 y licencia «Not Specified». El servicio ofrece WFS y exportaciones, pero la descarga GeoJSON consultada no respondió dentro del tiempo disponible.
- **CABA — IDEEC/IDECBA:** el organismo estadístico de la Ciudad publica la capa «Radio censal_CNPHyV2022» en formato Shapefile, geometría poligonal, UTF-8 y EPSG:4326. La ficha técnica fija fecha de referencia 04/2022 y licencia CC-BY-2.5-AR; documenta campos `PROV`, `DPTO`, `NCOM`, `NFRACC`, `NRAD`, `CRO`, `TRO` y `SAG`. El campo `TRO` distingue urbano (1), rural (2) y mixto (3). IDEEC ofrece un WFS público en https://ideec.estadisticaciudad.gob.ar/geoserver/ows?request=GetCapabilities&service=wfs y un catálogo de geoservicios/descargas. La página advierte que el uso es responsabilidad del usuario, prohíbe la comercialización de la información obtenida y exige citar la fuente; revisar estas condiciones antes de redistribuir datos.

### Implicancias técnicas y metodológicas

1. Las dos distribuciones no deben considerarse idénticas sin comparar archivos, atributos, identificadores y geometrías.
2. La ficha PBA declara EPSG:4326 y resulta una alternativa operativa para estudiar radios de la Provincia de Buenos Aires; todavía falta descargar e inspeccionar el ZIP.
3. La capa nacional de INDEC declara EPSG:3857. Si se utiliza, la reproyección debe ser explícita y registrada. Sus metadatos advierten que el ajuste a límites provinciales puede deformar geometrías y, excepcionalmente, trasladar superficie entre provincias.
4. La licencia de la capa de GeoNode de INDEC no está especificada. No asumir permiso de redistribución de ese archivo sin aclararlo.
5. La cartografía censal se produce con fines estadísticos. La publicación debe atribuir la fuente primaria a INDEC (2022), «Cartografía y códigos geográficos del Sistema Estadístico Nacional».
6. La ficha de radios define códigos de nueve dígitos: jurisdicción (2), departamento (3), fracción (2) y radio (2). Los códigos se deben almacenar como texto para preservar ceros iniciales.
7. La documentación de INDEC define radios urbanos, rurales y mixtos. El análisis no debe excluir radios rurales o mixtos por defecto sin una decisión metodológica explícita.

### Estado

Metadatos de PBA, CABA e INDEC comparados. PBA y CABA declaran EPSG:4326; GeoNode INDEC declara EPSG:3857 y licencia no especificada. Se identificó el WFS de IDEEC para CABA y las URL directas de descarga PBA, pero no se descargó ni validó el contenido geométrico de esos recursos. Siguen pendientes la inspección de archivos, CRS real, campos, cobertura, validez topológica y comparación entre distribuciones. No se incorpora todavía ninguna capa al mapa público.
