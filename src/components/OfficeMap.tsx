"use client";

import { useEffect, useRef, useState } from "react";
import { Layers, Map as MapIcon, Minus, Mountain, PersonStanding, Plus, Satellite } from "lucide-react";
import { contact } from "@/data/site";
import type { Map as LeafletMap, Marker, TileLayer } from "leaflet";

type MapMode = "streetview" | "roadmap" | "satellite" | "terrain" | "hybrid";

const MODES: { id: MapMode; label: string; icon: typeof MapIcon }[] = [
  { id: "streetview", label: "Street View", icon: PersonStanding },
  { id: "roadmap", label: "Map", icon: MapIcon },
  { id: "satellite", label: "Satellite", icon: Satellite },
  { id: "terrain", label: "Terrain", icon: Mountain },
  { id: "hybrid", label: "Hybrid", icon: Layers },
];

type Props = {
  className?: string;
  embedded?: boolean;
};

export default function OfficeMap({ className = "", embedded = false }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const baseLayerRef = useRef<TileLayer | null>(null);
  const labelLayerRef = useRef<TileLayer | null>(null);
  const markerRef = useRef<Marker | null>(null);

  const [mode, setMode] = useState<MapMode>("streetview");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      const L = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css");

      if (cancelled || !containerRef.current || mapRef.current) return;

      L.Icon.Default.mergeOptions({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const map = L.map(containerRef.current, {
        center: [contact.mapCenter.lat, contact.mapCenter.lng],
        zoom: 17,
        zoomControl: false,
        scrollWheelZoom: false,
      });

      const baseLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      markerRef.current = L.marker([contact.mapCenter.lat, contact.mapCenter.lng], {
        title: "TEAMBASED Tax Services",
      }).addTo(map);

      markerRef.current.bindPopup(
        `<strong>TEAMBASED Tax Services</strong><br>${contact.addressLine1}<br>${contact.addressLine2}`,
      );

      mapRef.current = map;
      baseLayerRef.current = baseLayer;
      setReady(true);
    }

    init();

    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        baseLayerRef.current = null;
        labelLayerRef.current = null;
        markerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!ready || !mapRef.current) return;
    if (mode === "streetview") return;

    let cancelled = false;
    const resizeFrame = requestAnimationFrame(() => mapRef.current?.invalidateSize());

    async function setLayer() {
      const L = (await import("leaflet")).default;
      if (cancelled || !mapRef.current || !baseLayerRef.current) return;

      const map = mapRef.current;
      const oldBase = baseLayerRef.current;

      if (labelLayerRef.current) {
        map.removeLayer(labelLayerRef.current);
        labelLayerRef.current = null;
      }

      map.removeLayer(oldBase);

      let nextBase: TileLayer;

      switch (mode) {
        case "satellite":
          nextBase = L.tileLayer(
            "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
            { attribution: "Tiles &copy; Esri", maxZoom: 19 },
          );
          break;
        case "terrain":
          nextBase = L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
            attribution:
              'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>, SRTM | Map style: &copy; OpenTopoMap',
            maxZoom: 17,
          });
          break;
        case "hybrid": {
          nextBase = L.tileLayer(
            "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
            { attribution: "Tiles &copy; Esri", maxZoom: 19 },
          );
          nextBase.addTo(map);
          labelLayerRef.current = L.tileLayer(
            "https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png",
            {
              attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
              subdomains: "abcd",
              maxZoom: 19,
              pane: "overlayPane",
            },
          );
          labelLayerRef.current.addTo(map);
          baseLayerRef.current = nextBase;
          return;
        }
        default:
          nextBase = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            maxZoom: 19,
          });
      }

      nextBase.addTo(map);
      baseLayerRef.current = nextBase;
    }

    setLayer();

    return () => {
      cancelled = true;
      cancelAnimationFrame(resizeFrame);
    };
  }, [mode, ready]);

  function handleZoom(delta: number) {
    const map = mapRef.current;
    if (!map) return;
    map.setZoom(Math.min(19, Math.max(1, map.getZoom() + delta)));
  }

  const directionsUrl = `https://www.openstreetmap.org/directions?to=${contact.mapCenter.lat}%2C${contact.mapCenter.lng}`;
  const streetViewUrl =
    `https://maps.google.com/maps?layer=c&cbll=${contact.mapCenter.lat},${contact.mapCenter.lng}` +
    `&cbp=13,90,0,0,0&source=embed&output=svembed`;

  const shellClass = embedded
    ? `overflow-hidden bg-surface ${className}`
    : `rounded-2xl border border-border overflow-hidden shadow-sm bg-surface ${className}`;

  return (
    <div className={shellClass}>
      <div className="flex flex-col gap-2 border-b border-border bg-surface-elevated p-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="-mx-1 flex max-w-full gap-1.5 overflow-x-auto px-1 pb-1 sm:mx-0 sm:pb-0">
          {MODES.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setMode(id)}
              className={`inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-medium transition-colors sm:min-h-9 sm:text-sm ${
                mode === id
                  ? "bg-navy text-white"
                  : "bg-surface border border-border text-foreground hover:border-gold hover:text-gold"
              }`}
              aria-pressed={mode === id}
            >
              <Icon className="h-3.5 w-3.5 shrink-0" />
              {label}
            </button>
          ))}
        </div>
        <div className={`items-center gap-1.5 self-end sm:self-auto ${mode === "streetview" ? "hidden" : "flex"}`}>
          <button
            type="button"
            onClick={() => handleZoom(-1)}
            className="inline-flex items-center justify-center rounded-lg border border-border bg-surface w-9 h-9 hover:border-gold hover:text-gold transition-colors"
            aria-label="Zoom out"
          >
            <Minus className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => handleZoom(1)}
            className="inline-flex items-center justify-center rounded-lg border border-border bg-surface w-9 h-9 hover:border-gold hover:text-gold transition-colors"
            aria-label="Zoom in"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="relative">
        {!ready && mode !== "streetview" && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-100 text-sm text-muted z-10 min-h-[220px] sm:min-h-[320px]">
            Loading map…
          </div>
        )}
        <iframe
          src={streetViewUrl}
          title="Street View of TEAMBASED Tax Services"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
          className={`w-full min-h-[220px] sm:min-h-[320px] md:min-h-[360px] border-0 ${
            mode === "streetview" ? "block" : "hidden"
          }`}
        />
        <div
          ref={containerRef}
          className={`w-full min-h-[220px] sm:min-h-[320px] md:min-h-[360px] z-0 ${
            mode === "streetview" ? "hidden" : "block"
          }`}
          role="region"
          aria-label="Interactive office location map"
        />
      </div>

      {!embedded && (
        <div className="px-3 py-2 bg-surface-elevated border-t border-border flex flex-wrap items-center justify-between gap-2 text-xs text-muted">
          <span>
            {mode === "streetview"
              ? "Drag to look around · Use arrows to explore the street"
              : "Drag to pan · Pinch or use +/- to zoom · Powered by OpenStreetMap"}
          </span>
          <a href={directionsUrl} target="_blank" rel="noopener noreferrer" className="text-gold font-medium hover:underline shrink-0">
            Get Directions →
          </a>
        </div>
      )}
    </div>
  );
}
