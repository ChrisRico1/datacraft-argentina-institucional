# Radar Estadístico Argentina: rediseño analítico + orden de Proyectos

## Lo que ya revisé
- La página del Radar trae datos con una sola consulta a `/api/radar/<indicador>` y los muestra sobre todo en una tabla técnica, con un panel de metadatos (unidad, fuente, etc.).
- El adaptador INDEC tiene 15 indicadores permitidos. Para cada uno define qué campos usar como período, región, serie, tipo de indicador y categoría.
- El token del INDEC está disponible en el entorno de trabajo, así que puedo probar con datos reales sin ver ni modificar su valor.
- El proyecto ya incluye una librería de gráficos (Recharts) y su componente base. No hace falta agregar dependencias pesadas.
- En el listado de Proyectos, el orden actual es Infraestructura Cloacal, Municipio en Obra y Radar.

## Paso 1: auditoría de datos (antes de diseñar cada gráfico)
Voy a consultar los 15 indicadores en el entorno y documentar en `docs/radar-indec-integration.md`:
- si responden con datos válidos;
- qué columna real es período, valor, unidad, región, categoría o tipo de indicador;
- periodicidad, cobertura, marcas de dato provisorio o confidencial, y cantidad total de registros.

Ningún nombre de campo, unidad o cobertura se da por hecho: todo sale de esa auditoría. Si un indicador no tiene un campo de valor claro o devuelve error, se muestra como "En revisión", con un enlace a la fuente y sin gráfico.

## Paso 2: tipo de gráfico por indicador (propuesta, se ajusta según la auditoría)

| Indicador | Gráfico principal | Complementos |
|---|---|---|
| IPC | Línea de la variación mensual, por región | Tarjetas con el último dato, la variación interanual y la acumulada, si la fuente las publica como tipo de indicador. Barras ordenadas por división de gasto en el último mes |
| Salarios | Líneas por sector (registrado privado, público, no registrado) | Comparación con el IPC solo si coinciden la base y el período; si no, no se muestra |
| EMAE | Área con la serie original y línea de la desestacionalizada | Barras de variación interanual |
| Pobreza (EPH) | Barras por semestre de pobreza e indigencia (personas y hogares) | Pequeños múltiplos por área geográfica, solo con las áreas que publica la fuente |
| Mercado laboral (EPH) | Pequeños múltiplos de actividad, empleo y desocupación | Barras por aglomerado en el último trimestre; sin datos municipales |
| CBA / CBT | Líneas de valor en pesos por región | Tarjeta con el último valor y la variación mensual, calculada solo si hay períodos consecutivos |
| Canasta de crianza | Barras agrupadas por tramo de edad | Línea de evolución por tramo |
| Exportaciones | Ranking horizontal por rubro y destino | Barras apiladas al 100 % por rubro si las cifras suman un total comparable; evolución mensual |
| Importaciones | Ranking por uso económico y origen | Composición por uso económico; evolución mensual |
| Población por departamento | Ranking horizontal filtrable por provincia | Mapa solo si se puede unir la geografía oficial con los códigos de departamento; si no, no hay mapa |
| Población por jurisdicción | Pirámide de edades (barras horizontales espejadas por sexo) | Línea de proyección total |
| Población nacional | Pirámide de edades con selector de año | Línea de proyección 2022–2040 con banda que marca los años proyectados |
| IPI manufacturero | Línea del nivel general | Barras de variación interanual por bloque; pequeños múltiplos por rama |
| SIPM (mayoristas) | Línea del nivel general | Barras de variación mensual por rubro |
| Costo de la construcción | Línea por capítulo (materiales, mano de obra, gastos generales) | Tarjeta con la variación mensual e interanual |

Reglas para todos los gráficos:
- Las variaciones interanual o mensual solo se muestran si la fuente las publica o si existen los dos períodos exactos necesarios. Si falta alguno, no se calculan.
- No hay tortas.
- No se convierte un dato faltante en cero.

## Paso 3: nueva experiencia de la página
1. **Explorador de indicadores:** tarjetas agrupadas por tema (Precios, Actividad, Social y trabajo, Comercio exterior, Población). Cada una dice qué pregunta responde.
2. **Resumen ejecutivo** del indicador elegido: último valor, unidad, período de referencia, variación válida y fecha de consulta. Incluye marcas de "Provisorio" o "Confidencial" cuando la fuente las informe.
3. **Visualización principal**, con un título que plantea la pregunta (por ejemplo, "¿Cómo evolucionaron los precios mes a mes?"), ejes rotulados, la unidad visible y formato argentino (`es-AR`, coma decimal).
4. **Comparaciones:** pequeños múltiplos o rankings.
5. **Recursos útiles:** bandas para las proyecciones, una línea de referencia en 0 % para las variaciones y anotaciones de hitos. Las anotaciones solo marcan cambios de base o metodología documentados por el INDEC, nunca hechos políticos.
6. **"Cómo leer este dato":** nota metodológica breve, cobertura geográfica, periodicidad y fuente INDEC con enlace.
7. **Tabla de datos secundaria** que se puede plegar, con búsqueda, paginación y descarga en CSV.
8. **Estados claros** para carga, error, falta de datos y cobertura parcial, en tono afirmativo.

Se mantienen la paleta ink, el acento lima, las tipografías, las tarjetas uniformes y el diseño adaptado a celular.

## Paso 4: orden de Proyectos
En `/observatorio`, Radar Estadístico Argentina pasa al primer lugar, seguido por Infraestructura Cloacal y Municipio en Obra. Sus enlaces, textos y estilos quedan iguales.

## Verificaciones de calidad
- Pruebas unitarias para el armado de las series:
  - la variación interanual solo se calcula con el período exacto de 12 meses antes;
  - un dato faltante queda vacío y no se convierte en cero;
  - el formato argentino de números es correcto;
  - el orden de los rankings es correcto.
- Una prueba que confirma el nuevo orden de Proyectos.
- Se mantienen las pruebas existentes del adaptador INDEC; el adaptador, la ruta de la API y el manejo del token no se tocan.
- Recorrido en el navegador, en computadora y celular, por los 15 indicadores con datos reales: que los gráficos se vean, no haya desborde horizontal ni errores en consola, el teclado y los focos funcionen y los textos de los ejes sean legibles.
- Revisión del registro de compilación y del lint.
- No se publica nada.

## Detalles técnicos
- Archivos nuevos en `src/features/radar/`:
  - `indicators.ts`: configuración tipada por indicador (campos auditados, tipo de gráfico, pregunta, nota metodológica);
  - `transform.ts`: funciones puras de series, variaciones y rankings;
  - `charts/`: componentes con Recharts;
  - `components.tsx`: KPI, explorador, tabla y descarga CSV.
- `observatorio.radar-estadistico-argentina.tsx` se reorganiza usando esos módulos. La consulta sigue pasando por `/api/radar/$indicator`, y se pueden pedir hasta 1000 filas para tener series completas.
- `observatorio.index.tsx`: se reordenan las tarjetas, sin cambiar su contenido.
- Se agrega una regla en `AGENTS.md` sobre la configuración de visualización por indicador.
