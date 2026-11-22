# Smoke test de Production — Radar Estadístico Argentina

## Propósito

Ejecutar una comprobación repetible de los 15 endpoints del Radar contra el Worker real de Cloudflare y verificar un filtro representativo derivado de una observación publicada.

Workflow: `.github/workflows/radar-production-smoke.yml`  
Script: `scripts/radar-production-smoke.mjs`

## Qué comprueba

Para cada servicio registrado:

1. Consulta una observación al endpoint público de Production.
2. Verifica HTTP 200/206, JSON válido, contrato de respuesta, origen CORS de la web, `Content-Range` y presencia de campos representativos del esquema.
3. Lee el período y dimensiones de la observación devuelta.
4. Repite la consulta con filtro de período y los filtros compatibles que se pueden derivar de esa misma observación.
5. Comprueba que el resultado filtrado no cambie el período solicitado.

Los 15 servicios cubiertos son IPC, salarios, EMAE, pobreza, mercado de trabajo, CBA/CBT, canasta de crianza, exportaciones, importaciones, población por departamento, población por jurisdicción, población nacional, IPI manufacturero, SIPM e ICC.

## Qué no demuestra

- No concilia el universo completo de registros, duplicados, continuidad histórica ni supresiones.
- No recorre todos los valores posibles de cada filtro ni todas las métricas de cada indicador.
- No valida por sí solo la visualización, el resumen, la exportación o la interacción completa en el navegador.
- No habilita IPI manufacturero ni cambia el estado de validación manual registrado en `docs/radar-indec-indicator-audit.md`.

Un resultado exitoso se denomina **smoke de servicio y filtro representativo**, no validación integral del indicador.

## Ejecución

El workflow se ejecuta automáticamente después de cambios en el código del Radar que llegan a `main`. También admite ejecución manual desde GitHub Actions mediante `workflow_dispatch`.

No requiere secretos ni expone el token de INDEC: consulta exclusivamente los endpoints públicos de la API de Radar, que mantienen la credencial upstream en el Worker.
