import { useEffect, useRef, useState } from "react";
import type { Map as LeafletMap, LayerGroup } from "leaflet";
import { municipalReferences } from "./catalog";
import { acumarSubbasinsWms } from "./geo-layers";
import { Button } from "@/components/ui/button";
import { LocateFixed } from "lucide-react";

export default function ReferenceMap({ municipality }: { municipality: string }) {
  const container = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const layers = useRef<LayerGroup | null>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [tileFailed, setTileFailed] = useState(false);
  const [subbasinsFailed, setSubbasinsFailed] = useState(false);
  useEffect(() => {
    let cancelled = false;
    void import("leaflet")
      .then((L) => {
        if (cancelled || !container.current) return;
        const map = L.map(container.current, { scrollWheelZoom: false }).setView(
          [-34.81, -58.65],
          10,
        );
        mapRef.current = map;
        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a>',
          maxZoom: 18,
        })
          .on("tileerror", () => {
            if (!cancelled) setTileFailed(true);
          })
          .addTo(map);
        layers.current = L.layerGroup().addTo(map);
        let subbasinTileErrors = 0;
        let subbasinTileLoads = 0;
        const subbasins = L.tileLayer.wms(acumarSubbasinsWms.endpoint, {
          layers: acumarSubbasinsWms.layer,
          format: "image/png",
          transparent: true,
          version: "1.1.1",
          opacity: 0.92,
          SLD_BODY: acumarSubbasinsWms.sldBody,
          attribution: acumarSubbasinsWms.attribution,
        });
        // Evaluate availability per tile-loading batch, not on the first failed tile.
        // Public WMS services can return intermittent errors while other tiles load correctly.
        subbasins.on("loading", () => {
          subbasinTileErrors = 0;
          subbasinTileLoads = 0;
          if (!cancelled) setSubbasinsFailed(false);
        });
        subbasins.on("tileload", () => {
          subbasinTileLoads += 1;
        });
        subbasins.on("tileerror", () => {
          subbasinTileErrors += 1;
        });
        subbasins.on("load", () => {
          if (cancelled) return;
          setSubbasinsFailed(subbasinTileErrors > 0 && subbasinTileLoads === 0);
        });
        subbasins.addTo(map);
        L.control.layers(
          null,
          { "Subcuencas ACUMAR · IGN": subbasins },
          { collapsed: false, position: "bottomleft" },
        ).addTo(map);
        const observer = new ResizeObserver(() => map.invalidateSize());
        observer.observe(container.current);
        map.on("unload", () => observer.disconnect());
        setReady(true);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      layers.current = null;
    };
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
        detail.textContent = `${ref.jurisdiction} · Centro urbano aproximado para orientación ${ref.jurisdiction === "CABA" ? "jurisdiccional" : "municipal"}. Pertenencia a la cuenca por verificar. La delimitación oficial y las ubicaciones de obras se consultan en Monitor PISA.`;
        popup.append(title, detail);
        L.marker([ref.lat, ref.lng], {
          icon: L.divIcon({
            className: "observatory-marker",
            html: `<span class="${ref.jurisdiction === "CABA" ? "reference-caba" : "reference-pba"}"></span>`,
            iconSize: [20, 20],
            iconAnchor: [10, 10],
          }),
          title: `${ref.name}: referencia aproximada`,
          alt: `${ref.name}: referencia aproximada`,
          keyboard: true,
        })
          .bindPopup(popup)
          .addTo(group);
      });
      const first = refs[0];
      if (refs.length === 1 && first) map.setView([first.lat, first.lng], 12);
      else if (refs.length > 0)
        map.fitBounds(L.latLngBounds(refs.map((ref) => [ref.lat, ref.lng])), { padding: [28, 28] });
    });
    return () => {
      cancelled = true;
    };
  }, [municipality, ready]);
  return (
    <div className="relative">
      <div
        ref={container}
        role="region"
        aria-label="Mapa de referencias urbanas y subcuencas ACUMAR del IGN"
        className="observatory-map h-[420px] w-full bg-ink-2 sm:h-[510px]"
      />
      {!ready && (
        <p
          role="status"
          className="absolute inset-0 grid place-items-center bg-ink-2 text-ink-muted"
        >
          {failed
            ? "La carga del mapa requiere un nuevo intento. Podés consultar la cartografía oficial en Monitor PISA."
            : "Cargando mapa de referencias…"}
        </p>
      )}
      {(subbasinsFailed || tileFailed) && (
        <div className="pointer-events-none absolute left-3 right-3 top-14 z-[1100] flex flex-col gap-2">
          {subbasinsFailed && (
            <p
              role="status"
              className="pointer-events-auto rounded-md bg-ink p-3 text-sm text-ink-foreground shadow-lg"
            >
              No se pudieron cargar las teselas de subcuencas del IGN en esta vista. Podés
              desactivar y volver a activar la capa desde el control para reintentar.
            </p>
          )}
          {tileFailed && (
            <p
              role="status"
              className="pointer-events-auto rounded-md bg-ink p-3 text-sm text-ink-foreground shadow-lg"
            >
              La carga del mapa base está interrumpida. Los puntos corresponden a centros urbanos
              aproximados; la cartografía oficial se consulta en Monitor PISA.
            </p>
          )}
        </div>
      )}
      <Button
        variant="labOutline"
        className="absolute right-3 top-3 z-[450]"
        onClick={() => mapRef.current?.setView([-34.81, -58.65], 10)}
        disabled={!ready}
      >
        <LocateFixed /> Vista general
      </Button>
    </div>
  );
}
