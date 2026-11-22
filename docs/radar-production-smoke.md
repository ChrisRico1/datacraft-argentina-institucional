# Smoke test de Production — Radar Estadístico Argentina

## Propósito

Ejecutar una comprobación repetible de los 15 endpoints del Radar contra el Worker real de Cloudflare y verificar un filtro representativo derivado de una observación publicada.

Workflow: `.github/workflows/radar-production-smoke.yml`  
Script: `scripts/radar-production-smoke.mjs`

## Qué comprueba

Para cada servicio registrado:

1. Consulta hasta dos páginas de 1.000 observaciones por endpoint público de Production (hasta 2.000 filas) para construir una muestra de valores reales por dimensión.
2. Verifica HTTP 200/206, JSON válido, contrato de respuesta, origen CORS de la web, `Content-Range` y presencia de campos representativos del esquema.
3. Lee el período y dimensiones de la observación devuelta.
4. Repite la consulta con filtro de período y todos los filtros compatibles derivados de esa observación.
5. Para cada dimensión compatible, selecciona hasta tres valores distintos presentes en la muestra paginada y prueba cada uno de forma individual; comprueba que todas las filas devueltas respeten el valor y el período de la observación de origen.
6. Para Canasta de crianza, comprueba que las 12 series de bienes/servicios, cuidado y total estén presentes con valores numéricos en la observación de muestra.
7. Comprueba que el resultado filtrado no cambie el período solicitado.
8. Consulta individualmente las 35 opciones de métrica de IPC (7), salarios (4), EMAE (6), CBA/CBT (8), SIPM (5) e ICC (5), y verifica que cada respuesta corresponda al valor seleccionado.

Los 15 servicios cubiertos son IPC, salarios, EMAE, pobreza, mercado de trabajo, CBA/CBT, canasta de crianza, exportaciones, importaciones, población por departamento, población por jurisdicción, población nacional, IPI manufacturero, SIPM e ICC.

## Qué no demuestra

- No exige que `Content-Range` esté expuesto como encabezado HTTP en todos los servicios: el Worker puede transportar esa información dentro del sobre JSON o no disponer de ella para una respuesta concreta. No concilia el universo completo de registros, duplicados, continuidad histórica ni supresiones.
- No recorre todos los valores posibles de cada filtro ni todas las observaciones de los 15 indicadores. Los filtros individuales se prueban con hasta tres valores distintos por dimensión, tomados de una muestra de hasta 2.000 observaciones por servicio. Esto amplía la cobertura del contrato de consulta, pero no demuestra la exhaustividad de nomenclaturas ni todas las combinaciones dependientes. Las 35 opciones cubren los seis selectores enumerados arriba; las 12 series de Canasta de crianza se comprueban por presencia y valor numérico, no por un parámetro de métrica.
- No valida por sí solo la visualización, el resumen, la exportación o la interacción completa en el navegador.
- No habilita IPI manufacturero ni cambia el estado de validación manual registrado en `docs/radar-indec-indicator-audit.md`.

Un resultado exitoso se denomina **smoke de servicio, filtros individuales representativos y series configuradas**, no validación integral del indicador.

## Ejecución

El workflow se ejecuta en pull requests que modifican el smoke o el código del Radar y vuelve a ejecutarse al integrar esos cambios en `main`. También admite ejecución manual desde GitHub Actions mediante `workflow_dispatch`.

No requiere secretos ni expone el token de INDEC: consulta exclusivamente los endpoints públicos de la API de Radar, que mantienen la credencial upstream en el Worker.


## Resultado de Production — 22/11/2026

- [Radar Production smoke #45068877709](https://github.com/ChrisRico1/datacraft-argentina-institucional/actions/runs/45068877709): **15/15 servicios y 35/35 opciones de métrica**.
- [Radar Production smoke #45072657136](https://github.com/ChrisRico1/datacraft-argentina-institucional/actions/runs/45072657136): **15/15 servicios, 35/35 opciones de métrica y 56 consultas individuales de filtros**, con una muestra de hasta 100 filas por servicio.
- [Radar Production smoke #45073107843](https://github.com/ChrisRico1/datacraft-argentina-institucional/actions/runs/45073107843), ejecutado sobre PR #114: **15/15 servicios, 35/35 opciones de métrica y 134 consultas individuales de filtros**. La muestra alcanzó hasta dos páginas de 1.000 observaciones por servicio y hasta tres valores distintos por dimensión.

Comprobaciones individuales por servicio en la ejecución ampliada:

| Servicio | Valores de filtros comprobados |
|---|---:|
| IPC | 17 |
| Salarios | 11 |
| EMAE | 2 |
| Pobreza | 1 |
| Mercado de trabajo | 1 |
| CBA / CBT | 11 |
| Canasta de crianza | 0 |
| Exportaciones | 8 |
| Importaciones | 9 |
| Población por departamento | 13 |
| Población por jurisdicción | 11 |
| Población nacional | 5 |
| IPI manufacturero (endpoint; sigue deshabilitado en la interfaz) | 15 |
| SIPM | 14 |
| ICC | 16 |

Canasta de crianza no tiene filtros de dimensión en este smoke; sus 12 series se verificaron por presencia de valores numéricos.

La ejecución más reciente se consulta en el [historial del workflow Radar Production smoke](https://github.com/ChrisRico1/datacraft-argentina-institucional/actions/workflows/radar-production-smoke.yml). Un smoke exitoso verifica el contrato de consulta, no todas las combinaciones posibles ni la experiencia visual completa.

La ejecución inicial del smoke había detectado dos supuestos que se corrigieron: `Content-Range` no está siempre expuesto como encabezado HTTP y el servicio de importaciones no devuelve el campo `Peso_Neto`.
