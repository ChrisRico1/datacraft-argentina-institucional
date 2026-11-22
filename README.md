# Datacraft Argentina

Sitio institucional y laboratorio de demostraciones de Datacraft Argentina. Este repositorio contiene el código fuente del sitio y sus proyectos demostrativos.

- **Repositorio:** https://github.com/ChrisRico1/datacraft-argentina-institucional
- **Sitio:** https://datacraft-argentina.lovable.app
- **Mercado:** Argentina

## Fuente de verdad y forma de trabajo

- GitHub es la fuente de verdad del código.
- Los cambios se desarrollan en ramas y se revisan mediante Pull Requests.
- No integrar cambios en `main` sin autorización explícita.
- Lovable se conserva como entorno de visualización/sincronización y publicación; no es el editor principal del desarrollo.
- Antes de modificar una funcionalidad, revisar su implementación actual, sus dependencias y sus pruebas.
- No eliminar funcionalidades, reescribir historial ni borrar ramas/PR sin evaluar sus referencias y utilidad.
- No inventar clientes, datos, testimonios, fuentes, métricas, certificaciones ni resultados.
- Mantener identidad visual, accesibilidad, diseño responsive y consistencia entre secciones.

## Marca y posicionamiento

Datacraft Argentina es una consultora tecnológica integral. Su posicionamiento es transformar información, procesos y datos en soluciones para organizaciones públicas y privadas.

Mensaje de marca propuesto: **«Transformamos información en soluciones. Tecnología en resultados.»**

El tono es profesional, claro, estratégico y cercano, en español rioplatense. No reducir la marca a Excel, planillas, diseño web, bots ni BI.

Segmentos prioritarios: sector público, empresas y pymes, comercios. Modelo de negocio: soluciones propias y desarrollos a medida.

## Servicios

1. **Transformación digital:** digitalización de operaciones, sistematización de procesos, herramientas de gestión e integración de sistemas.
2. **Datos e inteligencia de negocios:** BI, tableros ejecutivos, procesamiento y organización de datos, indicadores, análisis territorial y observatorios.
3. **Automatización e inteligencia artificial:** automatización de tareas y flujos, bots conversacionales, integraciones API, asistentes/agentes de IA y automatización de atención.
4. **Sistemas y gestión empresarial:** herramientas personalizadas, seguimiento comercial y de clientes, gestión administrativa, financiera e inventarios, portales y sistemas a medida.
5. **Ciberseguridad y gestión de información:** diagnóstico, auditoría, evaluación de prácticas, gestión de accesos, respaldo y asesoramiento. No afirmar monitoreo 24/7, respuesta a incidentes, certificaciones, pentesting ni SOC.
6. **Soluciones para sector público:** relevamientos digitales, sistematización de datos institucionales, tableros de gestión, indicadores, observatorios y análisis territorial/políticas públicas.

## Experiencia y comunicación responsable

Se trabajó con Google Sheets, Apps Script, formularios, automatizaciones, Python, APIs, JavaScript, HTML/CSS, dashboards y visualización de datos; un tablero ejecutivo para información territorial; integración de captación de consultas por WhatsApp Cloud API hacia Google Sheets; herramientas de gestión con Apps Script; prototipo de gestión/financiación de celulares; landing pages y capacitaciones.

Diferenciar experiencia, desarrollos y prototipos. No inventar clientes, resultados, métricas, premios, certificaciones ni testimonios. No identificar organismos ni publicar capturas confidenciales.

## Datos de contacto confirmados

- Instagram: https://www.instagram.com/datacraftargentina/
- Facebook: https://www.facebook.com/DatacraftArgentina
- YouTube: https://www.youtube.com/@DatacraftArgentina

No hay teléfono, WhatsApp comercial, correo, dirección, horarios, reseñas ni valoración confirmados. No inventarlos. El CTA principal es «Hablemos de tu proyecto» y debe dirigir a Instagram mientras no exista otro canal comercial confirmado. Los contactos faltantes deben quedar vacíos en la configuración central y ocultos en la interfaz. No crear formularios que aparenten enviar información si no existe backend.

## Identidad visual y experiencia

- Estética híbrida: institucional premium y tecnología disruptiva.
- Paleta: verde bosque oscuro, verde lima/amarillo ácido, carbón, blanco cálido y verdes secundarios.
- Tokens CSS en OKLCH; Inter para cuerpo y Sora para títulos.
- Contraste accesible, jerarquía editorial, espacios amplios, microinteracciones sutiles y diseño responsive.
- Módulos tipo bento, líneas y visualizaciones abstractas de datos.
- Evitar plantillas SaaS genéricas y exceso de gradientes.
- Usar referencias visuales de marca existentes; si un recurso no está disponible, no inventar un logo o isotipo nuevo.

## Estructura actual del sitio

| Ruta | Contenido |
|---|---|
| `/` | Sitio institucional |
| `/observatorio` | Catálogo visible como **Proyectos**; se conserva la URL por compatibilidad |
| `/observatorio/radar-estadistico-argentina` | Explorador de indicadores del INDEC |
| `/observatorio/infraestructura-cloacal` | Demostración territorial de infraestructura cloacal |
| `/municipio-en-obra` | Demostración conceptual de seguimiento de obras |
| `/api/radar/:indicator` | Proxy servidor validado para el Catálogo API-INDEC |

Orden del catálogo de Proyectos:
1. Radar Estadístico Argentina.
2. Infraestructura Cloacal.
3. Municipio en Obra.

Los proyectos son demostraciones de capacidades y no deben presentarse como sistemas productivos si no lo son.

### Radar Estadístico Argentina

Explorador de indicadores oficiales del INDEC. La integración utiliza una ruta del servidor para proteger el token. Los textos deben explicar con claridad variable, unidad, período, cobertura geográfica, faltantes y limitaciones. Las comparaciones y visualizaciones deben respetar la naturaleza estadística de cada serie.

### Infraestructura Cloacal

Demostración territorial de información pública relacionada con ACUMAR y la Cuenca Matanza-Riachuelo. Diferenciar referencias geográficas aproximadas de la ubicación exacta de obras y de límites oficiales. Identificar fuentes y períodos de referencia.

### Municipio en Obra

Demostración conceptual de seguimiento de obras. Los ejemplos ficticios deben identificarse claramente; no implica conexión con un municipio ni con una base operativa real.

## Arquitectura y tecnologías

- React 19 y TypeScript.
- TanStack Start y TanStack Router con rutas basadas en archivos.
- Vite 8, Tailwind CSS 4 y configuración de build de Lovable.
- Recharts para visualizaciones y Leaflet para mapas.
- Zod para validaciones; Vitest y Testing Library para pruebas.
- Nitro con destino Cloudflare Workers.
- Datos públicos del Observatorio mantenidos en archivos locales validados.
- Integración INDEC implementada en servidor; el navegador no debe recibir ni enviar el secreto upstream.

La configuración de marca, redes y datos de contacto se centraliza en `src/config/site.ts`. Los campos no confirmados deben permanecer vacíos y ocultos.

## Desarrollo local

Requisitos: Bun compatible con el lockfile `bun.lock` y una versión de Node.js compatible con Vite/Nitro.

```bash
git clone https://github.com/ChrisRico1/datacraft-argentina-institucional.git
cd datacraft-argentina-institucional
bun install --frozen-lockfile
bun run dev
```

Comandos de validación:

```bash
bun run lint
bun run test
bun run build
```

Ejecutar desde la raíz. No declarar una validación como aprobada si no se ejecutó realmente.

## Variables de entorno y seguridad

Copiar `.env.example` a `.env.local` para desarrollo y completar `INDEC_API_TOKEN`. En producción, configurar esa variable como Secret en Cloudflare Workers.

- Nunca usar el prefijo `VITE_` para secretos.
- Nunca subir tokens al repositorio ni incluirlos en logs, issues o PR.
- No exponer el token upstream al navegador.

La arquitectura, endpoints registrados, filtros, paginación y notas estadísticas están documentados en [docs/radar-indec-integration.md](docs/radar-indec-integration.md).

## Flujo de trabajo para cada cambio

1. Consultar HEAD de `main`, ramas y PR abiertos.
2. Crear una rama nueva desde el `main` actualizado.
3. Limitar cada PR a un objetivo coherente y acotado.
4. Ejecutar lint, pruebas y build cuando el entorno lo permita; informar validaciones pendientes.
5. Revisar diferencias, efectos secundarios, rutas, accesibilidad y documentación.
6. Abrir un PR hacia `main` con objetivo, alcance, archivos, pruebas, resultados, riesgos y pendientes.
7. Esperar autorización explícita antes de hacer merge.

## Documentación relacionada

- [Integración API-INDEC](docs/radar-indec-integration.md): arquitectura, configuración, endpoints y consideraciones estadísticas.
- [Carga de datos del Observatorio](src/features/observatorio/README.md): formato, validación y límites de los datos territoriales.
- [Convenciones de rutas](src/routes/README.md): enrutamiento basado en archivos.
- [Hoja de ruta](roadmap.md): prioridades técnicas y funcionales.

## Estado de validación

La existencia de scripts de lint, pruebas y build no implica que una rama o el sitio publicado estén validados. Consultar los checks del PR y el registro real de ejecución antes de aprobar una integración.
