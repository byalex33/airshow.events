import { dateLabel, type Airshow } from "./content";

export function mapDateLabel(event: Pick<Airshow, "start" | "end">) {
  const startYear = event.start.slice(0, 4);
  const endYear = event.end.slice(0, 4);
  if (startYear === endYear) return `${dateLabel(event)} ${startYear}`;
  return `${dateLabel({ start: event.start, end: event.start })} ${startYear} – ${dateLabel({ start: event.end, end: event.end })} ${endYear}`;
}

export function mapMarkerLabel(events: Airshow[]) {
  if (events.length === 1) return `${events[0].name}: ${mapDateLabel(events[0])}`;
  const years = [...new Set(events.flatMap(event => [event.start.slice(0, 4), event.end.slice(0, 4)]))].sort();
  return `${events[0].location}: ${events.length} events, ${years.join(", ")}`;
}

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
