# Infraestructura Cloacal — candidato cartográfico IGN «Subcuencas ACUMAR»

## 1. Hallazgo

En el catálogo oficial de Capas SIG del Instituto Geográfico Nacional (IGN) se identificó una capa vectorial denominada **«Subcuencas ACUMAR»**, publicada dentro del proyecto «Anticipando la Crecida».

- Catálogo: https://www.ign.gob.ar/NuestrasActividades/InformacionGeoespacial/CapasSIG
- Metadatos PDF: https://www.ign.gob.ar/capas-sig/metadata/anticipando_crecida_subcuenca_acumar.pdf
- Nombre de capa: Subcuencas ACUMAR.
- Tipo de geometría: polígono.
- Formato declarado: Shapefile.
- CRS declarado: GCS_WGS_1984 / EPSG:4326.
- Fecha de creación y última actualización de metadatos: 22/09/2022.
- Extensión declarada: longitud oeste -59,050910; este -58,340652; latitud norte -34,612637; sur -35,123364.
- Campos documentados: `Nam` (nombre de la subcuenca) y `fuente` (origen del procesamiento).
- Créditos: Proyecto Anticipando la Crecida, Instituto Geográfico Nacional de la República Argentina.
- Linaje declarado: el proyecto tomó las subcuencas publicadas por ACUMAR para describir su zona de trabajo.

Los metadatos indican «Libre uso de la información», sujeto a citar adecuadamente al IGN y a ACUMAR.

## 2. Qué permite afirmar y qué no

La ficha confirma la existencia de una distribución poligonal de subcuencas ACUMAR, con formato, CRS, extensión, campos y condiciones de atribución declarados. Es una fuente candidata concreta para avanzar en la reconstrucción del modelo territorial.

**No confirma por sí sola** que el archivo contenga el límite exterior hidrográfico completo aprobado por Resolución ACUMAR 1113/2013, que incluya todas las subcuencas pertinentes, ni que sus geometrías coincidan exactamente con los anexos normativos. La capa se denomina «Subcuencas ACUMAR» y su linaje refiere a un proyecto de gestión del riesgo; por eso no debe etiquetarse como «límite oficial de la cuenca» sin inspección y comparación.

Tampoco se afirma que el archivo Shapefile haya sido descargado o que sus geometrías hayan sido validadas. El catálogo presenta un control de descarga dinámico y la herramienta de consulta disponible permitió verificar los metadatos, no recuperar el archivo binario.

## 3. Relación con la referencia normativa

La Resolución ACUMAR 1113/2013 aprueba el Mapa de Delimitación Topográfica de la Cuenca Hidrográfica del Río Matanza Riachuelo y su informe. El informe describe la delimitación hidrográfica y las subcuencas que la componen.

Referencia normativa:
https://www.argentina.gob.ar/normativa/nacional/resoluci%C3%B3n-1113-2013-221349/texto

La capa IGN debe contrastarse con:
1. Figura 1 del Anexo I: límite hidrográfico de la cuenca.
2. Figura 2: subcuencas de la cuenca.
3. Informe del Anexo II: descripción de límites y subcuencas.

La comparación debe determinar si la suma/unión de polígonos cubre el límite exterior normativo, si existen huecos o solapamientos, si hay subcuencas omitidas y si el trazado responde a la misma delimitación. No se debe asumir que la unión geométrica reproduce automáticamente el límite exterior.

## 4. Próximo procedimiento de validación

Cuando se obtenga el archivo desde el catálogo IGN:

1. Registrar URL efectiva de descarga, fecha, nombre original, tamaño y SHA-256.
2. Inspeccionar el ZIP sin modificarlo: contenido, número de archivos, nombres de capas y campos.
3. Confirmar el CRS real desde el archivo PRJ; EPSG:4326 es por ahora el CRS declarado en metadatos.
4. Comprobar geometrías vacías, inválidas, multipartes, anillos, huecos y solapamientos.
5. Revisar valores únicos de `Nam` y `fuente`, cantidad de entidades y extensión real.
6. Comparar visual y geométricamente con el Anexo I/II de la Resolución 1113/2013; documentar diferencias y tolerancias.
7. Separar el límite hidrográfico de cualquier delimitación jurisdiccional.
8. Solo después de esa validación, evaluar si la capa sirve como base de subcuencas, límite exterior o ambas cosas, y definir su uso en intersecciones con radios censales.

## 5. Decisión actual

- **Estado:** fuente candidata identificada; metadatos consultados; descarga e inspección geométrica pendientes.
- **Uso permitido según ficha:** libre uso con atribución adecuada al IGN y ACUMAR.
- **Integración en la aplicación:** no autorizada todavía; no se incorporan datos ni se reemplaza el mapa.
- **Condición de avance:** recuperar el archivo y completar el procedimiento de validación contra la Resolución 1113/2013.
