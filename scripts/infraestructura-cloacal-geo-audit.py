#!/usr/bin/env python3
"""Download and audit public cartography candidates for Infraestructura Cloacal."""
from __future__ import annotations
import argparse, hashlib, json, sys, urllib.parse, urllib.request, zipfile
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path
from xml.etree import ElementTree

IGN_WFS = "https://wms.ign.gob.ar/geoserver/ign_riesgo/ows"
IGN_METADATA = "https://www.ign.gob.ar/capas-sig/metadata/anticipando_crecida_subcuenca_acumar.pdf"
PBA_RADIOS = ("https://catalogo.datos.gba.gob.ar/dataset/33b080d2-e369-4076-acd4-511db0e9bffb/resource/151d80d2-87c1-4981-9bea-9aab38a82ec9/download/radios-censales-2022-geojson.zip")
AGENT = "DatacraftArgentina-InfraestructuraCloacalGeoAudit/1.0"

def fetch(url, timeout=90):
    request = urllib.request.Request(url, headers={"User-Agent": AGENT, "Accept": "*/*"})
    with urllib.request.urlopen(request, timeout=timeout) as response:
        if response.status != 200:
            raise RuntimeError(f"HTTP {response.status}: {url}")
        return response.read()

def save_download(url, destination):
    content = fetch(url)
    destination.parent.mkdir(parents=True, exist_ok=True)
    destination.write_bytes(content)
    return {"url": url, "file": str(destination), "bytes": len(content),
            "sha256": hashlib.sha256(content).hexdigest()}

def extract_geojson(zip_path, extract_dir):
    with zipfile.ZipFile(zip_path) as archive:
        candidates = [item for item in archive.infolist()
                      if not item.is_dir() and item.filename.lower().endswith((".geojson", ".json"))]
        if not candidates:
            raise RuntimeError("El ZIP no contiene archivos GeoJSON/JSON.")
        selected = max(candidates, key=lambda item: item.file_size)
        if selected.file_size > 2_000_000_000:
            raise RuntimeError("El GeoJSON supera el límite de seguridad de 2 GB.")
        extract_dir.mkdir(parents=True, exist_ok=True)
        target = extract_dir / Path(selected.filename).name
        target.write_bytes(archive.read(selected))
        return target

def inspect_geojson(path, metadata_crs):
    from shapely.geometry import shape
    with path.open("r", encoding="utf-8-sig") as stream:
        collection = json.load(stream)
    if collection.get("type") != "FeatureCollection":
        raise RuntimeError("La respuesta no es un GeoJSON FeatureCollection.")
    features = collection.get("features")
    if not isinstance(features, list) or not features:
        raise RuntimeError("La colección no contiene entidades.")
    geometry_types, bounds = Counter(), []
    empty, invalid, valid = 0, 0, 0
    for index, feature in enumerate(features):
        geometry = feature.get("geometry")
        if not geometry:
            empty += 1
            continue
        geometry_types[geometry.get("type", "unknown")] += 1
        try:
            parsed = shape(geometry)
            if parsed.is_empty:
                empty += 1
            elif parsed.is_valid:
                valid += 1
            else:
                invalid += 1
            if not parsed.is_empty:
                bounds.append(parsed.bounds)
        except Exception as error:
            invalid += 1
            if invalid <= 5:
                print(f"Geometría no interpretable en feature {index}: {error}", file=sys.stderr)
    bbox = ([min(b[0] for b in bounds), min(b[1] for b in bounds),
             max(b[2] for b in bounds), max(b[3] for b in bounds)] if bounds else None)
    keys = sorted({key for feature in features for key in (feature.get("properties") or {})})
    return {"file": str(path), "feature_count": len(features),
            "geometry_types": dict(geometry_types), "property_keys": keys,
            "geojson_crs_member": collection.get("crs"),
            "metadata_crs": metadata_crs, "bbox": bbox,
            "empty_geometries": empty, "valid_geometries": valid,
            "invalid_geometries": invalid, "topology_pass": empty == 0 and invalid == 0}

def discover_ign_type():
    url = IGN_WFS + "?" + urllib.parse.urlencode(
        {"service":"WFS","version":"1.1.0","request":"GetCapabilities"})
    root = ElementTree.fromstring(fetch(url))
    candidates = []
    for element in root.iter():
        if element.tag.split("}")[-1] == "FeatureType":
            name = next((child.text for child in element
                         if child.tag.split("}")[-1] == "Name"), None)
            if name and "subcuenca" in name.lower() and "acumar" in name.lower():
                candidates.append(name)
    return candidates, url

def audit_ign(output_dir):
    result = {"catalog":"https://www.ign.gob.ar/NuestrasActividades/InformacionGeoespacial/CapasSIG",
              "metadata_pdf":IGN_METADATA, "metadata_crs":"EPSG:4326",
              "metadata_geometry":"Polygon", "metadata_fields":["Nam","fuente"],
              "attribution":"IGN y ACUMAR"}
    try:
        candidates, capabilities_url = discover_ign_type()
        result["wfs_capabilities_url"] = capabilities_url
        result["candidate_feature_types"] = candidates
        if len(candidates) != 1:
            result.update(status="not_downloaded",
                          reason="El WFS 1.1.0 oficial del IGN no expone un único feature type Subcuencas ACUMAR identificable; no se inventó un endpoint.")
            return result
        params = urllib.parse.urlencode({"service":"WFS","version":"1.1.0",
            "request":"GetFeature","typeName":candidates[0],"outputFormat":"application/json"})
        url = IGN_WFS + "?" + params
        target = output_dir / "sources" / "ign-subcuencas-acumar.geojson"
        download = save_download(url, target)
        result.update(status="downloaded", download=download,
                      audit=inspect_geojson(target,"EPSG:4326 (declarado en metadatos IGN)"))
    except Exception as error:
        result.update(status="failed", error=str(error))
    return result

def audit_pba(output_dir):
    result = {"source":"Datos Abiertos de la Provincia de Buenos Aires",
              "attribution":"INDEC (Censo 2022) y Datos Abiertos PBA",
              "metadata_crs":"EPSG:4326",
              "license_note":"El catálogo declara CC BY 4.0 para el conjunto; confirmar que cubre el recurso individual antes de redistribuir."}
    try:
        archive = output_dir / "sources" / "pba-radios-censales-2022-geojson.zip"
        download = save_download(PBA_RADIOS, archive)
        geojson = extract_geojson(archive, output_dir / "extracted" / "pba-radios")
        result.update(status="downloaded", download=download,
                      audit=inspect_geojson(geojson,"EPSG:4326 (declarado en ficha PBA)"))
    except Exception as error:
        result.update(status="failed", error=str(error))
    return result

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output-dir", default="artifacts/infraestructura-cloacal-geo-audit")
    output = Path(parser.parse_args().output_dir)
    output.mkdir(parents=True, exist_ok=True)
    report = {"generated_at":datetime.now(timezone.utc).isoformat(),
      "scope":"Auditoría técnica de fuentes candidatas; no certifica equivalencia normativa.",
      "sources":{"ign_subbasins_acumar":audit_ign(output),"pba_census_2022_radios":audit_pba(output)},
      "methodological_guards":[
        "No equiparar subcuencas de un proyecto con el límite hidrográfico aprobado.",
        "No mezclar límite hidrográfico y límite jurisdiccional.",
        "No asignar radios por centroide ni prorratear indicadores municipales.",
        "No integrar geometrías en la aplicación desde este proceso.",
        "No usar capas con licencia no especificada ni radios CABA con restricciones comerciales.",
        "Conservar códigos geoestadísticos como texto."]}
    (output / "audit-report.json").write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding="utf-8")
    print(json.dumps(report,ensure_ascii=False,indent=2))
    failed=[name for name,source in report["sources"].items() if source.get("status")=="failed"]
    if failed:
        print("Fuentes con error: "+", ".join(failed),file=sys.stderr)
        return 1
    unresolved=[name for name,source in report["sources"].items() if source.get("status")=="not_downloaded"]
    if unresolved:
        print("Fuente sin endpoint vectorial resuelto: "+", ".join(unresolved),file=sys.stderr)
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
