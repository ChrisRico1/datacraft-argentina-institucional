import type { MunicipalReference, Observatory, Source } from "./types";

export const sources: Source[] = [
  {
    id: "basin",
    name: "ACUMAR · Características de la Cuenca",
    url: "https://www.acumar.gob.ar/institucional/que-es-acumar/caracteristicas-de-la-cuenca2/",
    scope: "Delimitación y alcance territorial",
  },
  {
    id: "works-2025",
    name: "ACUMAR · Seguimiento de Obras de Agua y Cloaca 2024–2025",
    url: "https://datos.acumar.gob.ar/dataset/seguimiento-de-obras-de-agua-y-cloaca",
    publishedAt: "2025-12-12",
    frequency: "Anual",
    scope:
      "Publicación: 12/12/2025. Recursos del segundo semestre de 2024 y 2025; fecha de referencia individual en cada ficha.",
  },
  {
    id: "works-2023",
    name: "ACUMAR · Seguimiento de Obras 2018–2023",
    url: "https://datos.acumar.gob.ar/dataset/seguimiento-de-obras-de-agua-y-cloaca-2018-2023",
    scope: "Serie histórica 2018–2023; cada corte se analiza con su fecha de referencia",
  },
  {
    id: "pisa",
    name: "ACUMAR · Monitor PISA",
    url: "https://monitorpisa.acumar.gob.ar/",
    scope:
      "Visualizador oficial: límites de cuenca, cobertura de red, expansión y fichas de obras. Consultar la fecha de cada capa.",
  },
  {
    id: "indicators",
    name: "ACUMAR · Agua Potable y Saneamiento Cloacal",
    url: "https://monitorpisa.acumar.gob.ar/sistema-de-indicadores/agua-potable-y-saneamiento-cloacal/",
    scope: "Indicadores oficiales; agua y cloacas son servicios diferentes",
  },
  {
    id: "census",
    name: "INDEC · Censo 2022 · Desagüe a red pública",
    url: "https://censo.gob.ar/index.php/mapa_desague_red_publica2/",
    scope:
      "Referencia censal 2022: confirmar universo de viviendas/hogares y variable oficial de desagüe del inodoro a red pública",
  },
  {
    id: "geosiduv",
    name: "GeoSIDUV · Provincia de Buenos Aires",
    url: "https://geosiduv.gba.gob.ar/",
    scope: "Contexto geoespacial provincial; verificar escala, metadatos y vigencia",
  },
];
export const observatories: Observatory[] = [
  {
    slug: "infraestructura-cloacal",
    title: "Infraestructura cloacal",
    category: "Infraestructura y territorio",
    zone: "Cuenca Matanza-Riachuelo",
    description:
      "Una lectura trazable del saneamiento cloacal: cobertura, infraestructura y seguimiento de obras en la cuenca.",
    status: "Activo",
    sourceIds: sources.map((source) => source.id),
  },
];

// Approximate urban reference points, not basin membership or work locations.
export const municipalReferences: MunicipalReference[] = [
  { name: "Almirante Brown", jurisdiction: "PBA", lat: -34.8, lng: -58.389 },
  { name: "Avellaneda", jurisdiction: "PBA", lat: -34.663, lng: -58.365 },
  { name: "Cañuelas", jurisdiction: "PBA", lat: -35.051, lng: -58.76 },
  { name: "Esteban Echeverría", jurisdiction: "PBA", lat: -34.816, lng: -58.469 },
  { name: "Ezeiza", jurisdiction: "PBA", lat: -34.854, lng: -58.523 },
  { name: "General Las Heras", jurisdiction: "PBA", lat: -34.927, lng: -58.946 },
  { name: "La Matanza", jurisdiction: "PBA", lat: -34.679, lng: -58.56 },
  { name: "Lanús", jurisdiction: "PBA", lat: -34.707, lng: -58.391 },
  { name: "Lomas de Zamora", jurisdiction: "PBA", lat: -34.761, lng: -58.401 },
  { name: "Marcos Paz", jurisdiction: "PBA", lat: -34.781, lng: -58.837 },
  { name: "Merlo", jurisdiction: "PBA", lat: -34.666, lng: -58.728 },
  { name: "Morón", jurisdiction: "PBA", lat: -34.651, lng: -58.619 },
  { name: "Presidente Perón", jurisdiction: "PBA", lat: -34.917, lng: -58.381 },
  { name: "San Vicente", jurisdiction: "PBA", lat: -35.025, lng: -58.423 },
  { name: "CABA", jurisdiction: "CABA", lat: -34.604, lng: -58.382 },
];
export function getSource(id: string) {
  return sources.find((source) => source.id === id);
}
