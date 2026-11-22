# Hoja de ruta — Datacraft Argentina

Este documento organiza el trabajo pendiente. Las prioridades se revisan contra el estado real de `main` antes de iniciar cada tarea.

## Criterios de prioridad

- **P0 — Integridad:** seguridad, errores de build, pérdida de datos, regresiones y disponibilidad.
- **P1 — Experiencia y producto:** mejoras que afectan comprensión, uso y valor de los proyectos.
- **P2 — Calidad y mantenimiento:** documentación, accesibilidad, rendimiento, consistencia y deuda técnica.
- **P3 — Evolución:** nuevas capacidades una vez estabilizada la base.

## P0 — Verificación de la base

- [ ] Ejecutar `bun install --frozen-lockfile`, lint, pruebas y build desde un checkout limpio de `main`.
- [ ] Verificar el despliegue real, las rutas públicas y los logs de runtime; distinguir preview, build y producción.
- [ ] Confirmar la disponibilidad de `INDEC_API_TOKEN` en Cloudflare sin exponer su valor.
- [ ] Revisar compatibilidad Nitro/Cloudflare y la configuración Wrangler actual.
- [ ] Incorporar CI reproducible para lint, pruebas y build si no existe un mecanismo equivalente.
- [ ] Comprobar navegación, errores, responsive y accesibilidad de las rutas principales.

## P1 — Radar Estadístico Argentina

- [x] Incorporar paginación incremental desde el código vigente de `main`: carga inicial acotada, bloques de 1.000, conservación de filtros, cancelación al cambiar la consulta y límite de offset del servidor.
- [ ] Probar los 15 indicadores registrados contra el catálogo vigente del INDEC y documentar cobertura, campos y limitaciones.
- [ ] Revisar la etiqueta comercial/funcional del Radar en el catálogo de Proyectos para que refleje el estado real.
- [ ] Mejorar la explicación de unidades, períodos, cobertura geográfica, faltantes y marcas estadísticas.
- [ ] Revisar la selección de visualizaciones según el tipo de variable y evitar comparaciones estadísticamente inválidas.
- [x] Incorporar exportación CSV de los registros efectivamente cargados, con encabezados originales y codificación UTF-8.
- [ ] Evaluar comparaciones adicionales solo después de validar los datos y sus dimensiones.

## P1 — Proyectos demostrativos

- [ ] Revisar fuentes, fecha de corte, alcance territorial y trazabilidad de Infraestructura Cloacal.
- [ ] Mantener diferenciadas las referencias municipales aproximadas de la localización real de obras y límites oficiales.
- [ ] Revisar el recorrido de demostración de Municipio en Obra y la identificación visible de datos ficticios.
- [ ] Verificar que el orden del catálogo sea Radar Estadístico Argentina, Infraestructura Cloacal y Municipio en Obra.

## P2 — Orden y calidad del repositorio

- [ ] Actualizar documentación heredada que describa una landing de una sola página o instrucciones que ya no representan el producto.
- [ ] Inventariar las ramas antiguas y comparar su contenido con `main` antes de proponer su cierre o eliminación.
- [ ] Resolver los PR abiertos #11, #15 y #33 mediante revisión individual; no integrarlos por antigüedad ni cerrarlos sin verificar su contenido.
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
