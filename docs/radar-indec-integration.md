# Integración API-INDEC — Radar Estadístico Argentina

## Arquitectura

El navegador consulta únicamente `/api/radar/:indicator`. La ruta servidor valida el indicador y sus filtros, incorpora el JWT desde `INDEC_API_TOKEN` y consulta el servicio fijo del Catálogo API-INDEC. El token no se acepta por query string ni se devuelve en la respuesta.

- API base: `https://api.indec.gob.ar/v1`
- Documentación: https://api.indec.gob.ar/docs
- Autenticación upstream: `Authorization: Bearer <token>`
- Paginación: `limit` máximo 1000 y `offset`; orden estable por la clave primaria completa.
- Conteo: `Prefer: count=exact`; se conserva `Content-Range` y el estado 206 cuando la respuesta es parcial.
- Filtros: solo se aceptan parámetros permitidos para cada servicio. No se permite elegir una URL, tabla, columna u orden arbitrario desde el navegador.
- La ruta envía directivas Cache-Control para 60 segundos en cliente y 15 minutos en caché compartida, con stale-while-revalidate de una hora. La caché efectiva del CDN depende de la configuración del proveedor; todavía no se implementó almacenamiento persistente propio.

## Configuración del secreto

### Desarrollo local

1. Crear un token desde el perfil del portal API-INDEC.
2. Copiar `.env.example` a `.env.local`.
3. Completar `INDEC_API_TOKEN` en `.env.local`.
4. Reiniciar el servidor de desarrollo.

No usar `VITE_INDEC_API_TOKEN`: cualquier variable con prefijo VITE puede terminar expuesta al cliente. No guardar el token en el repositorio ni pegarlo en issues, PRs o conversaciones.

### Producción en Cloudflare Workers

El proyecto usa el preset Nitro para Cloudflare. En Cloudflare Dashboard → Workers & Pages → Worker del sitio → Settings → Variables and Secrets → Add, crear `INDEC_API_TOKEN` con tipo **Secret** y desplegar una nueva versión. También se puede cargar con Wrangler mediante `npx wrangler secret put INDEC_API_TOKEN`.

La implementación lee el secreto desde `process.env.INDEC_API_TOKEN`. En Cloudflare, esto requiere Node.js compatibility y la disponibilidad de variables en `process.env`: verificar que la fecha de compatibilidad del Worker sea 2026-08-04 o posterior, o que tenga habilitadas las flags `nodejs_compat` y `nodejs_compat_populate_process_env`. Si el proyecto se despliega en otro runtime, configurar la misma variable como secreto de servidor en ese proveedor.

Referencias:
- https://developers.cloudflare.com/workers/configuration/environment-variables/
- https://developers.cloudflare.com/workers/configuration/secrets/
- https://developers.cloudflare.com/workers/configuration/compatibility-flags/

## Servicios registrados

| ID interno | Endpoint INDEC | Alcance documentado |
|---|---|---|
| `ipc` | `/ipc_nacional` | IPC nacional, aperturas y regiones; desde diciembre de 2016 |
| `salarios` | `/indice_salarios` | Índice de salarios |
| `emae` | `/estimador-mensual-de-actividad-economica-nivel-general` | EMAE nivel general; desde enero de 2004 |
| `pobreza` | `/pobreza_eph` | Pobreza e indigencia, hogares y personas; 31 aglomerados urbanos |
| `mercado-laboral` | `/mercado_trabajo_eph` | Tasas del mercado laboral; 31 aglomerados urbanos |
| `cba-cbt` | `/valorizacion_canastas_cba_cbt` | CBA y CBT; Gran Buenos Aires |
| `canasta-crianza` | `/canasta-crianza` | Canasta de crianza; Gran Buenos Aires, cuatro tramos de edad |
| `exportaciones` | `/comercio_exterior_exportacion_bienes` | Exportaciones por rubros, subrubros y destino |
| `importaciones` | `/comercio_exterior_importacion_bienes` | Importaciones por uso económico y origen |
| `poblacion-departamento` | `/estimaciones_poblacion_departamento_2022_2035` | Estimaciones por departamento y sexo, 2022–2035 |
| `poblacion-jurisdiccion` | `/proyecciones_poblacion_jurisdiccion_2022_2040` | Proyecciones por jurisdicción, sexo y edad |
| `poblacion-nacional` | `/proyecciones_poblacion_nacional_2022_2040` | Proyecciones nacionales por sexo y edad |
| `ipi-manufacturero` | `/ipi_manufacturero` | Producción industrial manufacturera |
| `sipm` | `/sipm_precios_mayoristas` | Índices de precios mayoristas |
| `costo-construccion` | `/icc_precios_construccion` | Índice del costo de la construcción |

La matriz de campos, claves primarias y filtros está definida en `src/features/radar/server/indec.ts`; los rótulos y dependencias de los filtros visibles están en `src/features/radar/filterConfig.ts`. Los endpoints no deben habilitarse o renombrarse sin volver a verificar el catálogo oficial.

## Cobertura del catálogo en la interfaz

El catálogo visual debe mantener una correspondencia explícita con los 15 servicios registrados en el servidor:

| Servicio | Estado en la interfaz | Observación |
|---|---|---|
| IPC, salarios, EMAE | Disponible | Métricas y series específicas configuradas |
| Pobreza, mercado laboral | Disponible | Cobertura EPH: 31 aglomerados urbanos |
| CBA/CBT | Disponible | Gran Buenos Aires; dimensiones estadísticas |
| Canasta de crianza | 12 series configuradas en la interfaz | Selector para cuatro tramos etarios y tres componentes por tramo (bienes y servicios, tiempo de cuidado y total). Confirmar las 12 series con datos reales en PRD |
| Exportaciones e importaciones | Disponible | Filtros jerárquicos de clasificación y país |
| Población por departamento | Disponible | Estimaciones por departamento |
| Población por jurisdicción | Disponible | Proyecciones por jurisdicción, sexo y edad |
| Población nacional | Disponible | Proyecciones nacionales por edad y sexo |
| IPI manufacturero | Registrado, temporalmente deshabilitado | No habilitar en la interfaz hasta validar en Production la respuesta, los campos y las dimensiones del endpoint |
| SIPM e ICC | Disponible | Métricas económicas y comparación de aperturas |

La interfaz incluye un acceso independiente para población nacional. No debe confundirse con las proyecciones por jurisdicción ni con las estimaciones departamentales.

La cantidad de servicios registrados en el servidor no equivale a la cantidad de indicadores plenamente validados. La interfaz de canasta de crianza configura 12 series (cuatro tramos por tres componentes), cuya disponibilidad debe comprobarse con datos reales en PRD. El IPI manufacturero permanece deshabilitado hasta validar su respuesta y dimensiones.

## Consideraciones estadísticas

- Pobreza e indigencia y mercado laboral de EPH tienen cobertura de aglomerados urbanos; no son automáticamente representativos de cada departamento o municipio.
- CBA/CBT y canasta de crianza se publican para Gran Buenos Aires según la documentación consultada.
- Las exportaciones e importaciones incluyen supresiones por secreto estadístico. Los códigos y nomencladores deben interpretarse con su servicio de referencia.
- El selector de canasta de crianza permite elegir 12 métricas: total, bienes y servicios y tiempo de cuidado para cuatro tramos etarios (menores de 1 año, 1 a 3, 4 a 5 y 6 a 12 años). No asumir que las 12 series están validadas en producción hasta comprobar sus respuestas reales.
- Las marcas convencionales y observaciones de INDEC deben conservarse. En particular, `s` indica dato confidencial; `*` provisorio; `**` preliminar; `e` estimado por extrapolación/proyección; `i` estimado por imputación; `u` calidad inferior al estándar; `-` cero absoluto; `.` no registrado; `...` no disponible; `///` no corresponde presentar.
- Los totales por suma y las variaciones pueden diferir de publicaciones técnicas por redondeo, según advierte la documentación del Catálogo.

## Endpoint de la aplicación

`GET /api/radar/:indicator?limit=100&offset=0&from=2021`

Parámetros opcionales:
- `period`: período exacto.
- `from`: año desde (cuatro dígitos).
- `region`: coincidencia exacta sobre el campo geográfico habilitado.
- `series`: tipo de serie cuando el endpoint lo admite.
- `indicatorType`: tipo de indicador cuando el endpoint lo admite.
- `category`: categoría/código cuando el endpoint lo admite.
- `limit`: 1–1000.
- `offset`: 0–1.000.000.

Respuesta normalizada: `indicator`, `endpoint`, `source`, `fetchedAt`, `contentRange`, `partial`, `data`.

## Pendientes operativos

- Configurar `INDEC_API_TOKEN` en los entornos local y de producción.
- Verificar compatibilidad de `process.env` en el Worker desplegado.
- Ejecutar build, lint y pruebas en CI/entorno de despliegue.
- Probar cada endpoint con el token real y cotejar los nombres de campos y claves contra la versión vigente del catálogo.
- Ampliar la exploración para seleccionar desagregaciones, indicadores múltiples y exportar CSV.
