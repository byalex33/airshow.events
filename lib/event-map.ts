import type { Airshow } from "./content";

export function groupEventsByCoordinates(events: Airshow[]) {
  const groups = new Map<string, { coordinates: Airshow["coordinates"]; events: Airshow[] }>();
  for (const event of events) {
    const key = event.coordinates.join(",");
    const group = groups.get(key);
    if (group) group.events.push(event);
    else groups.set(key, { coordinates: event.coordinates, events: [event] });
  }
  return [...groups.values()];
}
