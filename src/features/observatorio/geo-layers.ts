export const acumarSubbasinsWms = {
  endpoint: "https://wms.ign.gob.ar/geoserver/ign_riesgo/ows",
  layer: "ign_riesgo:anticipando_crecida_subcuenca_acumar",
  attribution: "IGN y ACUMAR · Proyecto Anticipando la Crecida",
  label: "Subcuencas ACUMAR (IGN)",
  brandColor: "#0B369A",
  fillOpacity: 0.24,
  strokeWidth: 2.2,
  sldBody: `<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor version="1.0.0" xmlns="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.opengis.net/sld http://schemas.opengis.net/sld/1.0.0/StyledLayerDescriptor.xsd">
  <NamedLayer>
    <Name>ign_riesgo:anticipando_crecida_subcuenca_acumar</Name>
    <UserStyle>
      <Title>Datacraft · Subcuencas ACUMAR azul institucional</Title>
      <FeatureTypeStyle>
        <Rule>
          <PolygonSymbolizer>
            <Fill>
              <CssParameter name="fill">#0B369A</CssParameter>
              <CssParameter name="fill-opacity">0.24</CssParameter>
            </Fill>
            <Stroke>
              <CssParameter name="stroke">#0B369A</CssParameter>
              <CssParameter name="stroke-width">2.2</CssParameter>
              <CssParameter name="stroke-opacity">0.96</CssParameter>
            </Stroke>
          </PolygonSymbolizer>
        </Rule>
      </FeatureTypeStyle>
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>`,
} as const;
