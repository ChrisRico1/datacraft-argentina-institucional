#!/usr/bin/env python3
"""Probe the IGN ACUMAR subbasins WMS GetMap endpoint and save image evidence."""
from __future__ import annotations

import json
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

ENDPOINT = "https://wms.ign.gob.ar/geoserver/ign_riesgo/ows"
LAYER = "ign_riesgo:anticipando_crecida_subcuenca_acumar"
AGENT = "DatacraftArgentina-WMS-GetMap-Diagnostic/1.0"
# Extent declared by IGN metadata for the subbasins layer, EPSG:4326.
BBOX = "-59.050910,-35.123364,-58.340652,-34.612637"
SLD_BODY = """<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor version="1.0.0"
 xmlns="http://www.opengis.net/sld"
 xmlns:ogc="http://www.opengis.net/ogc"
 xmlns:xlink="http://www.w3.org/1999/xlink"
 xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
 xsi:schemaLocation="http://www.opengis.net/sld http://schemas.opengis.net/sld/1.0.0/StyledLayerDescriptor.xsd">
 <NamedLayer><Name>ign_riesgo:anticipando_crecida_subcuenca_acumar</Name>
  <UserStyle><Title>Datacraft institutional blue</Title><FeatureTypeStyle><Rule>
   <PolygonSymbolizer>
    <Fill><CssParameter name="fill">#0B369A</CssParameter><CssParameter name="fill-opacity">0.24</CssParameter></Fill>
    <Stroke><CssParameter name="stroke">#0B369A</CssParameter><CssParameter name="stroke-width">2.2</CssParameter><CssParameter name="stroke-opacity">0.96</CssParameter></Stroke>
   </PolygonSymbolizer>
  </Rule></FeatureTypeStyle></UserStyle>
 </NamedLayer>
</StyledLayerDescriptor>"""


def request_map(name: str, extra: dict[str, str], output: Path) -> dict:
    params = {
        "SERVICE": "WMS",
        "VERSION": "1.1.1",
        "REQUEST": "GetMap",
        "LAYERS": LAYER,
        "STYLES": "",
        "FORMAT": "image/png",
        "TRANSPARENT": "TRUE",
        "SRS": "EPSG:4326",
        "BBOX": BBOX,
        "WIDTH": "1200",
        "HEIGHT": "860",
    }
    params.update(extra)
    url = ENDPOINT + "?" + urllib.parse.urlencode(params)
    request = urllib.request.Request(url, headers={
        "User-Agent": AGENT,
        "Accept": "image/png,application/xml,text/xml,*/*",
    })
    result = {"name": name, "request_url": url.split("SLD_BODY=")[0] + ("SLD_BODY=[omitted]" if "SLD_BODY" in params else ""),
              "status": "failed"}
    try:
        with urllib.request.urlopen(request, timeout=60) as response:
            body = response.read(20_000_000)
            content_type = response.headers.get("Content-Type", "")
            result.update(http_status=response.status, content_type=content_type,
                          response_bytes=len(body), final_url=response.geturl().split("SLD_BODY=")[0])
        if body.startswith(b"\x89PNG\r\n\x1a\n"):
            output.write_bytes(body)
            result.update(status="success", image_file=str(output), png_signature_valid=True)
        else:
            result.update(status="non_image_response",
                          body_preview=body[:2500].decode("utf-8", "replace"))
    except urllib.error.HTTPError as error:
        body = error.read(5000)
        result.update(http_status=error.code, content_type=error.headers.get("Content-Type", ""),
                      body_preview=body.decode("utf-8", "replace"))
    except Exception as error:
        result.update(error_type=type(error).__name__, error=str(error))
    return result


def main() -> None:
    out = Path("artifacts/infraestructura-cloacal-wms-getmap")
    out.mkdir(parents=True, exist_ok=True)
    checks = [
        request_map("getmap_default_style", {}, out / "getmap-default-style.png"),
        request_map("getmap_datacraft_sld", {"SLD_BODY": SLD_BODY}, out / "getmap-datacraft-sld.png"),
    ]
    report = {
        "generated_at_utc": datetime.now(timezone.utc).isoformat(),
        "endpoint": ENDPOINT,
        "layer": LAYER,
        "protocol": "WMS 1.1.1 GetMap",
        "crs_parameter": "SRS=EPSG:4326",
        "bbox": BBOX,
        "dimensions": "1200x860",
        "checks": checks,
        "interpretation": {
            "both_success": "El endpoint GetMap responde con y sin SLD; investigar el navegador, parámetros de Leaflet o política de red/CORS.",
            "default_success_sld_failure": "La capa responde sin estilo, pero falla el SLD_BODY; corregir el estilo o su codificación.",
            "both_failure": "El endpoint, la capa, la extensión o el servicio GetMap fallan desde el runner; revisar el cuerpo de error y repetir en otra ventana temporal.",
        },
    }
    (out / "getmap-report.json").write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps(report, ensure_ascii=False, indent=2))
    if not any(item["status"] == "success" for item in checks):
        raise SystemExit("Ninguna solicitud GetMap devolvió una imagen PNG válida.")


if __name__ == "__main__":
    main()
