"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useRef } from "react";
import type { MapPoint } from "@/lib/points";

function loadCss(href: string) {
  if (document.querySelector(`link[href="${href}"]`)) return;
  const l = document.createElement("link");
  l.rel = "stylesheet";
  l.href = href;
  document.head.appendChild(l);
}

function loadScript(src: string, ready: () => boolean): Promise<void> {
  return new Promise((resolve, reject) => {
    if (ready()) return resolve();
    const existing = document.querySelector(`script[src="${src}"]`) as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("erro: " + src)));
      return;
    }
    const s = document.createElement("script");
    s.src = src;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("erro: " + src));
    document.head.appendChild(s);
  });
}

export function TerritoryMap({ points }: { points: MapPoint[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      loadCss("https://unpkg.com/leaflet@1.9.4/dist/leaflet.css");
      try {
        await loadScript("https://unpkg.com/leaflet@1.9.4/dist/leaflet.js", () => !!(window as any).L);
        await loadScript("/apresentacao/assets/regioes-geo.js", () => !!(window as any).REGIOES_GEO);
      } catch {
        return; // offline: deixa o container vazio
      }
      if (cancelled || !ref.current) return;
      const L = (window as any).L;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      const map = L.map(ref.current, { zoomControl: true, scrollWheelZoom: true });
      mapRef.current = map;

      L.tileLayer(
        "https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png",
        {
          subdomains: "abc",
          maxZoom: 19,
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
        }
      ).addTo(map);

      const geo = (window as any).REGIOES_GEO;
      if (geo) {
        L.geoJSON(geo, {
          style: {
            color: "#C9A227",
            weight: 2,
            dashArray: "7 6",
            fillColor: "#C9A227",
            fillOpacity: 0.05,
            opacity: 0.6,
          },
          interactive: false,
        }).addTo(map);
      }

      const bounds = L.latLngBounds([]);
      points.forEach((p) => {
        const grad = p.mine
          ? "radial-gradient(circle at 30% 30%,#f0d27a,#bf9a23)"
          : "radial-gradient(circle at 30% 30%,#9a9a9a,#555)";
        const color = p.mine ? "#231a05" : "#fff";
        const icon = L.divIcon({
          className: "",
          html: `<span style="display:grid;place-items:center;width:24px;height:24px;border-radius:50%;border:2px solid rgba(0,0,0,.5);box-shadow:0 2px 6px rgba(0,0,0,.5);font-family:Anton,sans-serif;font-size:12px;background:${grad};color:${color}">$</span>`,
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        });
        const m = L.marker([p.lat, p.lng], { icon }).addTo(map);
        m.bindTooltip(`${p.nome} · ${p.ownerName}`, { direction: "top", offset: [0, -10] });
        m.bindPopup(
          `<div style="font-family:sans-serif">
            <b>${p.nome}</b><br/>
            <span style="opacity:.8">${p.tipo} · ${p.local}</span><br/>
            Dono: <b>${p.ownerName}${p.mine ? " (você)" : ""}</b><br/>
            Renda: R$ ${p.rendaLiquida.toLocaleString("pt-BR")} · Exposição ${p.exposicao}/10
          </div>`
        );
        bounds.extend([p.lat, p.lng]);
      });

      if (bounds.isValid()) map.fitBounds(bounds.pad(0.35));
      else map.setView([-22.92, -43.4], 11);
      setTimeout(() => map.invalidateSize(), 200);
    })();

    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [points]);

  return (
    <div
      ref={ref}
      style={{ height: "min(70vh, 560px)", width: "100%" }}
      className="rounded-xl border border-[color:var(--line)] overflow-hidden"
    />
  );
}
