import { useEffect, useRef, useState } from "react";
import type { Map as LeafletMap, LayerGroup } from "leaflet";
import { municipalReferences } from "./catalog";
import { Button } from "@/components/ui/button";
import { LocateFixed } from "lucide-react";

export default function ReferenceMap({ municipality }: { municipality: string }) {
  const container = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const layers = useRef<LayerGroup | null>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [tileFailed, setTileFailed] = useState(false);
  useEffect(() => {
    let cancelled = false;
    void import("leaflet").then((L) => {
      if (cancelled || !container.current) return;
      const map = L.map(container.current, { scrollWheelZoom: false }).setView([-34.81, -58.65], 10);
      mapRef.current = map;
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a>', maxZoom: 18,
      }).on("tileerror", () => { if (!cancelled) setTileFailed(true); }).addTo(map);
      layers.current = L.layerGroup().addTo(map);
      const observer = new ResizeObserver(() => map.invalidateSize());
      observer.observe(container.current);
      map.on("unload", () => observer.disconnect());
      setReady(true);
    }).catch(() => { if (!cancelled) setFailed(true); });
    return () => { cancelled = true; mapRef.current?.remove(); mapRef.current = null; layers.current = null; };
  }, []);
  useEffect(() => {
    if (!ready) return;
    let cancelled = false;
    void import("leaflet").then((L) => {
      const map = mapRef.current;
      const group = layers.current;
      if (cancelled || !map || !group) return;
      group.clearLayers();
      const refs = municipalReferences.filter((ref) => !municipality || ref.name === municipality);
      refs.forEach((ref) => {
        const popup = document.createElement("div");
        const title = document.createElement("strong");
        title.textContent = ref.name;
        const detail = document.createElement("p");
        detail.textContent = `${ref.jurisdiction} · Centro urbano aproximado. Referencia municipal, no obra ni límite de cuenca; puede estar fuera del polígono.`;
        popup.append(title, detail);
        L.marker([ref.lat, ref.lng], {
          icon: L.divIcon({ className: "observatory-marker", html: `<span class="${ref.jurisdiction === "CABA" ? "reference-caba" : "reference-pba"}"></span>`, iconSize: [20, 20], iconAnchor: [10, 10] }),
          title: `${ref.name}: referencia aproximada`, alt: `${ref.name}: referencia aproximada`, keyboard: true,
        }).bindPopup(popup).addTo(group);
      });
      if (refs.length === 1) map.setView([refs[0].lat, refs[0].lng], 12);
      else map.fitBounds(L.latLngBounds(refs.map((ref) => [ref.lat, ref.lng])), { padding: [28, 28] });
    });
    return () => { cancelled = true; };
  }, [municipality, ready]);
  return <div className="relative">
    <div ref={container} role="region" aria-label="Mapa navegable de referencias municipales aproximadas, sin delimitación de cuenca" className="observatory-map h-[420px] w-full bg-ink-2 sm:h-[510px]" />
    {!ready && <p role="status" className="absolute inset-0 grid place-items-center bg-ink-2 text-ink-muted">{failed ? "No pudimos cargar el mapa. Consultá Monitor PISA." : "Cargando mapa de referencias…"}</p>}
    {tileFailed && <p role="status" className="absolute bottom-8 left-3 right-3 z-[450] rounded-md bg-ink p-3 text-sm text-ink-foreground">El mapa base no está disponible. Las referencias siguen siendo aproximadas; consultá Monitor PISA.</p>}
    <Button variant="labOutline" className="absolute right-3 top-3 z-[450]" onClick={() => mapRef.current?.setView([-34.81, -58.65], 10)} disabled={!ready}><LocateFixed /> Vista general</Button>
  </div>;
}