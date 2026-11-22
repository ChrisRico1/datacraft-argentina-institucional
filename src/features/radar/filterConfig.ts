export type RadarDimensionFilter = {
  field: string;
  label: string;
  placeholder: string;
  dependsOn?: string;
};

export const radarDimensionFilters: Record<string, RadarDimensionFilter[]> = {
  salarios: [
    { field: "clasificador", label: "Clasificador", placeholder: "Código o nombre del clasificador" },
    { field: "nivel", label: "Nivel estadístico", placeholder: "Nivel publicado por INDEC" },
    { field: "codigo", label: "Código de apertura", placeholder: "Código de la categoría" },
    { field: "indicador", label: "Indicador", placeholder: "Indicador publicado" },
  ],
  pobreza: [
    { field: "area_geografica_nom", label: "Aglomerado / área geográfica", placeholder: "Nombre publicado por INDEC" },
    { field: "area_geografica_cod", label: "Código de aglomerado EPH", placeholder: "Código numérico", dependsOn: "area_geografica_nom" },
  ],
  "mercado-laboral": [
    { field: "area_geografica_nom", label: "Aglomerado / área geográfica", placeholder: "Nombre publicado por INDEC" },
    { field: "area_geografica_cod", label: "Código de aglomerado EPH", placeholder: "Código numérico", dependsOn: "area_geografica_nom" },
  ],
  "cba-cbt": [
    { field: "region", label: "Región", placeholder: "Región publicada por INDEC" },
    { field: "clasificador", label: "Clasificador", placeholder: "Código o nombre del clasificador" },
    { field: "nivel", label: "Nivel estadístico", placeholder: "Nivel publicado por INDEC", dependsOn: "clasificador" },
    { field: "codigo", label: "Código de apertura", placeholder: "Código de la categoría", dependsOn: "nivel" },
    { field: "indicador", label: "Indicador", placeholder: "Indicador publicado" },
    { field: "tipo_de_indicador", label: "Tipo de indicador", placeholder: "Índice, variación o incidencia" },
  ],
  exportaciones: [
    { field: "rubro_cod", label: "Rubro", placeholder: "Código del rubro" },
    { field: "subrubro_cod", label: "Subrubro", placeholder: "Código del subrubro", dependsOn: "rubro_cod" },
    { field: "pais_cod", label: "País de destino", placeholder: "Código de país" },
  ],
  importaciones: [
    { field: "uso_economico_cod", label: "Uso económico", placeholder: "Código de uso económico" },
    { field: "gce_cod", label: "Grandes categorías económicas", placeholder: "Código GCE", dependsOn: "uso_economico_cod" },
    { field: "pais_cod", label: "País de origen", placeholder: "Código de país" },
  ],
  "poblacion-departamento": [
    { field: "jurisdiccion_nom", label: "Jurisdicción", placeholder: "Nombre de jurisdicción" },
    { field: "jurisdiccion_cod", label: "Código de jurisdicción", placeholder: "Código de dos posiciones" },
    { field: "departamento_cod", label: "Código de departamento", placeholder: "Código de cinco posiciones", dependsOn: "jurisdiccion_cod" },
    { field: "sexo_cod", label: "Sexo", placeholder: "Código de sexo" },
    { field: "rmba", label: "Región Metropolitana de Buenos Aires", placeholder: "Valor publicado por INDEC" },
  ],
  "poblacion-jurisdiccion": [
    { field: "jurisdiccion_nom", label: "Jurisdicción", placeholder: "Nombre de jurisdicción" },
    { field: "jurisdiccion_cod", label: "Código de jurisdicción", placeholder: "Código de jurisdicción" },
    { field: "sexo_cod", label: "Sexo", placeholder: "Código de sexo" },
    { field: "edad_cod", label: "Edad", placeholder: "Código o grupo de edad" },
  ],
  "poblacion-nacional": [
    { field: "edad", label: "Edad (años cumplidos)", placeholder: "Ej. 35" },
    { field: "sexo_cod", label: "Sexo (código INDEC)", placeholder: "1 = Mujer · 2 = Varón" },
  ],
  "ipi-manufacturero": [
    { field: "indicador", label: "Indicador", placeholder: "Nombre del indicador" },
    { field: "cuadro_web", label: "Cuadro", placeholder: "Código del cuadro" },
    { field: "codigo_CLaNAE_2004", label: "Actividad económica (ClaNAE 2004)", placeholder: "Código ClaNAE 2004" },
    { field: "serie", label: "Serie estadística", placeholder: "Original, desestacionalizada o tendencia-ciclo" },
    { field: "tipo_de_indicador", label: "Tipo de indicador", placeholder: "Índice o variación" },
    { field: "unidad_de_medida", label: "Unidad de medida", placeholder: "Unidad publicada" },
  ],
  "costo-construccion": [
    { field: "codigo_CPC_1", label: "Código de producto (CPC 1)", placeholder: "Código CPC" },
  ],
};
