# Datacraft Argentina — sitio institucional

Sitio institucional y laboratorio de demostraciones de Datacraft Argentina. El proyecto reúne la presentación comercial, las soluciones y una selección de desarrollos demostrativos.

**Repositorio de referencia:** https://github.com/ChrisRico1/datacraft-argentina-institucional  
**Sitio publicado:** https://datacraft-argentina.lovable.app

## Criterios del proyecto

- El código de GitHub es la fuente de verdad.
- Los cambios se desarrollan en ramas y se entregan mediante Pull Requests.
- No integrar cambios en `main` sin autorización explícita.
- Lovable se utiliza para visualizar/sincronizar el proyecto, no como editor principal.
- Antes de modificar una funcionalidad, revisar su implementación actual y sus pruebas.
- No inventar clientes, datos, testimonios, fuentes, métricas, certificaciones ni resultados.
- Mantener la identidad visual, accesibilidad, responsive y consistencia entre secciones.
- Los proyectos publicados son demostraciones de capacidades; no deben presentarse como sistemas productivos si no lo son.

## Estructura funcional

| Ruta | Contenido |
|---|---|
| `/` | Sitio institucional y presentación de Datacraft |
| `/observatorio` | Catálogo de proyectos y demostraciones |
| `/observatorio/radar-estadistico-argentina` | Explorador de indicadores del INDEC |
| `/observatorio/infraestructura-cloacal` | Demostración territorial de infraestructura cloacal |
| `/municipio-en-obra` | Demostración conceptual de seguimiento de obras |
| `/api/radar/:indicator` | Proxy servidor validado para el Catálogo API-INDEC |

La ruta `/observatorio` se conserva por compatibilidad. El nombre visible de la sección es **Proyectos**.

## Proyectos demostrativos

1. **Radar Estadístico Argentina:** consulta y visualización de indicadores oficiales del INDEC. La integración utiliza una ruta servidor para proteger el token.
2. **Infraestructura Cloacal:** lectura territorial de información pública relacionada con ACUMAR y la Cuenca Matanza-Riachuelo. Las referencias geográficas aproximadas no representan la ubicación exacta de obras ni límites oficiales.
3. **Municipio en Obra:** demostración conceptual de seguimiento de obras. Los ejemplos ficticios deben identificarse como tales; no implica conexión con un municipio ni con una base operativa real.

## Arquitectura y tecnologías

- React 19 y TypeScript.
- TanStack Start y TanStack Router (rutas basadas en archivos).
- Vite 8, Tailwind CSS 4 y configuración de build de Lovable.
- Recharts para visualizaciones y Leaflet para mapas.
- Zod para validaciones; Vitest y Testing Library para pruebas.
- Nitro con destino Cloudflare Workers.
- Los datos públicos del Observatorio se mantienen en archivos locales validados.
- La integración INDEC se implementa en servidor; el navegador no debe recibir ni enviar el secreto upstream.

La configuración de marca, redes y datos de contacto se centraliza en `src/config/site.ts`. Los campos de contacto no confirmados deben permanecer vacíos y ocultos.

## Desarrollo local

Requisitos: Bun compatible con el lockfile del repositorio y Node.js compatible con Vite/Nitro.

```bash
git clone https://github.com/ChrisRico1/datacraft-argentina-institucional.git
cd datacraft-argentina-institucional
bun install --frozen-lockfile
bun run dev
```

Comandos de validación:

```bash
bun run lint
bun test
bun run build
```

Los comandos deben ejecutarse desde la raíz. No declarar una validación como aprobada si no se ejecutó realmente.

## Variables de entorno

Copiar `.env.example` a `.env.local` para desarrollo y cargar el secreto:

```env
INDEC_API_TOKEN=
```

En producción, configurar `INDEC_API_TOKEN` como **Secret** en el entorno de Cloudflare Workers. Nunca usar el prefijo `VITE_`, subir el token al repositorio ni incluirlo en logs, issues o PRs.

La arquitectura, endpoints registrados, filtros, paginación y notas estadísticas de la integración están documentados en [docs/radar-indec-integration.md](docs/radar-indec-integration.md).

## Flujo de trabajo GitHub

1. Consultar el HEAD de `main`, ramas y PR abiertos antes de comenzar.
2. Crear una rama nueva desde el `main` actualizado.
3. Limitar cada PR a un objetivo coherente y acotado.
4. Ejecutar lint, pruebas y build cuando el entorno lo permita; informar claramente cualquier validación pendiente.
5. Revisar diferencias, efectos secundarios, rutas, accesibilidad y documentación.
6. Abrir un PR hacia `main` con objetivo, alcance, archivos, pruebas, riesgos y pendientes.
7. Esperar autorización explícita antes de hacer merge.

No reescribir historial publicado ni borrar ramas/PR antiguos sin evaluar primero sus referencias y su utilidad.

## Documentación

- [Integración API-INDEC](docs/radar-indec-integration.md): arquitectura, configuración, endpoints y consideraciones estadísticas.
- [Carga de datos del Observatorio](src/features/observatorio/README.md): formato, validación y límites de los datos territoriales.
- [Convenciones de rutas](src/routes/README.md): enrutamiento basado en archivos.
- [Hoja de ruta](roadmap.md): prioridades técnicas y funcionales.

## Estado de validación

El repositorio incluye scripts de lint, pruebas y build. La existencia de esos scripts no implica que la versión publicada o cada rama estén validadas. Consultar los checks del PR y el registro de ejecución antes de aprobar una integración.
