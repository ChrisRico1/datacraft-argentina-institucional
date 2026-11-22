# Hoja de ruta — Datacraft Argentina

Este documento organiza el trabajo pendiente. Las prioridades se revisan contra el estado real de `main` antes de iniciar cada tarea.

## Criterios de prioridad

- **P0 — Integridad:** seguridad, errores de build, pérdida de datos, regresiones y disponibilidad.
- **P1 — Experiencia y producto:** mejoras que afectan comprensión, uso y valor de los proyectos.
- **P2 — Calidad y mantenimiento:** documentación, accesibilidad, rendimiento, consistencia y deuda técnica.
- **P3 — Evolución:** nuevas capacidades una vez estabilizada la base.

## P0 — Verificación de la base

- [x] Ejecutar instalación con lockfile congelado, lint, pruebas y build mediante GitHub Actions en las PR del repositorio.
- [ ] Verificar el despliegue real, las rutas públicas y los logs de runtime; distinguir preview, build y producción.
- [ ] Confirmar la disponibilidad y fecha de renovación de `INDEC_API_TOKEN` en Cloudflare sin exponer su valor; el token vence a los 12 meses y regenerarlo invalida el anterior.
- [ ] Revisar compatibilidad Nitro/Cloudflare y la configuración Wrangler actual.
- [x] Incorporar CI reproducible para lint, pruebas y build mediante GitHub Actions.
- [ ] Comprobar navegación, errores, responsive y accesibilidad de las rutas principales.

## P1 — Radar Estadístico Argentina

- [x] Incorporar paginación incremental desde el código vigente de `main`: carga inicial acotada, bloques de 1.000, conservación de filtros, cancelación al cambiar la consulta y límite de offset del servidor.
- [ ] Probar los 15 indicadores registrados contra el catálogo vigente del INDEC y documentar cobertura, campos y limitaciones.
  - [x] Automatizar un smoke de Production para los 15 servicios: contrato mínimo, CORS, período y filtros representativos. Ver `docs/radar-production-smoke.md`.
  - [x] Ejecutar el smoke en Production: 15/15 servicios superaron disponibilidad, esquema mínimo y filtro representativo. Documentado en `docs/radar-indec-indicator-audit.md`. La validación integral de métricas, filtros y datos sigue pendiente.
  - [x] Automatizar el perfil de hasta 1.000 filas por servicio para revisar períodos, cardinalidad de métricas/dimensiones, nulos, marcas, valores no numéricos y duplicados de clave compuesta. Ver `docs/radar-production-sample-audit.md`.
  - [ ] Ejecutar el perfil de muestra en Production, revisar los resultados y actualizar el estado por indicador sin extrapolar la muestra al universo completo. **Avance:** IPC, Índice de salarios, EMAE — nivel general, Pobreza e indigencia y Mercado de trabajo validados manualmente en Production el 22/11/2026 (5/15). IPI manufacturero cuenta con validación parcial de descarga paginada (41.667 registros, 22/11/2026), pero sigue deshabilitado y pendiente de integridad, filtros e interfaz; no se suma al conteo de indicadores validados.
- [ ] Validar en Production el manejo de límites de consulta (`429`), su mensaje visible y el procedimiento de recuperación.
- [ ] Revisar la etiqueta comercial/funcional del Radar en el catálogo de Proyectos para que refleje el estado real.
- [x] Mejorar la explicación de unidades, períodos, cobertura geográfica, faltantes y marcas estadísticas.
  - [x] Incorporar guías contextuales para IPC, salarios, EMAE, pobreza, mercado de trabajo y SIPM: distinguir índices, variaciones e incidencias; explicar bases, períodos de comparación, universos y denominadores. No se habilitan indicadores pendientes.
  - [x] Crear un diccionario de metadatos para los 15 servicios y explicar debajo de cada indicador, métrica, filtro, período y desagregación qué representa la variable y cómo interpretar la selección. Incorporar glosario de tabla y marcas estadísticas. Ver `docs/radar-metadata-dictionary.md`.
- [ ] Revisar la selección de visualizaciones según el tipo de variable y evitar comparaciones estadísticamente inválidas.
  - [x] Incorporar una referencia en cero y una escala que incluya el cero en series porcentuales y de puntos porcentuales, sin truncar valores negativos; conservar escalas automáticas para índices, monedas y cantidades.
- [x] Incorporar composición apilada de Canasta de crianza con componentes y total publicados por INDEC, sin recalcular ni ocultar diferencias de redondeo.
- [x] Incorporar exportación CSV de los registros efectivamente cargados, con encabezados originales y codificación UTF-8.
- [x] Mejorar la visibilidad del botón CSV e indicar claramente cuántos registros cargados se exportan.
- [ ] Evaluar comparaciones adicionales solo después de validar los datos y sus dimensiones.

## P1 — Infraestructura Cloacal

- [x] Auditar la arquitectura actual, la ruta pública, el modelo de datos, la cartografía y las fuentes registradas; documentar la línea de base en `docs/infraestructura-cloacal-audit.md`.
- [x] Incorporar parser inicial aislado para los CSV originales ACUMAR, con pruebas basadas en muestras compartidas: encabezados, campos citados multilínea, servicio, estados, cantidades, porcentajes y fechas.
- [ ] Reconciliar el inventario comprimido de obras con los recursos completos 2024 y 2025 de ACUMAR; verificar cantidades, identificadores, duplicados, cambios entre cortes y alcance territorial. La revisión completa sigue pendiente porque solo se recibieron muestras parciales.
- [ ] Obtener y validar geometrías oficiales de la cuenca hidrográfica/jurisdiccional y radios censales compatibles.
  - La Resolución ACUMAR 1113/2013 es la referencia normativa del límite. Monitor PISA muestra capas hidrográfica y jurisdiccional, pero no se identificó una descarga vectorial directa desde ese visor.
  - Se identificó en el catálogo SIG del IGN la capa poligonal «Subcuencas ACUMAR» (Shapefile, EPSG:4326 declarado, metadatos 22/09/2022). El IGN indica que tomó las subcuencas publicadas por ACUMAR y permite su uso con atribución al IGN y ACUMAR. Es una fuente candidata, no una geometría validada del límite exterior: descarga, inspección y comparación con los anexos de la Resolución 1113/2013 siguen pendientes. Ver `docs/infraestructura-cloacal-ign-subbasins.md`.
  - PBA declara CC BY 4.0 a nivel de catálogo; falta confirmar que la licencia aplica al ZIP cartográfico individual. CABA declara CC-BY-2.5-AR en la ficha de la capa, pero la página general IDEEC prohíbe comercializar los datos: no integrar en entregas comerciales hasta obtener aclaración escrita. GeoNode INDEC mantiene licencia no especificada.
  - Pendientes: descargar e inspeccionar los ZIP censales, verificar CRS, campos, cobertura y topología; recuperar y validar la capa IGN; obtener de ACUMAR el vector oficial hidrográfico/jurisdiccional o su endpoint, si difiere de la capa IGN; comparar contra anexos de la Resolución 1113/2013.
- [ ] Auditar variables censales de desagüe a red pública, universo y nivel geográfico.
- [ ] Verificar capas e indicadores de cobertura cloacal del Monitor PISA, su fecha y su definición; distinguir cobertura de conexión efectiva.
- [ ] Diseñar cruces territoriales reproducibles sin atribuir a la cuenca datos municipales completos ni usar centros urbanos como ubicación de obras.
- [ ] Incorporar estados visibles de carga, error y actualización de datos.

## P1 — Otros proyectos demostrativos

- [ ] Revisar el recorrido de demostración de Municipio en Obra y la identificación visible de datos ficticios.
- [ ] Verificar que el orden del catálogo sea Radar Estadístico Argentina, Infraestructura Cloacal y Municipio en Obra.

## P2 — Orden y calidad del repositorio

- [ ] Actualizar documentación heredada que describa una landing de una sola página o instrucciones que ya no representan el producto.
- [ ] Inventariar las ramas antiguas y comparar su contenido con `main` antes de proponer su cierre o eliminación.
- [x] Revisar y cerrar los PR obsoletos #11 (la página actual de Municipio en Obra ya está en `main` y reemplaza su propuesta antigua) y #15 (documento conceptual sustituido por la documentación vigente del Radar); #33 fue reemplazada por #64.
- [ ] Revisar dependencias, configuración de TypeScript/ESLint/Prettier y consistencia de nombres.
- [ ] Ampliar cobertura de pruebas de rutas, estados de carga/error, filtros, paginación y componentes de visualización (la exportación CSV ya cuenta con pruebas unitarias).
- [ ] Revisar accesibilidad por teclado, contraste, etiquetas y preferencias de movimiento reducido.
- [ ] Medir rendimiento de mapas, tablas, visualizaciones y carga de datos.

## P3 — Evolución

- [ ] Mejorar el catálogo de Proyectos con fichas consistentes y demostraciones guiadas.
- [ ] Incorporar nuevas soluciones solo cuando exista un caso de uso concreto, fuentes verificables y un alcance demostrable.
- [ ] Evaluar mejoras SEO, metadatos sociales y datos estructurados con revisión de rutas y contenido real.

## Registro de trabajo

Cada tarea debe quedar documentada en su PR: problema, decisión, alcance, archivos modificados, pruebas ejecutadas, resultados, riesgos y pendientes. No marcar tareas como completadas sin evidencia verificable.
