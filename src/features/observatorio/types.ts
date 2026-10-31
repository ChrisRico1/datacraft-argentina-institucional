export type ProjectStatus = "Activo" | "En desarrollo" | "Próximamente";
export type BasinSector = "Alta" | "Media" | "Baja";
export type Service = "Cloacal" | "Agua potable";
export interface Source {
  id: string;
  name: string;
  url: string;
  publishedAt?: string;
  frequency?: string;
  scope: string;
}
export interface Observatory {
  slug: string;
  title: string;
  category: string;
  zone: string;
  description: string;
  status: ProjectStatus;
  sourceIds: string[];
}
export interface Work {
  id: string;
  municipality: string;
  jurisdiction: "PBA" | "CABA";
  sector: BasinSector | null;
  name: string;
  service: Service;
  infrastructure: string;
  status: string | null;
  progress: number | null;
  beneficiaries: number | null;
  cutoff: string;
  sourceId: string;
  territorialScope: "Cuenca" | "Partido completo";
}
export interface Metric {
  id: string;
  label: string;
  value: number | null;
  unit: string;
  year: string;
  scope: string;
  sourceId: string;
}
export interface Filters {
  query: string;
  municipality: string;
  sector: string;
  infrastructure: string;
}
export interface MunicipalReference {
  name: string;
  jurisdiction: "PBA" | "CABA";
  lat: number;
  lng: number;
}