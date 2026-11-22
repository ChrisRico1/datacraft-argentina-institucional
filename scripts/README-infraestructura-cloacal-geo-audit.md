# Auditoría cartográfica de Infraestructura Cloacal

## Ejecución local

Requisitos: Python 3.11+ y Shapely 2.x.

```bash
python -m pip install "shapely>=2,<3"
python scripts/infraestructura-cloacal-geo-audit.py
```

El proceso descarga las fuentes públicas en `artifacts/infraestructura-cloacal-geo-audit/`, extrae los recursos y genera `audit-report.json`. No modifica los datos públicos de la aplicación.

## Fuentes

1. **IGN — Subcuencas ACUMAR.** El proceso consulta primero el WFS y descubre si publica un único feature type identificable sin ambigüedad. Solo entonces descarga GeoJSON.
2. **Datos Abiertos PBA — Radios censales Censo 2022 (GeoJSON ZIP).** Recurso atribuido a INDEC, EPSG:4326 según ficha.

## Controles

- Descarga HTTP, tamaño y SHA-256.
- Recuento de entidades, tipos geométricos y campos.
- Extensión espacial calculada.
- Geometrías vacías, inválidas o no interpretables.
- Validez topológica individual con Shapely.
- CRS declarado por el recurso y CRS de metadatos, informados por separado.

No se reproyectan, reparan, simplifican ni alteran geometrías. La validez individual no demuestra ausencia de huecos/solapamientos entre entidades ni equivalencia con el límite normativo.

## Límites metodológicos

- Si el WFS IGN no expone una capa identificable, se registra `not_downloaded`; no se inventa un endpoint ni se usa una geometría aproximada.
- «Subcuencas ACUMAR» es una fuente candidata. Su equivalencia con el límite hidrográfico aprobado por Resolución ACUMAR 1113/2013 requiere contraste con los anexos normativos.
- El catálogo PBA declara CC BY 4.0 para el conjunto. Confirmar que la licencia cubra el recurso individual antes de redistribuirlo; mantener atribución a INDEC y Datos Abiertos PBA.
- No se descarga la capa CABA por las restricciones comerciales publicadas. No se incorpora GeoNode INDEC mientras la licencia figure como «Not Specified».
- No se asignan radios por centroide ni se prorratean indicadores municipales.

## Artefactos

El workflow manual `Infraestructura Cloacal — auditoría cartográfica` publica el informe y los archivos descargados como artefacto temporal de GitHub Actions. No son datos de producción.
