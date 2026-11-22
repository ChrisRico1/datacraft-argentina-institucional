#!/usr/bin/env python3
"""Discover public GIS download and map-service endpoints without guessing layer URLs."""
from __future__ import annotations
import json
import re
import urllib.error
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from html.parser import HTMLParser
from pathlib import Path

AGENT = "DatacraftArgentina-InfraestructuraCloacalDiscovery/1.0"
SITES = {
    "ign_catalog": "https://www.ign.gob.ar/NuestrasActividades/InformacionGeoespacial/CapasSIG",
    "acumar_legacy_maps": "https://mapas.acumar.gob.ar/mapa",
    "acumar_monitor_pisa": "https://monitorpisa.acumar.gob.ar/mapa/",
}
ENDPOINT_RE = re.compile(
    r"""(?i)(?:https?://[^\s"'<>]+|/(?:[^"'<> ]*/)?(?:geoserver|wms|wfs|ows|mapserver|api|download|descarga)[^"'<> ]*)"""
)
KEYWORD_RE = re.compile(r"(?i)subcuenc|acumar|hidrogr|geoserver|wms|wfs|ows|download|descarga|geojson|shapefile|\\.shp")

class PageParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.scripts = []
        self.inline = []
        self._script = False
        self._buffer = []
    def handle_starttag(self, tag, attrs):
        if tag.lower() == "script":
            src = dict(attrs).get("src")
            if src:
                self.scripts.append(src)
            self._script = True
            self._buffer = []
    def handle_data(self, data):
        if self._script:
            self._buffer.append(data)
    def handle_endtag(self, tag):
        if tag.lower() == "script" and self._script:
            text = "".join(self._buffer)
            if text.strip():
                self.inline.append(text)
            self._script = False
            self._buffer = []

def get(url, timeout=35):
    req = urllib.request.Request(url, headers={"User-Agent": AGENT, "Accept": "*/*"})
    with urllib.request.urlopen(req, timeout=timeout) as response:
        data = response.read(8_000_000)
        return {
            "status": response.status,
            "final_url": response.geturl(),
            "content_type": response.headers.get("Content-Type", ""),
            "body": data,
        }

def local_url(base, value):
    return urllib.parse.urljoin(base, value)

def endpoint_base(candidate):
    candidate = candidate.strip().rstrip(");,]")
    candidate = candidate.replace("\\/", "/")
    parsed = urllib.parse.urlsplit(candidate)
    if not parsed.scheme:
        return None
    if parsed.scheme not in ("http", "https"):
        return None
    if parsed.query:
        # Retain the service path but discard operation-specific query parameters.
        candidate = urllib.parse.urlunsplit((parsed.scheme, parsed.netloc, parsed.path, "", ""))
    return candidate

def inspect_capabilities(endpoint, service):
    params = urllib.parse.urlencode({"service": service, "request": "GetCapabilities",
                                     "version": "1.3.0" if service == "WMS" else "1.1.0"})
    url = endpoint + ("&" if "?" in endpoint else "?") + params
    try:
        response = get(url, timeout=25)
        root = ET.fromstring(response["body"])
        layers = []
        for node in root.iter():
            if node.tag.split("}")[-1] in ("Layer", "FeatureType"):
                values = {}
                for child in node:
                    key = child.tag.split("}")[-1]
                    if key in ("Name", "Title"):
                        values[key.lower()] = child.text
                if values:
                    label = " ".join(str(v or "") for v in values.values())
                    if KEYWORD_RE.search(label):
                        layers.append(values)
        return {"status": "ok", "url": url, "layers_matching_terms": layers[:100],
                "layer_count_matching_terms": len(layers)}
    except Exception as exc:
        return {"status": "failed", "url": url, "error": f"{type(exc).__name__}: {exc}"}

def main():
    report = {"scope": "Exploración técnica de páginas y scripts públicos; no descarga ni integra geometrías.",
              "sites": {}, "service_probes": []}
    candidates = set()
    for name, url in SITES.items():
        entry = {"url": url, "scripts_found": [], "script_fetches": [], "keyword_matches": []}
        try:
            page = get(url)
            html = page["body"].decode("utf-8", "replace")
            entry.update(status="fetched", http_status=page["status"],
                         final_url=page["final_url"], content_type=page["content_type"])
            parser = PageParser()
            parser.feed(html)
            sources = [local_url(page["final_url"], src) for src in parser.scripts]
            entry["scripts_found"] = sources[:60]
            texts = [("inline", text) for text in parser.inline]
            for src in sources[:40]:
                try:
                    result = get(src, timeout=20)
                    body = result["body"].decode("utf-8", "replace")
                    texts.append((src, body))
                    entry["script_fetches"].append({"url": src, "status": result["status"],
                                                    "bytes": len(result["body"])})
                except Exception as exc:
                    entry["script_fetches"].append({"url": src, "error": f"{type(exc).__name__}: {exc}"})
            # HTML can contain inline configuration outside script tags.
            texts.append(("page", html))
            for source, content in texts:
                for match in ENDPOINT_RE.findall(content):
                    absolute = endpoint_base(local_url(page["final_url"], match))
                    if absolute and any(term in absolute.lower() for term in
                                        ("geoserver", "wms", "wfs", "ows", "mapserver")):
                        candidates.add(absolute)
                for match in re.finditer(KEYWORD_RE, content):
                    start, end = max(0, match.start()-180), min(len(content), match.end()+260)
                    snippet = re.sub(r"\s+", " ", content[start:end])
                    if len(entry["keyword_matches"]) < 35:
                        entry["keyword_matches"].append({"source": source, "snippet": snippet})
        except Exception as exc:
            entry.update(status="failed", error=f"{type(exc).__name__}: {exc}")
        report["sites"][name] = entry

    # Probe only service URLs discovered in the pages/scripts; do not invent layer names.
    for endpoint in sorted(candidates)[:30]:
        report["service_probes"].append({
            "endpoint": endpoint,
            "wms": inspect_capabilities(endpoint, "WMS"),
            "wfs": inspect_capabilities(endpoint, "WFS"),
        })
    out = Path("artifacts/infraestructura-cloacal-service-discovery")
    out.mkdir(parents=True, exist_ok=True)
    (out / "discovery-report.json").write_text(json.dumps(report, ensure_ascii=False, indent=2),
                                                encoding="utf-8")
    print(json.dumps(report, ensure_ascii=False, indent=2))

if __name__ == "__main__":
    main()
