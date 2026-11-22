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
    { field: "area_geografica_nom", label: "Aglomerado / área geográfica", placeholder: "Código o nombre del área EPH" },
  ],
  "mercado-laboral": [
    { field: "area_geografica_nom", label: "Aglomerado / área geográfica", placeholder: "Código o nombre del área EPH" },
  ],
  "cba-cbt": [
    { field: "region", label: "Región", placeholder: "Región publicada por INDEC" },
    { field: "clasificador", label: "Clasificador", placeholder: "Código o nombre del clasificador" },
    { field: "nivel", label: "Nivel estadístico", placeholder: "Nivel publicado por INDEC" },
    { field: "codigo", label: "Código de apertura", placeholder: "Código de la categoría" },
    { field: "indicador", label: "Indicador", placeholder: "Indicador publicado" },
  ],
  exportaciones: [
    { field: "rubro_cod", label: "Rubro", placeholder: "Código del rubro" },
    { field: "subrubro_cod", label: "Subrubro", placeholder: "Código del subrubro", dependsOn: "rubro_cod" },
    { field: "pais_cod", label: "País de destino", placeholder: "Código de país", dependsOn: "subrubro_cod" },
  ],
  importaciones: [
    { field: "uso_economico_cod", label: "Uso económico", placeholder: "Código de uso económico" },
    { field: "gce_cod", label: "Grandes categorías económicas", placeholder: "Código GCE", dependsOn: "uso_economico_cod" },
    { field: "pais_cod", label: "País de origen", placeholder: "Código de país", dependsOn: "gce_cod" },
  ],
  "poblacion-departamento": [
    { field: "jurisdiccion_nom", label: "Jurisdicción", placeholder: "Nombre de jurisdicción" },
    { field: "departamento_cod", label: "Departamento", placeholder: "Código de departamento" },
    { field: "sexo_cod", label: "Sexo", placeholder: "Código de sexo" },
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
    { field: "cuadro_web", label: "Cuadro", placeholder: "Código del cuadro" },
    { field: "codigo_ClaNAE_2010", label: "Actividad económica (ClaNAE 2010)", placeholder: "Código ClaNAE" },
    { field: "codigo_CPC_2_1", label: "Producto (CPC 2.1)", placeholder: "Código CPC" },
    { field: "serie", label: "Serie", placeholder: "Código de serie" },
    { field: "tipo_de_indicador", label: "Tipo de indicador", placeholder: "Tipo de indicador publicado" },
    { field: "unidad_de_medida", label: "Unidad de medida", placeholder: "Unidad publicada" },
  ],
};
