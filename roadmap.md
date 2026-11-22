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
- [ ] Probar los 15 indicadores registrados contra el catálogo vigente del INDEC y documentar cobertura, campos y limitaciones. **Avance:** IPC e Índice de salarios validados manualmente en Production el 22/11/2026 (2/15); los otros 13 indicadores siguen pendientes.
- [ ] Validar en Production el manejo de límites de consulta (`429`), su mensaje visible y el procedimiento de recuperación.
- [ ] Revisar la etiqueta comercial/funcional del Radar en el catálogo de Proyectos para que refleje el estado real.
- [ ] Mejorar la explicación de unidades, períodos, cobertura geográfica, faltantes y marcas estadísticas.
- [ ] Revisar la selección de visualizaciones según el tipo de variable y evitar comparaciones estadísticamente inválidas.
- [x] Incorporar composición apilada de Canasta de crianza con componentes y total publicados por INDEC, sin recalcular ni ocultar diferencias de redondeo.
- [x] Incorporar exportación CSV de los registros efectivamente cargados, con encabezados originales y codificación UTF-8.
- [x] Mejorar la visibilidad del botón CSV e indicar claramente cuántos registros cargados se exportan.
- [ ] Evaluar comparaciones adicionales solo después de validar los datos y sus dimensiones.

## P1 — Proyectos demostrativos

- [ ] Revisar fuentes, fecha de corte, alcance territorial y trazabilidad de Infraestructura Cloacal.
- [ ] Mantener diferenciadas las referencias municipales aproximadas de la localización real de obras y límites oficiales.
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
