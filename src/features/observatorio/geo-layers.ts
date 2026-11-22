export const acumarSubbasinsWms = {
  endpoint: "https://wms.ign.gob.ar/geoserver/ign_riesgo/ows",
  layer: "ign_riesgo:anticipando_crecida_subcuenca_acumar",
  attribution: "IGN y ACUMAR · Proyecto Anticipando la Crecida",
  label: "Subcuencas ACUMAR (IGN)",
  brandColor: "#0B369A",
  fillOpacity: 0.24,
  strokeWidth: 2.2,
} as const;

export const acumarSubbasinsWfs = {
  url: "https://wms.ign.gob.ar/geoserver/ign_riesgo/ows?service=WFS&version=1.1.0&request=GetFeature&typeName=ign_riesgo%3Aanticipando_crecida_subcuenca_acumar&outputFormat=application%2Fjson",
  style: {
    color: acumarSubbasinsWms.brandColor,
    weight: acumarSubbasinsWms.strokeWidth,
    opacity: 0.96,
    fillColor: acumarSubbasinsWms.brandColor,
    fillOpacity: acumarSubbasinsWms.fillOpacity,
  },
} as const;
