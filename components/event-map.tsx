"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Airshow } from "@/lib/content";
import { groupEventsByCoordinates, mapDateLabel, mapMarkerLabel } from "@/lib/event-map";
export default function EventMap({ events }: { events: Airshow[] }) {
  const element = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!element.current) return;
    const map = L.map(element.current, { scrollWheelZoom: false }).setView(
      [54, -2.5],
      6,
    );
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18,
    }).addTo(map);
    const bounds: L.LatLngTuple[] = [];
    for (const group of groupEventsByCoordinates(events)) {
      bounds.push(group.coordinates);
      const popup = document.createElement("div");
      popup.className = "map-venue-events";
      for (const event of group.events) {
        const link = document.createElement("a");
        link.href = `/airshows/${event.slug}/`;
        const name = document.createElement("strong");
        name.textContent = event.name;
        const date = document.createElement("span");
        date.textContent = mapDateLabel(event);
        link.append(name, date);
        popup.append(link);
      }
      const label = mapMarkerLabel(group.events);
      const marker = L.marker(group.coordinates, {
        title: label,
        icon: L.divIcon({
          className: "airshow-marker",
          html: `<span>${group.events.length > 1 ? group.events.length : "✦"}</span>`,
          iconSize: [34, 34],
          iconAnchor: [17, 17],
        }),
      })
        .addTo(map)
        .bindPopup(popup, { maxHeight: 260 });
      marker.getElement()?.setAttribute("aria-label", label);
    }
    if (bounds.length) map.fitBounds(bounds, { padding: [55, 55], maxZoom: 9 });
    return () => {
      map.remove();
    };
  }, [events]);
  return (
    <div className="map-layout">
      <div
        className="map-canvas"
        ref={element}
        aria-label="Interactive map of filtered UK airshows"
      />
      <aside className="map-results">
        <span className="eyebrow">ON THE MAP</span>
        {events.map((e) => (
          <Link key={e.slug} href={`/airshows/${e.slug}/`}>
            <strong>{e.name}</strong>
            <span>{e.location}</span>
            <small>{mapDateLabel(e)}</small>
          </Link>
        ))}
      </aside>
    </div>
  );
}
