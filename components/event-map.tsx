"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { dateLabel, type Airshow } from "@/lib/content";
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
    for (const event of events) {
      bounds.push(event.coordinates);
      const popup = document.createElement("div");
      const link = document.createElement("a");
      link.href = `/airshows/${event.slug}/`;
      link.textContent = event.name;
      popup.append(
        link,
        document.createElement("br"),
        document.createTextNode(dateLabel(event)),
      );
      const marker = L.marker(event.coordinates, {
        title: event.name,
        icon: L.divIcon({
          className: "airshow-marker",
          html: "<span>✦</span>",
          iconSize: [34, 34],
          iconAnchor: [17, 17],
        }),
      })
        .addTo(map)
        .bindPopup(popup);
      marker.getElement()?.setAttribute("aria-label", event.name);
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
            <small>{dateLabel(e)}</small>
          </Link>
        ))}
      </aside>
    </div>
  );
}
