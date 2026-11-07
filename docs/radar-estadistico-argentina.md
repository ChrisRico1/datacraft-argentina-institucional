# Radar Estadístico Argentina
## Diseño funcional y técnico

**Estado:** diseño aprobado para iniciar implementación  
**Alcance:** integral  
**Público:** mixto — ciudadanía, organismos públicos, empresas, consultoras y analistas  
**Ubicación:** Proyectos → Radar Estadístico Argentina  
**Fuente estadística principal:** Catálogo API-INDEC

## 1. Objetivo

Construir una plataforma web para explorar, comparar y reutilizar estadísticas oficiales argentinas. El proyecto debe demostrar capacidades de Datacraft en integración de APIs, ingeniería y normalización de datos, visualización, desarrollo web y diseño de herramientas para la toma de decisiones.

No reemplaza las publicaciones ni las metodologías del INDEC. Es una capa de consulta y exploración que debe conservar la trazabilidad hacia la fuente oficial.

## 2. Alcance funcional

### 2.1 Inicio / resumen
- Presentación del propósito, cobertura temática y fuente.
- Accesos directos a los módulos temáticos.
- Indicadores destacados únicamente cuando exista una respuesta válida y su metadata esté completa.
- Fecha y hora de última actualización de los datos mostrados.
- Estado del servicio de datos: actualizado, actualización pendiente o fuente temporalmente no disponible.

### 2.2 Pulso económico
Catálogo inicial de indicadores a validar contra los servicios efectivamente publicados:
- Índice de Precios al Consumidor (IPC).
- Salarios.
- Estimador Mensual de Actividad Económica (EMAE).
- Producción industrial manufacturera y minera.
- Precios mayoristas.
- Costo de la construcción.

Funciones: evolución temporal, variación intermensual/interanual cuando la fuente la provea o permita calcularla correctamente, selección de período y descarga.

### 2.3 Sociedad y condiciones de vida
Indicadores candidatos:
- Pobreza e indigencia.
- Mercado laboral y desocupación.
- Canasta Básica Alimentaria y Canasta Básica Total.
- Canasta de crianza.
- Indicadores demográficos disponibles.

Cada indicador debe mostrar explícitamente su universo y cobertura. Por ejemplo, los resultados de EPH para aglomerados urbanos no deben presentarse como si describieran automáticamente a toda la población nacional.

### 2.4 Comercio exterior
- Exportaciones e importaciones.
- Evolución temporal y composición.
- Desagregaciones por rubro, producto o país solo cuando estén disponibles en el servicio.
- Unidades, moneda, período y condición de dato preliminar/provisorio según metadata.

### 2.5 Demografía
- Estimaciones y proyecciones de población.
- Desagregaciones por jurisdicción/departamento, sexo y edad cuando estén publicadas.
- Comparaciones territoriales solo entre unidades geográficas y períodos comparables.

### 2.6 Explorador de indicadores
Flujo:
1. Seleccionar tema.
2. Seleccionar indicador disponible.
3. Mostrar filtros válidos para ese servicio (período, jurisdicción, categoría u otros).
4. Consultar y visualizar resultados.
5. Consultar definiciones, unidad, cobertura, frecuencia y notas metodológicas.
6. Descargar los resultados filtrados en CSV.

Los filtros deben generarse desde el catálogo de capacidades del indicador; no mostrar controles que el endpoint no soporte.

## 3. Reglas de presentación estadística

Cada visualización o tabla debe incluir:
- Nombre oficial del indicador.
- Valor y unidad.
- Período de referencia.
- Cobertura geográfica y universo.
- Frecuencia, cuando corresponda.
- Fecha de consulta/actualización.
- Fuente: INDEC y nombre del servicio.
- Enlace a la ficha/documentación oficial cuando esté disponible.
- Notas de estado del dato: provisorio, estimado, preliminar, confidencial u otra marca publicada.

No completar faltantes con cero. No interpolar, anualizar ni calcular variaciones si la metodología o la periodicidad no lo justifican. No comparar series con cambios de base, cobertura o metodología sin advertencia visible. Diferenciar dato observado, estimado y calculado por Radar.

## 4. Arquitectura propuesta

### Frontend
- Mantener TanStack Start, React, TypeScript y Tailwind existentes.
- Mantener Recharts para series y comparaciones.
- Reutilizar el shell y la paleta del espacio Proyectos.
- Consultas desde el cliente a endpoints propios de Radar, nunca directamente a INDEC con credenciales.
- TanStack Query para estados de carga, error y caché del cliente.

### Backend / capa de integración
Implementar un módulo servidor dedicado a INDEC:
- Leer el token desde una variable de entorno privada (por ejemplo `INDEC_API_TOKEN`).
- Centralizar URL base, autenticación y manejo de errores.
- Exponer únicamente operaciones permitidas por el catálogo interno de indicadores.
- Validar y limitar parámetros antes de consultar la API.
- Gestionar paginación y límites de filas.
- Normalizar respuestas a un contrato interno estable.
- Aplicar caché del lado servidor con TTL por indicador/frecuencia.
- Registrar errores operativos sin guardar tokens ni datos innecesarios.
- Permitir invalidación/actualización controlada de caché.

La plataforma de despliegue actual debe verificarse antes de elegir el mecanismo concreto de caché persistente. No asumir que una variable en memoria será compartida entre instancias serverless.

### Modelo de datos normalizado

Contrato conceptual mínimo:

```ts
type IndicatorMetadata = {
  id: string;
  title: string;
  topic: "economia" | "sociedad" | "comercio-exterior" | "demografia";
  sourceService: string;
  unit: string;
  frequency?: string;
  geographicCoverage?: string;
  universe?: string;
  methodologyUrl?: string;
  availableFilters: string[];
};

type Observation = {
  period: string;
  value: number | null;
  geography?: string;
  category?: string;
  status?: string;
};

type IndicatorResult = {
  indicator: IndicatorMetadata;
  observations: Observation[];
  fetchedAt: string;
  source: "INDEC";
  notes: string[];
};
```

El contrato definitivo debe adaptarse a los esquemas reales de cada endpoint. No forzar dimensiones inexistentes en todos los indicadores.

## 5. Seguridad y operación

- El JWT/API token nunca se expone en HTML, JavaScript cliente, repositorio ni logs.
- Configurar el secreto en el entorno de despliegue.
- No incluir credenciales en archivos `.env` versionados.
- Restringir los endpoints propios a los indicadores y filtros permitidos.
- Validar tipos, rangos, ordenamiento y límites de paginación.
- Manejar 401/403, 400, 206, 429/limitaciones y errores 5xx sin filtrar detalles internos.
- Definir timeouts y evitar reintentos agresivos.
- Mantener la atribución a INDEC visible.
- Respetar términos de uso y secreto estadístico.

## 6. Rutas y estructura sugeridas

Ruta pública del proyecto: `/observatorio/radar-estadistico-argentina`.

Estructura conceptual:
- `src/routes/observatorio.radar-estadistico-argentina.tsx`: página del proyecto.
- `src/features/radar/`: componentes, catálogo, tipos y lógica de presentación.
- `src/features/radar/server/`: adaptador INDEC, validación, normalización y caché exclusivamente servidor.
- `src/features/radar/catalog/`: registro de indicadores, servicios y capacidades verificadas.

La ruta debe quedar integrada al shell existente de Proyectos y enlazada desde el catálogo de proyectos. La ruta dinámica existente de Infraestructura Cloacal no debe alterarse.

## 7. Etapas de implementación

### Etapa 0 — relevamiento técnico de API
- Registrar todos los servicios INDEC pertinentes.
- Identificar endpoint, parámetros, dimensiones, unidad, frecuencia, cobertura y estados.
- Probar autenticación y respuestas reales.
- Guardar ejemplos anonimizados/no sensibles y definir el mapeo a los tipos internos.
- Resultado: matriz de indicadores validada.

### Etapa 1 — experiencia de usuario
- Crear página Radar dentro de Proyectos.
- Construir navegación temática, tarjetas, estados vacíos y explorador.
- Usar solo datos reales validados o estados explícitos “pendiente de conexión”.
- Verificar responsive y accesibilidad.

### Etapa 2 — integración segura
- Configurar secreto en hosting.
- Construir adaptador servidor y endpoints propios.
- Integrar primero un conjunto pequeño de indicadores representativos.
- Validar caché, paginación, errores y atribución.

### Etapa 3 — expansión integral
- Incorporar el resto de servicios validados.
- Completar filtros, comparaciones y exportación CSV.
- Añadir demografía y comercio exterior de acuerdo con disponibilidad efectiva.

### Etapa 4 — calidad y publicación
- Pruebas unitarias del adaptador y normalizadores.
- Pruebas de integración con respuestas reales.
- Pruebas de build, lint y navegación.
- Verificación de que no haya token en bundles cliente.
- Revisión de accesibilidad, responsive, metadata y fuentes.

## 8. Criterios de aceptación

1. Radar aparece dentro de Proyectos y mantiene el diseño institucional del laboratorio.
2. Los cinco módulos están disponibles y son navegables.
3. Ningún valor ilustrativo se presenta como estadística oficial.
4. Cada dato visible tiene período, unidad, cobertura y fuente identificables.
5. El token solo existe en el entorno servidor.
6. Los filtros se ajustan a las capacidades reales de cada servicio.
7. La paginación no pierde ni duplica observaciones.
8. Los estados de error y falta de datos son comprensibles.
9. La descarga respeta los filtros aplicados y conserva metadata de fuente.
10. La integración no modifica ni rompe los proyectos existentes.

## 9. Decisiones pendientes antes de conectar producción

- Confirmar el entorno de despliegue y su soporte para secretos y caché servidor.
- Obtener/configurar el token INDEC en ese entorno.
- Completar la matriz de endpoints y parámetros a partir de la documentación vigente.
- Definir el intervalo de actualización por indicador según su frecuencia y calendario de difusión.

## 10. Fuentes oficiales

- Catálogo: https://api.indec.gob.ar/
- Documentación: https://api.indec.gob.ar/docs
- Preguntas frecuentes: https://api.indec.gob.ar/ayuda/faq
- Términos de uso: https://api.indec.gob.ar/ayuda/terminos
