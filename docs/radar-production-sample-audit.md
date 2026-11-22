# Perfil de muestra de datos — Radar Production

## Propósito

Complementar el smoke de endpoints con un perfil reproducible de hasta 1.000 filas por servicio. El análisis permite observar categorías y métricas publicadas, períodos presentes en la muestra, valores nulos, marcas, valores no numéricos y duplicados según una clave compuesta declarada por indicador.

Workflow: `.github/workflows/radar-production-sample-audit.yml`  
Script: `scripts/radar-production-sample-audit.mjs`

## Variables analizadas

- **Períodos:** cantidad de períodos distintos y rango mínimo/máximo dentro de la muestra.
- **Métricas y dimensiones:** cardinalidad y ejemplos de indicador, tipo de indicador, serie, unidad, clasificador, apertura y dimensiones territoriales.
- **Campos numéricos:** recuento de valores numéricos, nulos, marcas conocidas y valores no numéricos.
- **Integridad muestral:** presencia de campos mínimos y duplicados de una clave compuesta explícita por servicio.
- **Conteo total:** total informado por `Content-Range`, separado del tamaño de muestra descargado.

El workflow publica el perfil completo en el resumen de GitHub Actions y en los logs del job para facilitar su revisión y archivo. No escribe ni modifica datos en INDEC ni en el Worker.

## Alcance y límites

- Consulta hasta 1.000 registros por servicio, ordenados según la configuración actual del Worker.
- Los resultados describen una **muestra de hasta 1.000 filas**, no el universo completo.
- Un período único en la muestra no significa que el indicador tenga un solo período disponible.
- Un duplicado según la clave propuesta requiere revisión metodológica; no se elimina automáticamente.
- Las marcas, nulos y valores no numéricos se reportan, nunca se convierten a cero.
- El perfil no recorre todas las combinaciones de filtros ni valida la presentación en el navegador.
- IPI manufacturero se incluye para diagnóstico, pero permanece deshabilitado hasta completar su validación integral.

Este control aporta evidencia para la auditoría de cada indicador; no sustituye la validación manual ni el análisis del conjunto completo cuando el riesgo o el volumen lo requieren.
